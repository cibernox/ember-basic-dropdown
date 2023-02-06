import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  parentDivClass = null;
  @action
  simulateFocusParent() {
    this.set('parentDivClass', 'input-group--focused');
  }

  @action
  simulateBlurParent() {
    this.set('parentDivClass', null);
  }
}
