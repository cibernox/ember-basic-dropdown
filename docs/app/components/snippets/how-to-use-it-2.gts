import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">
        Click me
        <span class="caret"></span>
      </dd.Trigger>

      <dd.Content class="content-bootstrap-feel">
        <p>I look like bootstrap, right?</p>
        <p>You can style me however you want</p>
      </dd.Content>
    </BasicDropdown>
  </template>
}
