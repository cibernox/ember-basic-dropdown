import { inject } from "@ember/controller"
import { computed } from "@ember/object"
import { htmlSafe } from "@ember/string"
import Controller from '@ember/controller';
import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';

export default Controller.extend({
  appController: inject('application'),
  colors: ['orange', 'blue', 'purple', 'line', 'pink', 'red', 'brown'],

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

    setBrandColor(color, dropdown) {
      ['orange-brand', 'blue-brand', 'purple-brand', 'line-brand', 'pink-brand', 'red-brand', 'brown-brand'].forEach((klass) => {
        document.body.classList.remove(klass);
      });
      document.body.classList.add(`${color}-brand`);
      dropdown.actions.close();
    }
  },

  // Methods
  calculatePosition() {
    let pos = calculatePosition(...arguments);
    pos.style.top += 3;
    return pos;
  }
});
