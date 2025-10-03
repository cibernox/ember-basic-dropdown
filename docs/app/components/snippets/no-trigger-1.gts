import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import { on } from '@ember/modifier';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown as |dd|>
      <div class="form-inline">
        <input
          type="text"
          class="form-control"
          data-ebd-id="{{dd.uniqueId}}-trigger"
        />
        <button
          type="button"
          class="trigger-bootstrap-feel"
          {{on "click" dd.actions.toggle}}
        >
          Click me
        </button>
      </div>

      <dd.Content class="content-bootstrap-feel width-300">
        I don't like the button, I like the input.
      </dd.Content>
    </BasicDropdown>
  </template>
}
