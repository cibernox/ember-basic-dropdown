import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

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
    this.closeLaterTask.cancelAll();
    dropdown.actions.open();
  }

  @action
  closeLater(dropdown) {
    this.closeLaterTask.perform(dropdown);
  }

  closeLaterTask = task(async (dropdown) => {
    await timeout(200);
    dropdown.actions.close();
  });
}
