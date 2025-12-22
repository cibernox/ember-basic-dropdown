import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

export default class extends Component {
  useTheKeyboard(e: Event) {
    alert('Use the keyboard!');
    return e.stopImmediatePropagation();
  }

  <template>
    {{!-- template-lint-disable require-input-label --}}
    <input
      type="text"
      placeholder="Focus me and hit TAB to focus the trigger"
    />
    <br />
    <BasicDropdown as |dd|>
      <dd.Trigger
        class="trigger-bootstrap-feel"
        {{on "click" this.useTheKeyboard}}
      >
        Do not click me
      </dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300">
        hello world
      </dd.Content>
    </BasicDropdown>
  </template>
}
