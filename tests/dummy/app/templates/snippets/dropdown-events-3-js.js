import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    preventUntilSelected() {
      if (!this.selected) {
        alert('You have to choose!');
        return false;
      }
    }
  }
});
