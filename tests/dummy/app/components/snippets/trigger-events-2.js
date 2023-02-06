import Component from '@glimmer/component';

export default class extends Component {
  useTheKeyboard(e) {
    alert('Use the keyboard!');
    return e.stopImmediatePropagation();
  }
}
