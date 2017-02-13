import Controller from 'ember-controller';

export default Controller.extend({
  actions: {
    useTheKeyboard() {
      alert('Use the keyboard!');
      return false;
    }
  }
});