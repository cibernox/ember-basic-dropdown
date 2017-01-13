import Controller from 'ember-controller';

export default Controller.extend({
  // Actions
  actions: {
    openOnArrowDown(dropdown, e) {
      debugger;
      if (e.keyCode === 38) {
        dropdown.actions.open(e);
      }
    }
  }
});