import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' }
];

export default Ember.Controller.extend({
  loadUsers: task(function*() {
    yield timeout(1000);
    return users;
  })
})