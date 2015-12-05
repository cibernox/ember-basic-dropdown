import Ember from 'ember';

export default Ember.Controller.extend({
  showImage: true,
  opened: true,

  actions: {
    toggleOpened() {
      this.toggleProperty('opened');
    }
  }
});