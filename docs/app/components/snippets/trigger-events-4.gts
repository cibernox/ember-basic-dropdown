import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked parentDivClass: string | null = null;

  @action
  simulateFocusParent() {
    this.parentDivClass = 'input-group--focused';
  }

  @action
  simulateBlurParent() {
    this.parentDivClass = null;
  }

  <template>
    <p>Focus alternatively the input and the button next to it</p>
    <div class="trigger-event-demo input-group {{this.parentDivClass}}">
      {{! template-lint-disable require-input-label }}
      <input
        type="text"
        class="form-control"
        {{on "focus" this.simulateFocusParent}}
        {{on "blur" this.simulateBlurParent}}
      />

      <BasicDropdown as |dd|>
        <dd.Trigger
          class="input-group-addon"
          {{on "focus" this.simulateFocusParent}}
          {{on "blur" this.simulateBlurParent}}
        >
          <span class="caret"></span>
        </dd.Trigger>

        <dd.Content class="content-bootstrap-feel width-300">
          <p>Option1</p>
          <p>Option2</p>
        </dd.Content>
      </BasicDropdown>
    </div>
  </template>
}
