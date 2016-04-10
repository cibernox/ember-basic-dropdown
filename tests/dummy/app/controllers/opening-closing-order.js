import Ember from 'ember';

export default Ember.Controller.extend({
  init() {
    this._super(...arguments);
    this.calls = [];
  },

  actions: {
    onOpenFirst() {
      this.calls.push('open1');
    },

    onCloseFirst() {
      this.calls.push('close1');
    },

    onOpenSecond() {
      this.calls.push('open2');
    },
  }
});