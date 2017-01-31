import EmberBasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';

export default EmberPowerSelect.extend({
  // Place here your system-wide preferences
  triggerComponent: 'my-custom-trigger',
  calculatePosition() {
    // your custom function to position the dropdown
  }
});
