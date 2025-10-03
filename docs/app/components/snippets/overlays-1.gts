import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300" @overlay={{true}}>
        By default the overlays is black and transparent, but you can change that.
      </dd.Content>
    </BasicDropdown>
  </template>
}
