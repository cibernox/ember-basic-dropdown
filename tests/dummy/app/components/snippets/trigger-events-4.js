import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class extends Component {
  parentDivClass = null;
  @action
  simulateFocusParent() {
    this.parentDivClass = 'input-group--focused';
  }

  @action
  simulateBlurParent() {
    this.parentDivClass = null;
  }
}
