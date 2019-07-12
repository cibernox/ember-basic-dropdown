import { A } from "@ember/array"
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

const names = ['Katie', 'Ricardo', 'Igor', 'Alex', 'Martin', 'Godfrey'];

export default class extends Controller {
  names = []

  calculatePosition(trigger, content) {
    let { top, left, width, height } = trigger.getBoundingClientRect();
    let { height: contentHeight } = content.getBoundingClientRect();
    let style = {
      left: left + width,
      top: top + window.pageYOffset + (height / 2) - (contentHeight / 2)
    };

    return { style };
  }

  @(task(function*() {
    this.set('names', A([]));
    for (let name of names) {
      this.names.pushObject(name);
      yield timeout(750);
    }
  })) addNames

}
