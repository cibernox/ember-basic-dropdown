import { set } from '@ember/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import CustomPosition1Component from '../../../components/snippets/custom-position-1';
import CustomPosition2Component from '../../../components/snippets/custom-position-2';

const names = ['Katie', 'Ricardo', 'Igor', 'Alex', 'Martin', 'Godfrey'];

export default class extends Controller {
  customPosition1Component = CustomPosition1Component;
  customPosition2Component = CustomPosition2Component;

  names = [];

  calculatePosition(trigger, content) {
    let { top, left, width, height } = trigger.getBoundingClientRect();
    let { height: contentHeight } = content.getBoundingClientRect();
    let style = {
      left: left + width,
      top: top + window.pageYOffset + height / 2 - contentHeight / 2,
    };

    return { style };
  }

  @task(function* () {
    set(this, 'names', A([]));
    for (let name of names) {
      this.names.pushObject(name);
      yield timeout(750);
    }
  })
  addNames;
}
