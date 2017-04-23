import Component from 'ember-component';
import layout from '../../templates/components/basic-dropdown/content';
import Ember from 'ember';
import computed from 'ember-computed';
import { join, scheduleOnce } from 'ember-runloop';
import { htmlSafe } from 'ember-string';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';

function closestContent(el) {
  while (el && !el.classList.contains('ember-basic-dropdown-content')) {
    el = el.parentElement;
  }
  return el;
}
const { testing } = Ember;
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

function getScrollParent(element) {
    var style = self.window.getComputedStyle(element);
    var excludeStaticParent = style.position === "absolute";
    var overflowRegex = /(auto|scroll)/;

    if (style.position === "fixed") return document.body;
    for (var parent = element; (parent = parent.parentElement);) {
        style = self.window.getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
          return parent;
        }
    }

    return document.body;
}

export default Component.extend({
  layout,
  tagName: '',
  animationEnabled: !testing,
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  hasMoved: false,
  animationClass: '',
  transitioningInClass: 'ember-basic-dropdown--transitioning-in',
  transitionedInClass: 'ember-basic-dropdown--transitioned-in',
  transitioningOutClass: 'ember-basic-dropdown--transitioning-out',

  _contentTagName: fallbackIfUndefined('div'),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    let dropdown = this.get('dropdown');
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
    if (!oldDropdown.isOpen && dropdown.isOpen) {
      scheduleOnce('afterRender', this, this.open);
    } else if (oldDropdown.isOpen && !dropdown.isOpen) {
      this.close();
    }
    this.set('oldDropdown', dropdown);
  },

  // CPs
  to: computed('destination', {
    get() {
      return this.get('destination');
    },
    set(_, v) {
      Ember.deprecate('Passing `to="id-of-elmnt"` to the {{#dropdown.content}} has been deprecated. Please pass `destination="id-of-elmnt"` to the {{#basic-dropdown}} component instead', false, { id: 'ember-basic-dropdown-to-in-content', until: '0.40' });
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

  // Methods
  open() {
    let dropdown = this.get('dropdown');
    this.triggerElement = this.triggerElement || document.querySelector(`[data-ebd-id=${dropdown.uniqueId}-trigger]`);
    this.dropdownElement = document.getElementById(this.dropdownId);
    self.document.body.addEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      self.document.body.addEventListener('touchstart', this.touchStartHandler, true);
      self.document.body.addEventListener('touchend', this.handleRootMouseDown, true);
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

    let closestDropdown = closestContent(e.target);
    if (closestDropdown) {
      let trigger = document.querySelector(`[aria-owns=${closestDropdown.attributes.id.value}]`);
      let parentDropdown = closestContent(trigger);
      if (parentDropdown && parentDropdown.attributes.id.value === this.dropdownId) {
        this.hasMoved = false;
        return;
      }
    }

    this.get('dropdown').actions.close(e, true);
  },

  addGlobalEvents() {
    if (this.destinationElement.parentNode.tagName !== 'BODY') {
      self.window.addEventListener('scroll', this.runloopAwareReposition);
    }
    // if (this.get('destination') !== this.get('defaultDestination')) {
    //   this.closestScrollableNode = getScrollParent(this.triggerElement);
    //   if (this.closestScrollableNode) {
    //     this.closestScrollableNode.addEventListener('scroll', this.runloopAwareReposition);
    //   }
    // }
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
    // if (this.get('destination') !== this.get('defaultDestination')) {
    //   if (this.closestScrollableNode) {
    //     this.closestScrollableNode.removeEventListener('scroll', this.runloopAwareReposition);
    //   }
    //   this.closestScrollableNode = null;
    // }
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
    clone.classList.remove(this.get('transitionedInClass'));
    clone.classList.remove(transitioningInClass);
    clone.classList.add(this.get('transitioningOutClass'));
    parentElement.appendChild(clone);
    this.set('animationClass', transitioningInClass);
    waitForAnimations(clone, function() {
      parentElement.removeChild(clone);
    });
  },

  touchStartHandler() {
    self.document.body.addEventListener('touchmove', this.touchMoveHandler, true);
  },

  touchMoveHandler() {
    this.hasMoved = true;
    self.document.body.removeEventListener('touchmove', this.touchMoveHandler, true);
  },

  _teardown() {
    this.removeGlobalEvents();
    this.destinationElement = null;
    this.stopObservingDomMutations();
    self.document.body.removeEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      self.document.body.removeEventListener('touchstart', this.touchStartHandler, true);
      self.document.body.removeEventListener('touchend', this.handleRootMouseDown, true);
    }
  }
});
