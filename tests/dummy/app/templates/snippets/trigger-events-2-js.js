import Controller from '@ember/controller';

export default class extends Controller {
  useTheKeyboard(e) {
    alert('Use the keyboard!');
    return e.stopImmediatePropagation();
  }
}
