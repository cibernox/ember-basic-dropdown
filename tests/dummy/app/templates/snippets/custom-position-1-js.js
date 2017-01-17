import Controller from 'ember-controller';
import $ from 'jquery';

export default Controller.extend({
  calculatePosition(trigger, content) {
    let { top, left, width, height } = trigger.getBoundingClientRect();
    let { height: contentHeight } = content.getBoundingClientRect();
    let style = {
      left: left + width,
      top: top + $(window).scrollTop() + (height / 2) - (contentHeight / 2)
    };

    return { style };
  }
});