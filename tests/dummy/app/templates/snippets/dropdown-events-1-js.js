import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

const users = [
  { name: 'Nathan', assignment: 'CLI' },
  { name: 'Rober', assignment: 'Whatnot' },
  { name: 'Leah', assignment: 'Community' },
];

export default class extends Controller {
  @task(function* () {
    yield timeout(1000);
    return users;
  })
  loadUsers;
}
