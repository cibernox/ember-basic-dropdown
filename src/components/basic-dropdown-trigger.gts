import Component from '@glimmer/component';
import { action } from '@ember/object';
import { element, type ElementFromTagName } from 'ember-element-helper';
import { or } from 'ember-truth-helpers';
import { concat } from '@ember/helper';
import basicDropdownTriggerModifier from '../modifiers/basic-dropdown-trigger.ts';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type { Dropdown } from './basic-dropdown';
import type { HorizontalPosition, VerticalPosition } from '../types';

export interface BasicDropdownTriggerSignature<
  T extends keyof HTMLElementTagNameMap = 'div',
> {
  Element: ElementFromTagName<T>;
  Args: {
    dropdown?: Dropdown;
    eventType?: 'click' | 'mousedown';
    stopPropagation?: boolean;
    vPosition?: VerticalPosition | null;
    hPosition?: HorizontalPosition | null;
    defaultClass?: string;
    renderInPlace?: boolean;
    htmlTag?: T | undefined;
    onBlur?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onClick?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onFocus?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onFocusIn?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onFocusOut?: (dropdown?: Dropdown, event?: FocusEvent) => void;
    onKeyDown?: (dropdown?: Dropdown, event?: KeyboardEvent) => void;
    onMouseDown?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onMouseEnter?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onMouseLeave?: (dropdown?: Dropdown, event?: MouseEvent) => void;
    onTouchEnd?: (dropdown?: Dropdown, event?: TouchEvent) => void;
  };
  Blocks: {
    default: [];
  };
}

export default class BasicDropdownTrigger<
  T extends keyof HTMLElementTagNameMap,
> extends Component<BasicDropdownTriggerSignature<T>> {
  get tag(): keyof HTMLElementTagNameMap {
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
  noop(): void {}

  @action
  disableDocumentTextSelect(disable: boolean) {
    if (disable) {
      document.body.classList.add('ember-basic-dropdown-text-select-disabled');
    } else {
      document.body.classList.remove(
        'ember-basic-dropdown-text-select-disabled',
      );
    }
  }

  <template>
    {{#if @dropdown}}
      {{#let (element this.tag) as |OptionalTag|}}
        {{! template-lint-disable no-pointer-down-event-binding }}
        <OptionalTag
          class="ember-basic-dropdown-trigger
            {{if @renderInPlace ' ember-basic-dropdown-trigger--in-place'}}
            {{if
              @hPosition
              (concat ' ember-basic-dropdown-trigger--' @hPosition)
            }}
            {{if
              @vPosition
              (concat ' ember-basic-dropdown-trigger--' @vPosition)
            }}
            {{@defaultClass}}"
          {{basicDropdownTriggerModifier
            dropdown=@dropdown
            eventType=@eventType
            stopPropagation=@stopPropagation
          }}
          tabindex={{unless @dropdown.disabled "0"}}
          ...attributes
          {{on "mousedown" (fn this.disableDocumentTextSelect true)}}
          {{on "mouseup" (fn this.disableDocumentTextSelect false)}}
          {{! V1 compatibility - See #498 }}
          {{on "keydown" (fn (or @onKeyDown this.noop) @dropdown)}}
          {{on "mousedown" (fn (or @onMouseDown this.noop) @dropdown)}}
          {{on "touchend" (fn (or @onTouchEnd this.noop) @dropdown)}}
          {{on "click" (fn (or @onClick this.noop) @dropdown)}}
          {{on "mouseenter" (fn (or @onMouseEnter this.noop) @dropdown)}}
          {{on "mouseleave" (fn (or @onMouseLeave this.noop) @dropdown)}}
          {{on "focus" (fn (or @onFocus this.noop) @dropdown)}}
          {{on "blur" (fn (or @onBlur this.noop) @dropdown)}}
          {{on "focusin" (fn (or @onFocusIn this.noop) @dropdown)}}
          {{on "focusout" (fn (or @onFocusOut this.noop) @dropdown)}}
        >
          {{yield}}
        </OptionalTag>
      {{/let}}
    {{/if}}
  </template>
}
