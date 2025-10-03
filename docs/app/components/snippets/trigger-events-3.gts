import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe, type TrustedHTML } from '@ember/template';
import { not } from 'ember-truth-helpers';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

export default class extends Component {
  dropdownDisabled = true;
  checkboxClass = null;
  checkboxLabelStyle: TrustedHTML | string = '';

  // Actions
  @action
  highlightCheckboxIfDisabled() {
    if (this.dropdownDisabled) {
      this.checkboxLabelStyle = htmlSafe('color: red');
    }
  }

  @action
  resetHighlight() {
    this.checkboxLabelStyle = '';
  }

  <template>
    <input
      type="checkbox"
      id="enable-dd-chk"
      checked={{not this.dropdownDisabled}}
      {{on "change" (fn (mut this.dropdownDisabled) (not this.dropdownDisabled))}}
    />
    <label for="enable-dd-chk" style={{this.checkboxLabelStyle}}>Enable dropdown</label>
    <br />

    <BasicDropdown @disabled={{this.dropdownDisabled}} as |dd|>
      <dd.Trigger
        {{on "mouseenter" this.highlightCheckboxIfDisabled}}
        {{on "mouseleave" this.resetHighlight}}
        class="trigger-bootstrap-feel"
      >
        Can you open me?
      </dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300">
        You solved the puzzle!
      </dd.Content>
    </BasicDropdown>
  </template>
}
