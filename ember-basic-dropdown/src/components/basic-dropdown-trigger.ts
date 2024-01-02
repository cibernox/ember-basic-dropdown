import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Dropdown } from './basic-dropdown';

interface BasicDropdownSignature {
  Element: Element;
  Args: {
    dropdown: Dropdown;
    eventType: 'click' | 'mousedown';
    stopPropagation: boolean;
    vPosition?: string;
    hPosition?: string;
    defaultClass?: string;
    renderInPlace?: boolean;
    htmlTag?: string;
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

export default class BasicDropdownTrigger extends Component<BasicDropdownSignature> {
  // Actions
  /**
   * Allows similair behaviour to `ember-composable-helpers`' `optional` helper.
   * Avoids adding extra dependencies.
   * Can be removed when the template `V1` compatability event handlers are removed.
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
}
