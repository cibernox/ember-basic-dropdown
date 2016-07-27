import Controller from 'ember-controller';

export default Controller.extend({
  showImage: true,
  opened: true,

  actions: {
    toggleOpened() {
      this.toggleProperty('opened');
    }
  }
});