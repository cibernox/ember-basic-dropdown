import Controller from '@ember/controller';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
  dropdownDisabled: true,
  checkboxClass: null,
  // Actions
  useTheKeyboard(e) {
    alert('Use the keyboard!');
    return e.stopImmediatePropagation();
  },

  actions: {
    openOnArrowDown(dropdown, e) {
      if (e.keyCode === 40) {
        dropdown.actions.open(e);
      }
    },

    highlightCheckboxIfDisabled() {
      if (this.dropdownDisabled) {
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
