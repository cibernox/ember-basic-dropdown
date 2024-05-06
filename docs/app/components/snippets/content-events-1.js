import Component from '@glimmer/component';
import { action } from '@ember/object';
import { runTask, cancelTask } from 'ember-lifeline';

export default class extends Component {
  notifications = [
    { text: 'Edward' },
    { text: 'Jonathan' },
    { text: 'Tom' },
    { text: 'Eric' },
  ];

  // Actions
  prevent(e) {
    return e.stopImmediatePropagation();
  }

  @action
  open(dropdown) {
    if (this.closeTimer) {
      cancelTask(this, this.closeTimer);
      this.closeTimer = null;
    } else {
      dropdown.actions.open();
    }
  }

  @action
  closeLater(dropdown) {
    this.closeTimer = runTask(this, () => {
      this.closeTimer = null;
      dropdown.actions.close();
    }, 200);
  }
}
