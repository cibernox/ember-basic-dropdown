import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  @action
  preventUntilSelected() {
    if (!this.selected) {
      alert('You have to choose!');
      return false;
    }
  }
}
