import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { htmlSafe } from '@ember/template';
import TriggerEvents0Component from '../../../components/snippets/trigger-events-0';
import TriggerEvents1Component from '../../../components/snippets/trigger-events-1';
import TriggerEvents2Component from '../../../components/snippets/trigger-events-2';
import TriggerEvents3Component from '../../../components/snippets/trigger-events-3';
import TriggerEvents4Component from '../../../components/snippets/trigger-events-4';

export default class extends Controller {
  triggerEvents0Component = TriggerEvents0Component;
  triggerEvents1Component = TriggerEvents1Component;
  triggerEvents2Component = TriggerEvents2Component;
  triggerEvents3Component = TriggerEvents3Component;
  triggerEvents4Component = TriggerEvents4Component;

  dropdownDisabled = true;
  checkboxClass = null;

  // Actions
  useTheKeyboard(e) {
    alert('Use the keyboard!');
    return e.stopImmediatePropagation();
  }

  openOnArrowDown(dropdown, e) {
    if (e.keyCode === 40) {
      dropdown.actions.open(e);
      e.preventDefault(); // To prevent page scroll
    }
  }

  @action
  highlightCheckboxIfDisabled() {
    if (this.dropdownDisabled) {
      set(this, 'checkboxLabelStyle', htmlSafe('color: red'));
    }
  }

  @action
  resetHighlight() {
    set(this, 'checkboxLabelStyle', null);
  }

  @action
  simulateFocusParent() {
    set(this, 'parentDivClass', 'input-group--focused');
  }

  @action
  simulateBlurParent() {
    set(this, 'parentDivClass', null);
  }
}
