import Ember from 'ember';

export default Ember.Controller.extend({
  showImage: true,

  actions: {
    toggleOpened() {
      this.toggleProperty('opened');
    }
  }
});