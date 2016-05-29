import WormholeComponent from 'ember-wormhole/components/ember-wormhole';
import Ember from 'ember';
import layout from '../../templates/components/basic-dropdown/content';

const { run } = Ember;
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

export default WormholeComponent.extend({
  layout,
  hasMoved: false,
  mutationObserver: null,
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    let appRoot = this.get('appRoot');

    this.handleRootMouseDown = this.handleRootMouseDown.bind(this, dropdown);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchMoveHandler = this.touchMoveHandler.bind(this);

    appRoot.addEventListener('mousedown', this.handleRootMouseDown, true);

    if (this.get('isTouchDevice')){
      appRoot.addEventListener('touchstart', this.touchStartHandler, true);
      appRoot.addEventListener('touchend', this.handleRootMouseDown, true);
    }

    if (!this.get('renderInPlace')) {
      dropdown.addEventListener('focusin', this.get('onFocusIn'));
      dropdown.addEventListener('focusout', this.get('onFocusOut'));
      this.addGlobalEvents(dropdown);
    }
    run.scheduleOnce('actions', this.get('reposition'));
    if (this.getAttr('animationEnabled')) {
      run.scheduleOnce('actions', this, this.animateIn, dropdown);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    let appRoot = this.get('appRoot');

    appRoot.removeEventListener('mousedown', this.handleRootMouseDown, true);

    if (this.get('isTouchDevice')){
      appRoot.removeEventListener('touchstart', this.touchStartHandler, true);
      appRoot.removeEventListener('touchend', this.handleRootMouseDown, true);
    }

    this.removeGlobalEvents(dropdown);
    if (this.getAttr('animationEnabled')) {
      this.animateOut(dropdown);
    }
  },

  // Methods
  animateIn(dropdown) {
    this.set('transitionClass', 'ember-basic-dropdown--transitioning-in');
    waitForAnimations(dropdown, () => this.set('ember-basic-dropdown--transitioned-in'));
  },

  animateOut(dropdown) {
    let parentElement = this.get('renderInPlace') ? dropdown.parentElement.parentElement : dropdown.parentElement;
    let clone = dropdown.cloneNode(true);
    clone.id = clone.id + '--clone';
    let $clone = Ember.$(clone);
    $clone.removeClass('ember-basic-dropdown--transitioned-in');
    $clone.removeClass('ember-basic-dropdown--transitioning-in');
    $clone.addClass('ember-basic-dropdown--transitioning-out');
    parentElement.appendChild(clone);
    waitForAnimations(clone, function() {
      parentElement.removeChild(clone);
    });
  },

  handleRootMouseDown(dropdownContent, e) {
    if (this.hasMoved){
      this.hasMoved = false;
      return;
    }
    let triggerElement = document.getElementById(this.getAttr('triggerId'));
    let comesFromInside = dropdownContent.contains(e.target) || triggerElement.contains(e.target);
    if (comesFromInside) { return; }
    let closestDDcontent = Ember.$(e.target).closest('.ember-basic-dropdown-content')[0];
    if (closestDDcontent) {
      let closestDropdownId = closestDDcontent.id.match(/ember\d+$/)[0];
      let clickedOnNestedDropdown = !!dropdownContent.querySelector('#' + closestDropdownId);
      if (clickedOnNestedDropdown) { return; }
    }
    this.get('dropdown.actions.close')(e, true);
  },

  addGlobalEvents(dropdown) {
    let reposition = this.get('reposition');
    self.window.addEventListener('scroll', reposition);
    self.window.addEventListener('resize', reposition);
    self.window.addEventListener('orientationchange', reposition);
    if (MutObserver) {
      this.mutationObserver = new MutObserver(mutations => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          reposition();
        }
      });
      this.mutationObserver.observe(dropdown, { childList: true, subtree: true });
    } else {
      dropdown.addEventListener('DOMNodeInserted', reposition, false);
      dropdown.addEventListener('DOMNodeRemoved', reposition, false);
    }
  },

  removeGlobalEvents(dropdown) {
    let reposition = this.get('reposition');
    self.window.removeEventListener('scroll', reposition);
    self.window.removeEventListener('resize', reposition);
    self.window.removeEventListener('orientationchange', reposition);
    if (MutObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      dropdown.removeEventListener('DOMNodeInserted', reposition);
      dropdown.removeEventListener('DOMNodeRemoved', reposition);
    }
  },

  touchMoveHandler () {
    this.hasMoved = true;
    this.get('appRoot').removeEventListener('touchmove', this.touchMoveHandler, true);
  },

  touchStartHandler () {
    this.get('appRoot').addEventListener('touchmove', this.touchMoveHandler, true);
  }
});
