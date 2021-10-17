import Controller from '@ember/controller';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' },
];

export default class extends Controller {
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
  @task(function* (dropdown) {
    yield timeout(1000);
    dropdown.actions.open(); // invoked without event
    return users;
  })
  loadUsersAndOpen;
}
