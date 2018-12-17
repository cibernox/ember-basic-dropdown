import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    openDropdown(dropdown) {
      dropdown.actions.open();
    }
  }
});
