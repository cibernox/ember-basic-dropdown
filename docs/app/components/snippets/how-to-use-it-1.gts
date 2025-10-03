import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown as |dd|>
      <dd.Trigger>Click me</dd.Trigger>
      <dd.Content>Hello world</dd.Content>
    </BasicDropdown>
  </template>
}
