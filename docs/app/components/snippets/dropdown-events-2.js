import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' },
];

export default class extends Component {
  users = users;

  // Actions
  @action
  waitForUsers(dropdown, e) {
    if (e) {
      this.loadUsersAndOpen.perform(dropdown, e);
      return false;
    }
  }

  // Tasks
  loadUsersAndOpen = task(async (dropdown) => {
    await timeout(1000);
    dropdown.actions.open(); // invoked without event
    return users;
  });
}
