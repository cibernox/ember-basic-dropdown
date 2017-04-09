import Ember from 'ember';

const { run } = Ember;

export default Ember.Controller.extend({
  showImage: true,
  opened: true,
  horizontalScrollEnabled: false,
  addedItems: [],

  actions: {
    registerAPI(dropdown) {
      Ember.run.schedule('actions', this, this.set, 'remoteController', dropdown);
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
        this.set('addedItems', this.get('addedItems').concat(+new Date()));
      }, 1000);
    },

    stopAddingContent() {
      window.clearInterval(this.intervarTimer);
    },

    returnFalse() {
      return false;
    },

    mouseEnter(dropdown /*, e */) {
      if (this.closeTimer) {
        run.cancel(this.closeTimer);
        this.closeTimer = null;
      } else {
        dropdown.actions.open();
      }
    },

    mouseLeave(dropdown /*, e */) {
      this.closeTimer = run.next(this, function() {
        this.closeTimer = null;
        dropdown.actions.close();
      });
    }
  }
});
