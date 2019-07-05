import Controller from '@ember/controller';

export default class extends Controller {
  openOnArrowDown(dropdown, e) {
    if (e.keyCode === 38) {
      dropdown.actions.open(e);
    }
  }
};
