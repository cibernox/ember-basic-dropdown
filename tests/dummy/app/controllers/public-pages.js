import Ember from 'ember';
import Controller from 'ember-controller';
import { calculatePosition } from 'ember-basic-dropdown/utils/calculate-position';

const { computed, String: { htmlSafe } } = Ember;

export default Controller.extend({
  appController: Ember.inject.controller('application'),
  colors: ['#F00', '#0F0', '#00F'],

  // CPs
  backgrounds: computed('colors.[]', function() {
    return this.get('colors').map((c) => htmlSafe(`background-color: ${c}`));
  }),

  // Actions
  actions: {
    preventIfNotInIndex() {
      if (this.get('appController.currentPath') !== 'public-pages.index') {
        return false;
      }
    },

    setBrandColor(background) {
      let index = this.get('backgrounds').indexOf(background);
      let color = this.get('colors')[index];
      alert('Changing theme to ' + color);
    }
  },

  // Methods
  calculatePosition() {
    let pos = calculatePosition(...arguments);
    pos.style.top += 3;
    return pos;
  }
});