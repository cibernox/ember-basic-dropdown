import Ember from 'ember';

export default Ember.Controller.extend({
  showImage: true,
  opened: true,

  actions: {
    registerAPI(dropdown) {
      Ember.run.schedule('actions', this, this.set, 'remoteController', dropdown);
    },

    toggleOpened() {
      this.toggleProperty('opened');
    }
  }
});