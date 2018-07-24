import Component from '@ember/component';
import { computed } from '@ember/object';
import { join, scheduleOnce } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { htmlSafe } from '@ember/string';
import layout from '../../templates/components/basic-dropdown/content';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { getScrollParent } from '../../utils/calculate-position';
import {
  distributeScroll,
  getAvailableScroll,
  getScrollDeltas
} from '../../utils/scroll-helpers';

function closestContent(el) {
  while (el && (!el.classList || !el.classList.contains('ember-basic-dropdown-content'))) {
    el = el.parentElement;
  }
  return el;
}

function waitForAnimations(element, callback) {
  window.requestAnimationFrame(function() {
    let computedStyle = window.getComputedStyle(element);
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
  isTouchDevice: Boolean(!!window && 'ontouchstart' in window),
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
  destinationElement: computed('destination', function () {
    return document.getElementById(this.get('destination'));
  }),

  style: computed('top', 'left', 'right', 'width', 'height', 'otherStyles', function() {
    let style = '';
    let { top, left, right, width, height, otherStyles } = this.getProperties('top', 'left', 'right', 'width', 'height', 'otherStyles');

    if (otherStyles) {
      Object.keys(otherStyles).forEach((attr) => {
        style += `${attr}: ${otherStyles[attr]};`;
      });
    }

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
    this.wheelHandler = this.wheelHandler.bind(this);
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
    let {top, left, right, renderInPlace} = this.getProperties('top', 'left', 'right', 'renderInPlace');
    if ((!oldDropdown.isOpen || (top === null && left === null && right === null && renderInPlace === false)) && dropdown.isOpen) {
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
    document.addEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      document.addEventListener('touchstart', this.touchStartHandler, true);
      document.addEventListener('touchend', this.handleRootMouseDown, true);
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
    let onKeyDown = this.get('onKeyDown');
    if (onKeyDown) {
      this.dropdownElement.addEventListener('keydown', (e) => onKeyDown(dropdown, e));
    }

    dropdown.actions.reposition();

    // Always wire up events, even if rendered in place.
    this.scrollableAncestors = this.getScrollableAncestors();
    this.addGlobalEvents();
    this.addScrollHandling();
    this.startObservingDomMutations();

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
    window.addEventListener('resize', this.runloopAwareReposition);
    window.addEventListener('orientationchange', this.runloopAwareReposition);
  },

  startObservingDomMutations() {
    this.mutationObserver = new MutationObserver((mutations) => {
      if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
        this.runloopAwareReposition();
      }
    });
    this.mutationObserver.observe(this.dropdownElement, { childList: true, subtree: true });
  },

  removeGlobalEvents() {
    window.removeEventListener('resize', this.runloopAwareReposition);
    window.removeEventListener('orientationchange', this.runloopAwareReposition);
  },

  stopObservingDomMutations() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
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
    document.addEventListener('touchmove', this.touchMoveHandler, true);
  },

  touchMoveHandler() {
    this.hasMoved = true;
    document.removeEventListener('touchmove', this.touchMoveHandler, true);
  },

  wheelHandler(event) {
    const element = this.dropdownElement;
    if (element.contains(event.target) || element === event.target) {
      // Discover the amount of scrollable canvas that is within the dropdown.
      const availableScroll = getAvailableScroll(event.target, element);

      // Calculate what the event's desired change to that scrollable canvas is.
      let { deltaX, deltaY } = getScrollDeltas(event);

      // If the consequence of the wheel action would result in scrolling beyond
      // the scrollable canvas of the dropdown, call preventDefault() and clamp
      // the value of the delta to the available scroll size.
      if (deltaX < availableScroll.deltaXNegative) {
        deltaX = availableScroll.deltaXNegative;
        event.preventDefault();
      } else if (deltaX > availableScroll.deltaXPositive) {
        deltaX = availableScroll.deltaXPositive;
        event.preventDefault();
      } else if (deltaY < availableScroll.deltaYNegative) {
        deltaY = availableScroll.deltaYNegative;
        event.preventDefault();
      } else if (deltaY > availableScroll.deltaYPositive) {
        deltaY = availableScroll.deltaYPositive;
        event.preventDefault();
      }

      // Add back in the default behavior for the two good states that the above
      // `preventDefault()` code will break.
      // - Two-axis scrolling on a one-axis scroll container
      // - The last relevant wheel event if the scroll is overshooting

      // Also, don't attempt to do this if both of `deltaX` or `deltaY` are 0.
      if (event.defaultPrevented && (deltaX || deltaY)) {
        distributeScroll(deltaX, deltaY, event.target, element);
      }
    } else {
      // Scrolling outside of the dropdown is prohibited.
      event.preventDefault();
    }
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

  addScrollHandling() {
    if (this.get('preventScroll') === true) {
      this.addPreventScrollEvent();
      this.removeScrollHandling = this.removePreventScrollEvent;
    } else {
      this.addScrollEvents();
      this.removeScrollHandling = this.removeScrollEvents;
    }
  },

  // Assigned at runtime to ensure that changes to the `preventScroll` property
  // don't result in not cleaning up after ourselves.
  removeScrollHandling() {},

  // These two functions wire up scroll handling if `preventScroll` is true.
  // These prevent all scrolling that isn't inside of the dropdown.
  addPreventScrollEvent() {
    document.addEventListener('wheel', this.wheelHandler, { capture: true, passive: false });
  },
  removePreventScrollEvent() {
    document.removeEventListener('wheel', this.wheelHandler, { capture: true, passive: false });
  },

  // These two functions wire up scroll handling if `preventScroll` is false.
  // These trigger reposition of the dropdown.
  addScrollEvents() {
    window.addEventListener('scroll', this.runloopAwareReposition);
    this.scrollableAncestors.forEach((el) => {
      el.addEventListener('scroll', this.runloopAwareReposition);
    });
  },
  removeScrollEvents() {
    window.removeEventListener('scroll', this.runloopAwareReposition);
    this.scrollableAncestors.forEach((el) => {
      el.removeEventListener('scroll', this.runloopAwareReposition);
    });
  },

  _teardown() {
    this.removeGlobalEvents();
    this.removeScrollHandling();
    this.scrollableAncestors = [];
    this.stopObservingDomMutations();
    document.removeEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      document.removeEventListener('touchstart', this.touchStartHandler, true);
      document.removeEventListener('touchend', this.handleRootMouseDown, true);
    }
  }
});
