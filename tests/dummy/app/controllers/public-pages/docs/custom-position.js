import Controller from 'ember-controller';
import $ from 'jquery';
import { task, timeout } from 'ember-concurrency';
import Ember from 'ember';

export default Controller.extend({
  names: [],

  calculatePosition(trigger, content) {
    let { top, left, width, height } = trigger.getBoundingClientRect();
    let { height: contentHeight } = content.getBoundingClientRect();
    let $window = $(self.window);
    let style = {
      left: left + width,
      top: top + $window.scrollTop() + (height / 2) - (contentHeight / 2)
    };

    return { style };
  },

  addNames: task(function* () {
    this.set('names', Ember.A(['Katie']));
    yield timeout(750);
    this.get('names').pushObject('Ricardo');
    yield timeout(750);
    this.get('names').pushObject('Igor');
    yield timeout(750);
    this.get('names').pushObject('Alex');
    yield timeout(750);
    this.get('names').pushObject('Martin');
    yield timeout(750);
    this.get('names').pushObject('Godfrey');
  })
});