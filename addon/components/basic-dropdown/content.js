import WormholeComponent from 'ember-wormhole/components/ember-wormhole';
import Ember from 'ember';
import layout from '../../templates/components/basic-dropdown/content';

const { run } = Ember;
const MutObserver = self.window.MutationObserver || self.window.WebKitMutationObserver;
function waitForAnimations(element, callback) {
  let computedStyle = self.window.getComputedStyle(element);
  if (computedStyle.transitionDuration !== '0s') {
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
  mutationObserver: null,
  transitionClass: 'ember-basic-dropdown--transitioning-in',

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this, dropdown);
    this.get('appRoot').addEventListener('mousedown', this.handleRootMouseDown, true);
    if (!this.get('renderInPlace')) {
      dropdown.addEventListener('focusin', this.get('onFocusIn'));
      dropdown.addEventListener('focusout', this.get('onFocusOut'));
      this.addGlobalEvents(dropdown);
    }
    run.scheduleOnce('actions', this.get('reposition'));
    waitForAnimations(dropdown, () => this.set('animationClass', 'ember-basic-dropdown--transitioned-in'));
  },

  willDestroyElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    this.get('appRoot').removeEventListener('mousedown', this.handleRootMouseDown, true);
    this.removeGlobalEvents(dropdown);
    this.animateOut(dropdown);
  },

  // Methods
  animateOut(dropdown) {
    let parentElement = this.get('renderInPlace') ? dropdown.parentElement.parentElement : dropdown.parentElement;
    let clone = dropdown.cloneNode(true);
    clone.id = clone.id + '--clone';
    clone.classList.remove('ember-basic-dropdown--transitioned-in');
    clone.classList.remove('ember-basic-dropdown--transitioning-in');
    clone.classList.add('ember-basic-dropdown--transitioning-out');
    parentElement.appendChild(clone);
    waitForAnimations(clone, function() {
      parentElement.removeChild(clone);
    });
  },

  handleRootMouseDown(dropdownContent, e) {
    let comesFromInside = this.element.parentElement.contains(e.target) || dropdownContent.contains(e.target);
    if (comesFromInside) { return; }
    let closestDDcontent = Ember.$(e.target).closest('.ember-basic-dropdown-content')[0];
    if (closestDDcontent) {
      let closestDropdownId = closestDDcontent.id.match(/ember\d+$/)[0];
      let clickedOnNestedDropdown = !!dropdownContent.querySelector('#' + closestDropdownId);
      if (clickedOnNestedDropdown) { return; }
    }
    this.get('close')(e, true);
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
  }
});
