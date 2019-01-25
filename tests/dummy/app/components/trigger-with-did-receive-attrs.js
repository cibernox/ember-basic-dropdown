import Trigger from 'ember-basic-dropdown/components/basic-dropdown-trigger';

export default Trigger.extend({
  didOpen: false,

  didReceiveAttrs() {
    let { dropdown, oldDropdown = {} } = this;
    if ((oldDropdown && oldDropdown.isOpen) === false && dropdown.isOpen) {
      this.set('didOpen', true);
    }
    this.set('oldDropdown', dropdown);
  }
});
