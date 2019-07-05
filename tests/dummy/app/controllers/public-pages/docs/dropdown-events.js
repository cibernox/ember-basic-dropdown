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
        this.loadUsersAndOpen.perform(dropdown, e);
        return false;
      }
    },

    preventUntilSelected() {
      if (!this.selected) {
        alert('You have to choose!');
        return false;
      }
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
