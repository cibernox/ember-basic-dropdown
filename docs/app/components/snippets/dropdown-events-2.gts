import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import BasicDropdown, { type Dropdown } from 'ember-basic-dropdown/components/basic-dropdown';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' },
];

export default class extends Component {
  users = users;

  // Actions
  @action
  waitForUsers(dropdown: Dropdown, e?: Event) {
    if (e) {
      void this.loadUsersAndOpen.perform(dropdown);
      return false;
    }
  }

  // Tasks
  loadUsersAndOpen = task(async (dropdown: Dropdown) => {
    await timeout(1000);
    dropdown.actions.open(); // invoked without event
    return users;
  });

  <template>
    <BasicDropdown @onOpen={{this.waitForUsers}} as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">
        {{#if this.loadUsersAndOpen.isRunning}}
          Loading...
        {{else}}
          Click me
        {{/if}}
      </dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300">
        {{#each this.loadUsersAndOpen.lastSuccessful.value as |user|}}
          <p>{{user.name}} - {{user.assignment}}</p>
        {{/each}}
      </dd.Content>
    </BasicDropdown>
  </template>
}
