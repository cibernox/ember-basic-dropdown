import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default class extends Controller {
  dropdownDisabled = true;
  checkboxClass = null;

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
      set(this, 'checkboxLabelStyle', htmlSafe('color: red'));
    }
  }

  @action
  resetHighlight() {
    set(this, 'checkboxLabelStyle', null);
  }

  @action
  simulateFocusParent() {
    set(this, 'parentDivClass', 'input-group--focused');
  }

  @action
  simulateBlurParent() {
    set(this, 'parentDivClass', null);
  }
}
