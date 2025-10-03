import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <BasicDropdown @horizontalPosition="center" as |dd|>
      <dd.Trigger class="trigger-material-round">+</dd.Trigger>

      <dd.Content class="content-material-round">
        <img src="/some-image.gif" alt="puppy" height="150" width="150" />
      </dd.Content>
    </BasicDropdown>
  </template>
}
