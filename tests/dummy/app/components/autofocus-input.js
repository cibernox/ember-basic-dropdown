import Component from 'ember-component';
import { schedule } from 'ember-runloop';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    schedule('afterRender', this, function() {
      this.element.querySelector('input').focus();
    });
  }
});