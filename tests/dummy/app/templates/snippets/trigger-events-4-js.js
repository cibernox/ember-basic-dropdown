import Controller from 'ember-controller';

export default Controller.extend({
  actions: {
    simulateFocusParent() {
      this.set('parentDivClass', 'input-group--focused');
    },

    simulateBlurParent() {
      this.set('parentDivClass', null);
    }
  }
});