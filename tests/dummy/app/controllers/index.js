import Ember from 'ember';

export default Ember.Controller.extend({
  showImage: true,
  opened: true,
  horizontalScrollEnabled: false,

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
    }
  }
});