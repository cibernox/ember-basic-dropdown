import Component from '@glimmer/component';

export default class extends Component {
  openOnArrowDown(dropdown, e) {
    if (e.keyCode === 38) {
      dropdown.actions.open(e);
    }
  }
}
