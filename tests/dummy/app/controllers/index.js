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
        Ember.$('body').addClass('with-horizontal-scroll');
      } else {
        Ember.$('body').removeClass('with-horizontal-scroll');
      }
    },

    startAddingContent() {
      this.intervarTimer = window.setInterval(() => {
        console.debug('add new item!');
        this.set('addedItems', this.get('addedItems').concat(+new Date()));
      }, 1000);
    },

    stopAddingContent() {
      window.clearInterval(this.intervarTimer);
    },

    triggerMouseEnter(dropdown /*, e */) {
      if (this.closeTimer) {
        run.cancel(this.closeTimer);
        this.closeTimer = null;
      } else {
        dropdown.actions.open();
      }
    },

    triggerMouseLeave(dropdown /*, e */) {
      this.closeTimer = run.next(this, function() {
        this.closeTimer = null;
        dropdown.actions.close();
      });
    },

    contentMouseEnter(dropdown /*, e */) {
      if (this.closeTimer) {
        run.cancel(this.closeTimer);
        this.closeTimer = null;
      } else {
        dropdown.actions.open();
      }
    },

    contentMouseLeave(dropdown /*, e */) {
      this.closeTimer = run.next(this, function() {
        this.closeTimer = null;
        dropdown.actions.close();
      });
    }
  }
});