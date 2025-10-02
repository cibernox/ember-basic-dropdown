import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import CustomPosition1Component from '../../../components/snippets/custom-position-1';
import CustomPosition2Component from '../../../components/snippets/custom-position-2';

const NAMES = ['Katie', 'Ricardo', 'Igor', 'Alex', 'Martin', 'Godfrey'];

export default class extends Controller {
  customPosition1Component = CustomPosition1Component;
  customPosition2Component = CustomPosition2Component;

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
