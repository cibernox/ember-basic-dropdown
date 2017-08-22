import Component from '@ember/component';
import { computed } from '@ember/object';
import { join, scheduleOnce } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { htmlSafe } from '@ember/string';
import { deprecate } from '@ember/debug';
import layout from '../../templates/components/basic-dropdown/content';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { getScrollParent } from '../../utils/calculate-position';

function closestContent(el) {
  while (el && (!el.classList || !el.classList.contains('ember-basic-dropdown-content'))) {
    el = el.parentElement;
  }
  return el;
}
const MutObserver = self.window.MutationObserver || self.window.WebKitMutationObserver;
const rAF = self.window.requestAnimationFrame || function(cb) {
  cb();
};

function waitForAnimations(element, callback) {
  rAF(function() {
    let computedStyle = self.window.getComputedStyle(element);
    if (computedStyle.animationName !== 'none' && computedStyle.animationPlayState === 'running') {
      let eventCallback = function() {
        element.removeEventListener('animationend', eventCallback);
        callback();
      };
      element.addEventListener('animationend', eventCallback);
    } else {
      callback();
    }
  });
}

/**
 * Evaluates if the given element is in a dropdown or any of its parent dropdowns.
 *
 * @param {HTMLElement} el
 * @param {String} dropdownId
 */
function dropdownIsValidParent(el, dropdownId) {
  let closestDropdown = closestContent(el);
  if (closestDropdown) {
    let trigger = document.querySelector(`[aria-owns=${closestDropdown.attributes.id.value}]`);
    let parentDropdown = closestContent(trigger);
    return parentDropdown && parentDropdown.attributes.id.value === dropdownId || dropdownIsValidParent(parentDropdown, dropdownId);
  } else {
    return false;
  }
}


