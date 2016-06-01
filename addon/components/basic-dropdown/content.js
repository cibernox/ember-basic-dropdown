import Component from 'ember-component';
import layout from '../../templates/components/basic-dropdown/content';
import config from 'ember-get-config';
import $ from 'jquery';
import Ember from 'ember';
import run from 'ember-runloop';

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
  to: testing ? 'ember-testing' : defaultDestination,
  animationEnabled: true,
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  hasMoved: false,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchMoveHandler = this.touchMoveHandler.bind(this);
  },

  // Actions
  actions: {
    didOpen() {
      let appRoot = this.getAttr('appRoot');
      let dropdown = this.getAttr('dropdown');
      this.dropdownElement = document.getElementById(this.elementId);
      let triggerId = this.getAttr('triggerId');
      if (triggerId) {
        this.triggerElement = document.getElementById(triggerId);
      }
      appRoot.addEventListener('mousedown', this.handleRootMouseDown, true);
      if (this.get('isTouchDevice')) {
        appRoot.addEventListener('touchstart', this.touchStartHandler, true);
        appRoot.addEventListener('touchend', this.handleRootMouseDown, true);
      }

      let onFocusIn = this.getAttr('onFocusIn');
      if (onFocusIn) {
        this.dropdownElement.addEventListener('focusin', (e) => onFocusIn(dropdown, e));
      }
      let onFocusOut = this.getAttr('onFocusOut');
      if (onFocusOut) {
        this.dropdownElement.addEventListener('focusout', (e) => onFocusOut(dropdown, e));
      }

      if (!this.getAttr('renderInPlace')) {
        this.addGlobalEvents();
      }
      run.scheduleOnce('actions', dropdown.actions.reposition);
      if (this.get('animationEnabled')) {
        run.scheduleOnce('actions', this, this.animateIn, this.dropdownElement);
      }
    },

    willClose() {
      let appRoot = this.getAttr('appRoot');
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
    this.getAttr('dropdown').actions.close(e);
  },

  addGlobalEvents() {
    let { reposition } = this.getAttr('dropdown').actions;
    self.window.addEventListener('scroll', reposition);
    self.window.addEventListener('resize', reposition);
    self.window.addEventListener('orientationchange', reposition);
    if (MutObserver) {
      this.mutationObserver = new MutObserver((mutations) => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          reposition();
        }
      });
      this.mutationObserver.observe(this.dropdownElement, { childList: true, subtree: true });
    } else {
      this.dropdownElement.addEventListener('DOMNodeInserted', reposition, false);
      this.dropdownElement.addEventListener('DOMNodeRemoved', reposition, false);
    }
  },

  removeGlobalEvents() {
    let { reposition } = this.getAttr('dropdown').actions;
    self.window.removeEventListener('scroll', reposition);
    self.window.removeEventListener('resize', reposition);
    self.window.removeEventListener('orientationchange', reposition);
    if (MutObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      this.dropdownElement.removeEventListener('DOMNodeInserted', reposition);
      this.dropdownElement.removeEventListener('DOMNodeRemoved', reposition);
    }
  },

  animateIn(dropdownElement) {
    let $el = $(dropdownElement);
    $el.addClass('ember-basic-dropdown--transitioning-in');
    waitForAnimations(dropdownElement, () => {
      $el.removeClass('ember-basic-dropdown--transitioning-in');
      $el.addClass('ember-basic-dropdown--transitioned-in');
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
