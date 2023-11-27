import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  @action
  preventUntilSelected() {
    if (!this.selected) {
      alert('You have to choose!');
      return false;
    }
  }
}
