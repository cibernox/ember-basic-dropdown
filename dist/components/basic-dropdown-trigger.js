import Component from '@glimmer/component';
import { action } from '@ember/object';
import { element } from 'ember-element-helper';
import { or } from 'ember-truth-helpers';
import { fn, concat } from '@ember/helper';
import DropdownTriggerModifier from '../modifiers/basic-dropdown-trigger.js';
import { on } from '@ember/modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { n } from 'decorator-transforms/runtime-esm';

class BasicDropdownTrigger extends Component {
  get tag() {
    return this.args.htmlTag || 'div';
  }
  // Actions
  /**
  * Allows similar behavior to `ember-composable-helpers`' `optional` helper.
  * Avoids adding extra dependencies.
  * Can be removed when the template `V1` compatibility event handlers are removed.
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
  static {
    setComponentTemplate(precompileTemplate("{{#if @dropdown}}\n  {{#let (element this.tag) as |OptionalTag|}}\n    {{!-- template-lint-disable no-pointer-down-event-binding --}}\n    <OptionalTag class=\"ember-basic-dropdown-trigger\n        {{if @renderInPlace \" ember-basic-dropdown-trigger--in-place\"}}\n        {{if @hPosition (concat \" ember-basic-dropdown-trigger--\" @hPosition)}}\n        {{if @vPosition (concat \" ember-basic-dropdown-trigger--\" @vPosition)}}\n        {{@defaultClass}}\" {{basicDropdownTriggerModifier dropdown=@dropdown eventType=@eventType stopPropagation=@stopPropagation}} tabindex={{unless @dropdown.disabled \"0\"}} ...attributes {{on \"mousedown\" (fn this.disableDocumentTextSelect true)}} {{on \"mouseup\" (fn this.disableDocumentTextSelect false)}} {{!-- V1 compatibility - See #498 --}} {{on \"keydown\" (fn (or @onKeyDown this.noop) @dropdown)}} {{on \"mousedown\" (fn (or @onMouseDown this.noop) @dropdown)}} {{on \"touchend\" (fn (or @onTouchEnd this.noop) @dropdown)}} {{on \"click\" (fn (or @onClick this.noop) @dropdown)}} {{on \"mouseenter\" (fn (or @onMouseEnter this.noop) @dropdown)}} {{on \"mouseleave\" (fn (or @onMouseLeave this.noop) @dropdown)}} {{on \"focus\" (fn (or @onFocus this.noop) @dropdown)}} {{on \"blur\" (fn (or @onBlur this.noop) @dropdown)}} {{on \"focusin\" (fn (or @onFocusIn this.noop) @dropdown)}} {{on \"focusout\" (fn (or @onFocusOut this.noop) @dropdown)}}>\n      {{yield}}\n    </OptionalTag>\n  {{/let}}\n{{/if}}", {
      strictMode: true,
      scope: () => ({
        element,
        concat,
        basicDropdownTriggerModifier: DropdownTriggerModifier,
        on,
        fn,
        or
      })
    }), this);
  }
}

export { BasicDropdownTrigger as default };
//# sourceMappingURL=basic-dropdown-trigger.js.map
