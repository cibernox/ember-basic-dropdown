import WormholeComponent from 'ember-wormhole/components/ember-wormhole';
import Ember from 'ember';
import layout from '../../templates/components/basic-dropdown/content';

const { run } = Ember;

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
  transitionClass: 'ember-basic-dropdown--transitioning-in',

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    if (!this.get('renderInPlace')) {
      this._subscribeToFocusEvents(dropdown);
    }
    this._animateIn(dropdown);
  },

  willDestroyElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    this._animateOut(dropdown);
  },

  // Methods
  _animateIn(dropdown) {
    waitForAnimations(dropdown, () => {
      this.set('animationClass', 'ember-basic-dropdown--transitioned-in');
    });
  },

  _animateOut(dropdown) {
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

  _subscribeToFocusEvents(dropdown) {
    dropdown.addEventListener('focusin', this.get('onFocusIn'));
    dropdown.addEventListener('focusout', this.get('onFocusOut'));
  }
});
