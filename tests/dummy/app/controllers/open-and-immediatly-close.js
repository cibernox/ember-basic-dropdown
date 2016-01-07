import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    immediatlyClose(dropdown) {
      dropdown.actions.close();
    }
  }
});