export default Component.extend({
  layout,
  tagName: '',
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  hasMoved: false,
  animationClass: '',
  transitioningInClass: 'ember-basic-dropdown--transitioning-in',
  transitionedInClass: 'ember-basic-dropdown--transitioned-in',
  transitioningOutClass: 'ember-basic-dropdown--transitioning-out',

  // CPs
  _contentTagName: fallbackIfUndefined('div'),
  animationEnabled: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment');
    return config.environment !== 'test';
  }),

  to: computed('destination', {
    get() {
      return this.get('destination');
    },
    set(_, v) {
      deprecate('Passing `to="id-of-elmnt"` to the {{#dropdown.content}} has been deprecated. Please pass `destination="id-of-elmnt"` to the {{#basic-dropdown}} component instead', false, { id: 'ember-basic-dropdown-to-in-content', until: '0.40' });
      return v === undefined ? this.get('destination') : v;
    }
  }),

  style: computed('top', 'left', 'right', 'width', 'height', function() {
    let style = '';
    let { top, left, right, width, height } = this.getProperties('top', 'left', 'right', 'width', 'height');
    if (top) {
      style += `top: ${top};`;
    }
    if (left) {
      style += `left: ${left};`;
    }
    if (right) {
      style += `right: ${right};`;
    }
    if (width) {
      style += `width: ${width};`;
    }
    if (height) {
      style += `height: ${height}`;
    }
    if (style.length > 0) {
      return htmlSafe(style);
    }
  }),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    let dropdown = this.get('dropdown');
    this.scrollableAncestors = [];
    this.dropdownId = `ember-basic-dropdown-content-${dropdown.uniqueId}`;
    if (this.get('animationEnabled')) {
      this.set('animationClass', this.get('transitioningInClass'));
    }
    this.runloopAwareReposition = function() {
      join(dropdown.actions.reposition);
    };
  },

  willDestroyElement() {
    this._super(...arguments);
    this._teardown();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let oldDropdown = this.get('oldDropdown') || {};
    let dropdown = this.get('dropdown');

    // The following condition checks whether we need to open the dropdown - either because it was
    // closed and is now open or because it was open and then it was closed and opened pretty much at
    // the same time, indicated by `top`, `left` and `right` being null.
    let {top, left, right} = this.getProperties('top', 'left', 'right');
    if ((!oldDropdown.isOpen || (top === null && left === null && right === null)) && dropdown.isOpen) {
      scheduleOnce('afterRender', this, this.open);
    } else if (oldDropdown.isOpen && !dropdown.isOpen) {
      this.close();
    }
    this.set('oldDropdown', dropdown);
  },

  // Methods
  open() {
    let dropdown = this.get('dropdown');
    this.triggerElement = this.triggerElement || document.querySelector(`[data-ebd-id=${dropdown.uniqueId}-trigger]`);
    this.dropdownElement = document.getElementById(this.dropdownId);
    self.document.addEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      self.document.addEventListener('touchstart', this.touchStartHandler, true);
      self.document.addEventListener('touchend', this.handleRootMouseDown, true);
    }
    let onFocusIn = this.get('onFocusIn');
    if (onFocusIn) {
      this.dropdownElement.addEventListener('focusin', (e) => onFocusIn(dropdown, e));
    }
    let onFocusOut = this.get('onFocusOut');
    if (onFocusOut) {
      this.dropdownElement.addEventListener('focusout', (e) => onFocusOut(dropdown, e));
    }
    let onMouseEnter = this.get('onMouseEnter');
    if (onMouseEnter) {
      this.dropdownElement.addEventListener('mouseenter', (e) => onMouseEnter(dropdown, e));
    }
    let onMouseLeave = this.get('onMouseLeave');
    if (onMouseLeave) {
      this.dropdownElement.addEventListener('mouseleave', (e) => onMouseLeave(dropdown, e));
    }
    let changes = dropdown.actions.reposition();
    if (!this.get('renderInPlace')) {
      this.destinationElement = document.getElementById(this.get('destination'));
      this.scrollableAncestors = this.getScrollableAncestors();
      this.addGlobalEvents();
      this.startObservingDomMutations();
    } else if (changes.vPosition === 'above') {
      this.startObservingDomMutations();
    }

    if (this.get('animationEnabled')) {
      scheduleOnce('afterRender', this, this.animateIn);
    }
  },

  close() {
    this._teardown();
    if (this.get('animationEnabled')) {
      this.animateOut(this.dropdownElement);
    }
    this.dropdownElement = null;
  },

  // Methods
  handleRootMouseDown(e) {
    if (this.hasMoved || this.dropdownElement.contains(e.target) || this.triggerElement && this.triggerElement.contains(e.target)) {
      this.hasMoved = false;
      return;
    }

    if (dropdownIsValidParent(e.target, this.dropdownId)) {
      this.hasMoved = false;
      return;
    }

    this.get('dropdown').actions.close(e, true);
  },

  addGlobalEvents() {
    self.window.addEventListener('scroll', this.runloopAwareReposition);
    this.scrollableAncestors.forEach((el) => {
      el.addEventListener('scroll', this.runloopAwareReposition);
    });
    self.window.addEventListener('resize', this.runloopAwareReposition);
    self.window.addEventListener('orientationchange', this.runloopAwareReposition);
  },

  startObservingDomMutations() {
    if (MutObserver) {
      this.mutationObserver = new MutObserver((mutations) => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          this.runloopAwareReposition();
        }
      });
      this.mutationObserver.observe(this.dropdownElement, { childList: true, subtree: true });
    } else {
      this.dropdownElement.addEventListener('DOMNodeInserted', this.runloopAwareReposition, false);
      this.dropdownElement.addEventListener('DOMNodeRemoved', this.runloopAwareReposition, false);
    }
  },

  removeGlobalEvents() {
    self.window.removeEventListener('scroll', this.runloopAwareReposition);
    this.scrollableAncestors.forEach((el) => {
      el.removeEventListener('scroll', this.runloopAwareReposition);
    });
    self.window.removeEventListener('resize', this.runloopAwareReposition);
    self.window.removeEventListener('orientationchange', this.runloopAwareReposition);
  },

  stopObservingDomMutations() {
    if (MutObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      if (this.dropdownElement) {
        this.dropdownElement.removeEventListener('DOMNodeInserted', this.runloopAwareReposition);
        this.dropdownElement.removeEventListener('DOMNodeRemoved', this.runloopAwareReposition);
      }
    }
  },

  animateIn() {
    waitForAnimations(this.dropdownElement, () => {
      this.set('animationClass', this.get('transitionedInClass'));
    });
  },

  animateOut(dropdownElement) {
    let parentElement = this.get('renderInPlace') ? dropdownElement.parentElement.parentElement : dropdownElement.parentElement;
    let clone = dropdownElement.cloneNode(true);
    clone.id = `${clone.id}--clone`;
    let transitioningInClass = this.get('transitioningInClass');
    clone.classList.remove(...transitioningInClass.split(' '));
    clone.classList.add(...this.get('transitioningOutClass').split(' '));
    parentElement.appendChild(clone);
    this.set('animationClass', transitioningInClass);
    waitForAnimations(clone, function() {
      parentElement.removeChild(clone);
    });
  },

  touchStartHandler() {
    self.document.addEventListener('touchmove', this.touchMoveHandler, true);
  },

  touchMoveHandler() {
    this.hasMoved = true;
    self.document.removeEventListener('touchmove', this.touchMoveHandler, true);
  },

  // All ancestors with scroll (except the BODY, which is treated differently)
  getScrollableAncestors() {
    let scrollableAncestors = [];
    if (this.triggerElement) {
      let nextScrollable = getScrollParent(this.triggerElement.parentNode);
      while (nextScrollable && nextScrollable.tagName.toUpperCase() !== 'BODY' && nextScrollable.tagName.toUpperCase() !== 'HTML') {
        scrollableAncestors.push(nextScrollable);
        nextScrollable = getScrollParent(nextScrollable.parentNode);
      }
    }
    return scrollableAncestors;
  },

  _teardown() {
    this.removeGlobalEvents();
    this.destinationElement = null;
    this.scrollableAncestors = [];
    this.stopObservingDomMutations();
    self.document.removeEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      self.document.removeEventListener('touchstart', this.touchStartHandler, true);
      self.document.removeEventListener('touchend', this.handleRootMouseDown, true);
    }
  }
});
