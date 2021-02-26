import { inject as service } from "@ember/service"
import { action } from "@ember/object"
import { htmlSafe } from "@ember/template"
import Controller from '@ember/controller';
import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';

const colors = ['orange', 'blue', 'purple', 'line', 'pink', 'red', 'brown'];
const brands = colors.map(c => `${c}-brand`)
export default class extends Controller {
  @service router
  colors = colors
  backgrounds = this.colors.map((c) => htmlSafe(`background-color: ${c}`))
  color = undefined

  // Actions
  @action
  preventIfNotInIndex(e) {
    if (this.router.currentPath !== 'public-pages.index') {
      e.stopImmediatePropagation();
    }
  }

  setBrandColor(color, dropdown) {
    brands.forEach(klass => document.body.classList.remove(klass));
    document.body.classList.add(`${color}-brand`);
    dropdown.actions.close();
  }

  // Methods
  calculatePosition() {
    let pos = calculatePosition(...arguments);
    pos.style.top += 3;
    return pos;
  }
}
