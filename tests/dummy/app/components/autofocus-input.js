import Component from 'ember-component';
import run from 'ember-runloop';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    run.schedule('afterRender', this, function() {
      this.element.querySelector('input').focus();
    });
  }
});