import Controller from '@ember/controller';
import { schedule, cancel, next } from '@ember/runloop';

export default Controller.extend({
  showImage: true,
  opened: true,
  horizontalScrollEnabled: false,
  addedItems: undefined,

  init() {
    this._super(...arguments);
    this.set('addedItems', []);
  },

  actions: {
    registerAPI(dropdown) {
      schedule('actions', this, this.set, 'remoteController', dropdown);
    },

    toggleOpened() {
      this.toggleProperty('opened');
    },

    toggleHorizontalScroll() {
      let enabled = this.toggleProperty('horizontalScrollEnabled');
      if (enabled) {
        document.body.classList.add('with-horizontal-scroll');
      } else {
        document.body.classList.remove('with-horizontal-scroll');
      }
    },

    startAddingContent() {
      this.intervarTimer = window.setInterval(() => {
        this.set('addedItems', this.addedItems.concat(+new Date()));
      }, 1000);
    },

    stopAddingContent() {
      window.clearInterval(this.intervarTimer);
    },

    mouseEnter(dropdown /*, e */) {
      if (this.closeTimer) {
        cancel(this.closeTimer);
        this.closeTimer = null;
      } else {
        dropdown.actions.open();
      }
    },

    mouseLeave(dropdown /*, e */) {
      this.closeTimer = next(this, function() {
        this.closeTimer = null;
        dropdown.actions.close();
      });
    }
  }
});
