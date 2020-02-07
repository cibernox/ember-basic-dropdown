import Controller from '@ember/controller';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default class extends Controller {
  dropdownDisabled = true;
  checkboxClass = null;
  checkboxLabelStyle = '';

  // Actions
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
};
