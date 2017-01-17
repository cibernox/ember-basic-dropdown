import Ember from 'ember';
import Controller from 'ember-controller';
import $ from 'jquery';
import { task, timeout } from 'ember-concurrency';

const names = ['Katie', 'Ricardo', 'Igor', 'Alex', 'Martin', 'Godfrey'];

export default Controller.extend({
  names: [],

  calculatePosition(trigger, content) {
    let { top, left, width, height } = trigger.getBoundingClientRect();
    let { height: contentHeight } = content.getBoundingClientRect();
    let style = {
      left: left + width,
      top: top + $(window).scrollTop() + (height / 2) - (contentHeight / 2)
    };

    return { style };
  },

  addNames: task(function*() {
    this.set('names', Ember.A([]));
    for (name of names) {
      this.get('names').pushObject(name);
      yield timeout(750);
    }
  })
});