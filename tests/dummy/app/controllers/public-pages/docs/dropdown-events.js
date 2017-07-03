import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' }
];

export default Controller.extend({
  users,

  // Actions
  actions: {
    waitForUsers(dropdown, e) {
      if (e) {
        this.get('loadUsersAndOpen').perform(dropdown, e);
        return false;
      }
    },

    preventUntilSelected() {
      if (!this.get('selected')) {
        alert('You have to choose!');
        return false;
      }
    },

    openDropdown(dropdown) {
      dropdown.actions.open();
    }
  },

  // Tasks
  loadUsers: task(function*() {
    yield timeout(1000);
    return users;
  }),

  loadUsersAndOpen: task(function*(dropdown) {
    yield timeout(1000);
    dropdown.actions.open();
    return users;
  })
});