import Controller from '@ember/controller';

export default class extends Controller {
  calculatePosition(trigger, content) {
    let { top, left, width, height } = trigger.getBoundingClientRect();
    let { height: contentHeight } = content.getBoundingClientRect();
    let style = {
      left: left + width,
      top: top + window.pageYOffset + height / 2 - contentHeight / 2,
    };

    return { style };
  }
}
