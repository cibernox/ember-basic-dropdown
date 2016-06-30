import Component from 'ember-component';
import layout from '../../templates/components/basic-dropdown/content';
import config from 'ember-get-config';
import $ from 'jquery';
import Ember from 'ember';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { join, scheduleOnce } from 'ember-runloop';

const defaultDestination = config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
const { testing } = Ember;
const MutObserver = self.window.MutationObserver || self.window.WebKitMutationObserver;
function waitForAnimations(element, callback) {
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
}

export default Component.extend({
  layout,
  tagName: '',
  to: fallbackIfUndefined(testing ? 'ember-testing' : defaultDestination),
  animationEnabled: !testing,
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  hasMoved: false,
  animationClass: '',

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    let dropdown = this.get('dropdown');
    this.triggerId = `ember-basic-dropdown-trigger-${dropdown._id}`;
    this.dropdownId = `ember-basic-dropdown-content-${dropdown._id}`;
    if (this.get('animationEnabled')) {
      this.set('animationClass', 'ember-basic-dropdown--transitioning-in');
    }
    this.runloopAwareReposition = function() {
      join(dropdown.actions.reposition);
    };
  },

  // Actions
  actions: {
    didOpen() {
      let appRoot = this.get('appRoot');
      let dropdown = this.get('dropdown');
      this.dropdownElement = document.getElementById(this.dropdownId);
      let triggerId = this.get('triggerId');
      if (triggerId) {
        this.triggerElement = document.getElementById(this.triggerId);
      }
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

    willClose() {
      let appRoot = this.get('appRoot');
      this.removeGlobalEvents();
      appRoot.removeEventListener('mousedown', this.handleRootMouseDown, true);
      if (this.get('isTouchDevice')) {
        appRoot.removeEventListener('touchstart', this.touchStartHandler, true);
        appRoot.removeEventListener('touchend', this.handleRootMouseDown, true);
      }
      if (this.get('animationEnabled')) {
        this.animateOut(this.dropdownElement);
      }
      this.dropdownElement = this.triggerElement = null;
    }
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
      this.set('animationClass', 'ember-basic-dropdown--transitioned-in');
    });
  },

  animateOut(dropdownElement) {
    let parentElement = this.get('renderInPlace') ? dropdownElement.parentElement.parentElement : dropdownElement.parentElement;
    let clone = dropdownElement.cloneNode(true);
    clone.id = `${clone.id}--clone`;
    let $clone = $(clone);
    $clone.removeClass('ember-basic-dropdown--transitioned-in');
    $clone.removeClass('ember-basic-dropdown--transitioning-in');
    $clone.addClass('ember-basic-dropdown--transitioning-out');
    parentElement.appendChild(clone);
    this.set('animationClass', 'ember-basic-dropdown--transitioning-in');
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
  }
});
