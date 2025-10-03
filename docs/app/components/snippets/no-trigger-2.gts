import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import basicDropdownTrigger from 'ember-basic-dropdown/modifiers/basic-dropdown-trigger';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown as |dd|>
      <button
        type="button"
        class="trigger-bootstrap-feel"
        {{basicDropdownTrigger dropdown=dd}}
      >
        Click me
      </button>

      <dd.Content class="content-bootstrap-feel width-300">
        I was opened with a custom trigger
      </dd.Content>
    </BasicDropdown>
  </template>
}
