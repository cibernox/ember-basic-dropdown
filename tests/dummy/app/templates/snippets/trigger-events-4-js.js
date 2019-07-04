import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  @action
  simulateFocusParent() {
    this.set('parentDivClass', 'input-group--focused');
  }

  @action
  simulateBlurParent() {
    this.set('parentDivClass', null);
  }
};
