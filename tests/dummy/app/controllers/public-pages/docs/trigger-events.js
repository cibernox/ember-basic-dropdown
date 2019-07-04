import Controller from '@ember/controller';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default class extends Controller {
  dropdownDisabled = true
  checkboxClass = null

  // Actions
  useTheKeyboard(e) {
    alert('Use the keyboard!');
    return e.stopImmediatePropagation();
  }

  openOnArrowDown(dropdown, e) {
    if (e.keyCode === 40) {
      dropdown.actions.open(e);
      e.preventDefault(); // To prevent page scroll
    }
  }

  @action
  highlightCheckboxIfDisabled() {
    if (this.dropdownDisabled) {
      this.set('checkboxLabelStyle', htmlSafe('color: red'));
    }
  }

  @action
  resetHighlight() {
    this.set('checkboxLabelStyle', null);
  }

  @action
  simulateFocusParent() {
    this.set('parentDivClass', 'input-group--focused');
  }

  @action
  simulateBlurParent() {
    this.set('parentDivClass', null);
  }
}
