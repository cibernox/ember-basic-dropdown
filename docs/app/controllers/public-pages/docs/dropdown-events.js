import Controller from '@ember/controller';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import DropDownEvents1Component from '../../../components/snippets/dropdown-events-1';
import DropDownEvents2Component from '../../../components/snippets/dropdown-events-2';
import DropDownEvents3Component from '../../../components/snippets/dropdown-events-3';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' },
];

export default class extends Controller {
  users = users;
  dropDownEvents1Component = DropDownEvents1Component;
  dropDownEvents2Component = DropDownEvents2Component;
  dropDownEvents3Component = DropDownEvents3Component;

  // Actions
  @action
  waitForUsers(dropdown, e) {
    if (e) {
      this.loadUsersAndOpen.perform(dropdown, e);
      return false;
    }
  }

  @action
  preventUntilSelected() {
    if (!this.selected) {
      alert('You have to choose!');
      return false;
    }
  }

  // Tasks
  @task(function* () {
    yield timeout(1000);
    return users;
  })
  loadUsers;

  @task(function* (dropdown) {
    yield timeout(1000);
    dropdown.actions.open();
    return users;
  })
  loadUsersAndOpen;
}
