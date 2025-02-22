import Component from '@glimmer/component';
import { action } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#let (element (or @htmlTag \"div\")) as |OptionalTag|}}\n  {{! template-lint-disable no-pointer-down-event-binding }}\n  {{!@glint-ignore}}\n  <OptionalTag\n    class=\"ember-basic-dropdown-trigger\n      {{if @renderInPlace \' ember-basic-dropdown-trigger--in-place\'}}\n      {{if @hPosition (concat \' ember-basic-dropdown-trigger--\' @hPosition)}}\n      {{if @vPosition (concat \' ember-basic-dropdown-trigger--\' @vPosition)}}\n      {{@defaultClass}}\"\n    {{basic-dropdown-trigger\n      dropdown=@dropdown\n      eventType=@eventType\n      stopPropagation=@stopPropagation\n    }}\n    tabindex={{unless @dropdown.disabled \"0\"}}\n    ...attributes\n    {{on \"mousedown\" (fn this.disableDocumentTextSelect true)}}\n    {{on \"mouseup\" (fn this.disableDocumentTextSelect false)}}\n    {{! V1 compatibility - See #498 }}\n    {{on \"keydown\" (fn (or @onKeyDown this.noop) @dropdown)}}\n    {{on \"mousedown\" (fn (or @onMouseDown this.noop) @dropdown)}}\n    {{on \"touchend\" (fn (or @onTouchEnd this.noop) @dropdown)}}\n    {{on \"click\" (fn (or @onClick this.noop) @dropdown)}}\n    {{on \"mouseenter\" (fn (or @onMouseEnter this.noop) @dropdown)}}\n    {{on \"mouseleave\" (fn (or @onMouseLeave this.noop) @dropdown)}}\n    {{on \"focus\" (fn (or @onFocus this.noop) @dropdown)}}\n    {{on \"blur\" (fn (or @onBlur this.noop) @dropdown)}}\n    {{on \"focusin\" (fn (or @onFocusIn this.noop) @dropdown)}}\n    {{on \"focusout\" (fn (or @onFocusOut this.noop) @dropdown)}}\n  >\n    {{yield}}\n  </OptionalTag>\n{{/let}}");

class BasicDropdownTrigger extends Component {
  // Actions
  /**
   * Allows similair behaviour to `ember-composable-helpers`' `optional` helper.
   * Avoids adding extra dependencies.
   * Can be removed when the template `V1` compatability event handlers are removed.
   *
   * @see https://github.com/cibernox/ember-basic-dropdown/issues/498
   * @memberof BasicDropdownContent
   */
  noop() {}
  disableDocumentTextSelect(disable) {
    if (disable) {
      document.body.classList.add('ember-basic-dropdown-text-select-disabled');
    } else {
      document.body.classList.remove('ember-basic-dropdown-text-select-disabled');
    }
  }
  static {
    n(this.prototype, "disableDocumentTextSelect", [action]);
  }
}
setComponentTemplate(TEMPLATE, BasicDropdownTrigger);

export { BasicDropdownTrigger as default };
//# sourceMappingURL=basic-dropdown-trigger.js.map
