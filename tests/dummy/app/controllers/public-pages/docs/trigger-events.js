import Controller from '@ember/controller';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
  dropdownDisabled: true,
  checkboxClass: null,
  // Actions
  actions: {
    openOnArrowDown(dropdown, e) {
      if (e.keyCode === 40) {
        dropdown.actions.open(e);
      }
    },

    useTheKeyboard() {
      alert('Use the keyboard!');
      return false;
    },

    highlightCheckboxIfDisabled() {
      if (this.get('dropdownDisabled')) {
        this.set('checkboxLabelStyle', htmlSafe('color: red'));
      }
    },

    resetHighlight() {
      this.set('checkboxLabelStyle', null);
    },

    simulateFocusParent() {
      this.set('parentDivClass', 'input-group--focused');
    },

    simulateBlurParent() {
      this.set('parentDivClass', null);
    }
  }
});
