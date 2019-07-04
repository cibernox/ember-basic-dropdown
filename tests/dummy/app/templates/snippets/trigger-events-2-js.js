import Controller from '@ember/controller';

export default Controller.extend({
  useTheKeyboard(e) {
    alert('Use the keyboard!');
    return e.stopImmediatePropagation();
  }
});
