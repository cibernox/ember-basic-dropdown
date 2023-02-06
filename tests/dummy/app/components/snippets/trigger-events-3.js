import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default class extends Component {
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
}
