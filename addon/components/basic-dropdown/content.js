import WormholeComponent from 'ember-wormhole/components/ember-wormhole';
import layout from '../../templates/components/basic-dropdown/content';

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
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this, dropdown);
    this.get('appRoot').addEventListener('mousedown', this.handleRootMouseDown, true);
    if (!this.get('renderInPlace')) {
      dropdown.addEventListener('focusin', this.get('onFocusIn'));
      dropdown.addEventListener('focusout', this.get('onFocusOut'));
    }
    waitForAnimations(dropdown, () => this.set('animationClass', 'ember-basic-dropdown--transitioned-in'));
  },

  willDestroyElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    this.get('appRoot').removeEventListener('mousedown', this.handleRootMouseDown, true);
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
    let closestDDcontent = $(e.target).closest('.ember-basic-dropdown-content')[0];
    if (closestDDcontent) {
      let closestDropdownId = closestDDcontent.id.match(/ember\d+$/)[0];
      let clickedOnNestedDropdown = !!dropdownContent.querySelector('#' + closestDropdownId);
      if (clickedOnNestedDropdown) { return; }
    }
    this.get('close')(e, true);
  },
});
