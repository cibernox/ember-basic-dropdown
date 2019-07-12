import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later, cancel } from '@ember/runloop';

export default class extends Controller {
  notifications = [
    { text: 'Edward' },
    { text: 'Jonathan' },
    { text: 'Tom' },
    { text: 'Eric' }
  ]

  // Actions
  prevent(e) {
    return e.stopImmediatePropagation();
  }

  @action
  open(dropdown) {
    if (this.closeTimer) {
      cancel(this.closeTimer);
      this.closeTimer = null;
    } else {
      dropdown.actions.open();
    }
  }

  @action
  closeLater(dropdown) {
    this.closeTimer = later(() => {
      this.closeTimer = null;
      dropdown.actions.close();
    }, 200);
  }
}
