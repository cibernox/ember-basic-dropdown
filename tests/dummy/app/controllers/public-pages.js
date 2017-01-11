import Controller from 'ember-controller';
import { calculatePosition } from 'ember-basic-dropdown/utils/calculate-position';

export default Controller.extend({
  calculatePosition() {
    let pos = calculatePosition(...arguments);
    pos.style.top += 3;
    return pos;
  }
});