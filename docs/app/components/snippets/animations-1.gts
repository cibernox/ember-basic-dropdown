import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">Animate me</dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300 slide-fade">
        <li>Miguel</li>
        <li>Matthew</li>
        <li>Dan</li>
      </dd.Content>
    </BasicDropdown>
  </template>
}

