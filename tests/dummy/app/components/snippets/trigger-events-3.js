import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default class extends Component {
  dropdownDisabled = true;
  checkboxClass = null;
  checkboxLabelStyle = null;

  // Actions
  @action
  highlightCheckboxIfDisabled() {
    if (this.dropdownDisabled) {
      this.checkboxLabelStyle = htmlSafe('color: red');
    }
  }

  @action
  resetHighlight() {
    this.checkboxLabelStyle = null;
  }
}
