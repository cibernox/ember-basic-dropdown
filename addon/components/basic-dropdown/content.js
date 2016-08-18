import Component from 'ember-component';
import layout from '../../templates/components/basic-dropdown/content';
import config from 'ember-get-config';
import $ from 'jquery';
import Ember from 'ember';
import computed from 'ember-computed';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { join, scheduleOnce } from 'ember-runloop';
import { htmlSafe } from 'ember-string';

const defaultDestination = config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
const { testing } = Ember;
const MutObserver = self.window.MutationObserver || self.window.WebKitMutationObserver;
const rAF = self.window.requestAnimationFrame || function(cb) {
  cb();
};

function waitForAnimations(element, callback) {
  rAF(function() {
    let computedStyle = self.window.getComputedStyle(element);
    if (computedStyle.transitionDuration && computedStyle.transitionDuration !== '0s') {
      let eventCallback = function() {
        element.removeEventListener('transitionend', eventCallback);
        callback();
      };
      element.addEventListener('transitionend', eventCallback);
    } else if (computedStyle.animationName !== 'none' && computedStyle.animationPlayState === 'running') {
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

export default Component.extend({
  layout,
  tagName: '',
  to: fallbackIfUndefined(testing ? 'ember-testing' : defaultDestination),
  animationEnabled: !testing,
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  hasMoved: false,
  animationClass: '',
  transitioningInClass: 'ember-basic-dropdown--transitioning-in',
  transitionedInClass: 'ember-basic-dropdown--transitioned-in',
  transitioningOutClass: 'ember-basic-dropdown--transitioning-out',

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    let dropdown = this.get('dropdown');
    this.triggerId = `ember-basic-dropdown-trigger-${dropdown.uniqueId}`;
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
  style: computed('top', 'left', 'right', 'width', function() {
    let style = '';
    let { top, left, right, width } = this.getProperties('top', 'left', 'right', 'width');
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
      style += `width: ${width}`;
    }
    if (style.length > 0) {
      return htmlSafe(style);
    }
  }),

  // Methods
  open() {
    let dropdown = this.get('dropdown');
    let appRoot = this.get('appRoot');
    this.triggerElement = this.triggerElement || document.getElementById(this.triggerId);
    this.dropdownElement = document.getElementById(this.dropdownId);
    appRoot.addEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      appRoot.addEventListener('touchstart', this.touchStartHandler, true);
      appRoot.addEventListener('touchend', this.handleRootMouseDown, true);
    }
    let onFocusIn = this.get('onFocusIn');
    if (onFocusIn) {
      this.dropdownElement.addEventListener('focusin', (e) => onFocusIn(dropdown, e));
    }
    let onFocusOut = this.get('onFocusOut');
    if (onFocusOut) {
      this.dropdownElement.addEventListener('focusout', (e) => onFocusOut(dropdown, e));
    }
    if (!this.get('renderInPlace')) {
      this.addGlobalEvents();
    }
    dropdown.actions.reposition();
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

    let closestDropdown = $(e.target).closest('.ember-basic-dropdown-content').get(0);
    if (closestDropdown) {
      let trigger = document.querySelector(`[aria-controls=${closestDropdown.attributes.id.value}]`);
      let parentDropdown = $(trigger).closest('.ember-basic-dropdown-content').get(0);
      if (parentDropdown && parentDropdown.attributes.id.value === this.dropdownId) {
        this.hasMoved = false;
        return;
      }
    }

    this.get('dropdown').actions.close(e, true);
  },

  addGlobalEvents() {
    self.window.addEventListener('scroll', this.runloopAwareReposition);
    self.window.addEventListener('resize', this.runloopAwareReposition);
    self.window.addEventListener('orientationchange', this.runloopAwareReposition);
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
    self.window.removeEventListener('resize', this.runloopAwareReposition);
    self.window.removeEventListener('orientationchange', this.runloopAwareReposition);
    if (MutObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      this.dropdownElement.removeEventListener('DOMNodeInserted', this.runloopAwareReposition);
      this.dropdownElement.removeEventListener('DOMNodeRemoved', this.runloopAwareReposition);
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
    let $clone = $(clone);
    let transitioningInClass = this.get('transitioningInClass');
    $clone.removeClass(this.get('transitionedInClass'));
    $clone.removeClass(transitioningInClass);
    $clone.addClass(this.get('transitioningOutClass'));
    parentElement.appendChild(clone);
    this.set('animationClass', transitioningInClass);
    waitForAnimations(clone, function() {
      parentElement.removeChild(clone);
    });
  },

  touchStartHandler() {
    this.get('appRoot').addEventListener('touchmove', this.touchMoveHandler, true);
  },

  touchMoveHandler() {
    this.hasMoved = true;
    this.get('appRoot').removeEventListener('touchmove', this.touchMoveHandler, true);
  },

  _teardown() {
    let appRoot = this.get('appRoot');
    this.removeGlobalEvents();
    appRoot.removeEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('isTouchDevice')) {
      appRoot.removeEventListener('touchstart', this.touchStartHandler, true);
      appRoot.removeEventListener('touchend', this.handleRootMouseDown, true);
    }
  }
});
