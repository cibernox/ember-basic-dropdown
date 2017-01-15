import Controller from 'ember-controller';

export default Controller.extend({
  actions: {
    openOnArrowDown(dropdown, e) {
      if (e.keyCode === 38) {
        dropdown.actions.open(e);
      }
    }
  }
});