import Controller from 'ember-controller';
import { htmlSafe } from 'ember-string';

export default Controller.extend({
  dropdownDisabled: true,
  checkboxClass: null,

  // Actions
  actions: {
    highlightCheckboxIfDisabled() {
      if (this.get('dropdownDisabled')) {
        this.set('checkboxLabelStyle', htmlSafe('color: red'));
      }
    },

    resetHighlight() {
      this.set('checkboxLabelStyle', null);
    }
  }
});