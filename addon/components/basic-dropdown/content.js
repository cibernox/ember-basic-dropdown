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
    }
    element.addEventListener('transitionend', eventCallback);
  } else if (computedStyle.animationName !== 'none' && computedStyle.animationPlayState === 'running') {
    let eventCallback = function() {
      element.removeEventListener('animationend', eventCallback);
      callback();
    }
    element.addEventListener('animationend', eventCallback);
  } else {
    callback();
  }
}

export default WormholeComponent.extend({
  layout,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    run.schedule('afterRender', this, function() {
      dropdown.classList.add('ember-basic-dropdown--transitioning-in');
        requestAnimationFrame(function() {
        waitForAnimations(dropdown, function() {
          dropdown.classList.remove('ember-basic-dropdown--transitioning-in');
          dropdown.classList.add('ember-basic-dropdown--transitioned-in');
        });
      });
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    let dropdown = self.window.document.getElementById(this.get('dropdownId'));
    let clone = dropdown.cloneNode(true);
    let parentElement = dropdown.parentElement;
    if (this.get('renderInPlace')) {
      parentElement = parentElement.parentElement;
    }
    clone.id = clone.id + '--clone';
    run.schedule('afterRender', function() {
      parentElement.appendChild(clone);
      requestAnimationFrame(function() {
        clone.classList.remove('ember-basic-dropdown--transitioned-in');
        clone.classList.remove('ember-basic-dropdown--transitioning-in');
        clone.classList.add('ember-basic-dropdown--transitioning-out');
        waitForAnimations(clone, function() {
          parentElement.removeChild(clone);
        });
      });
    });
  }
});
