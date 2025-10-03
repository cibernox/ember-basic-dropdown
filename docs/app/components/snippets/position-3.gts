import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown @matchTriggerWidth={{true}} as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">Click me!</dd.Trigger>

      <dd.Content class="content-bootstrap-feel">
        I'm not in the root of the app
      </dd.Content>
    </BasicDropdown>
  </template>
}
