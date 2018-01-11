import Controller from '@ember/controller';
import { later, cancel } from '@ember/runloop';

export default Controller.extend({
  notifications: undefined,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.set('notifications', [
      { text: 'Edward' },
      { text: 'Jonathan' },
      { text: 'Tom' },
      { text: 'Eric' }
    ]);
  },

  // Actions
  actions: {
    prevent() {
      return false;
    },

    open(dropdown) {
      if (this.closeTimer) {
        cancel(this.closeTimer);
        this.closeTimer = null;
      } else {
        dropdown.actions.open();
      }
    },

    closeLater(dropdown) {
      this.closeTimer = later(() => {
        this.closeTimer = null;
        dropdown.actions.close();
      }, 200);
    }
  }
});
