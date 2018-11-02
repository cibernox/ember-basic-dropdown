import Trigger from 'ember-basic-dropdown/components/basic-dropdown/trigger';

export default Trigger.extend({
  didOpen: false,

  didReceiveAttrs() {
    let dropdown = this.get('dropdown');
    let oldDropdown = this.get('oldDropdown');

    if ((oldDropdown && oldDropdown.isOpen) === false && dropdown.isOpen) {
      this.set('didOpen', true);
    }

    this.set('oldDropdown', dropdown);
  }
});
