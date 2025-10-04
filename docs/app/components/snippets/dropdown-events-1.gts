import { action } from '@ember/object';
import Component from '@glimmer/component';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import { task, timeout } from 'ember-concurrency';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' },
];

export default class extends Component {
  users: typeof users = [];

  loadUsers = task(async () => {
    await timeout(1000);
    this.users = users;
  });

  @action
  open() {
    void this.loadUsers.perform();
  }

  <template>
    <BasicDropdown @onOpen={{this.open}} as |dd|>
      <dd.Trigger class="trigger-bootstrap-feel">Click me</dd.Trigger>

      <dd.Content class="content-bootstrap-feel width-300">
        {{#if this.loadUsers.isRunning}}
          <div class="circular-loader"></div>
        {{else}}
          {{#each this.users as |user|}}
            <p>{{user.name}} - {{user.assignment}}</p>
          {{/each}}
        {{/if}}
      </dd.Content>
    </BasicDropdown>
  </template>
}
