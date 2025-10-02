import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

const NAMES = ['Katie', 'Ricardo', 'Igor', 'Alex', 'Martin', 'Godfrey'];

export default class extends Component {
  @tracked names = [];

  calculatePosition(trigger, content) {
    let { top, left, width, height } = trigger.getBoundingClientRect();
    let { height: contentHeight } = content.getBoundingClientRect();
    let style = {
      left: left + width,
      top: top + window.pageYOffset + height / 2 - contentHeight / 2,
    };

    return { style };
  }

  addNames = task(async () => {
    this.names = [];
    for (let name of NAMES) {
      this.names = [...this.names, name];
      await timeout(750);
    }
  });
}
