import Controller from '@ember/controller';
import { runTask, cancelTask } from 'ember-lifeline';
import { action } from '@ember/object';
import ContentEvents1Component from '../../../components/snippets/content-events-1';

export default class extends Controller {
  contentEvents1Component = ContentEvents1Component;

  notifications = [
    { text: 'Edward' },
    { text: 'Jonathan' },
    { text: 'Tom' },
    { text: 'Eric' },
  ];

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
    this.closeTimer = runTask(
      this,
      () => {
        this.closeTimer = null;
        dropdown.actions.close();
      },
      200,
    );
  }
}
