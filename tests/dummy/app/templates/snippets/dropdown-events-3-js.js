import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    preventUntilSelected() {
      if (!this.get('selected')) {
        alert('You have to choose!');
        return false;
      }
    }
  }
});
