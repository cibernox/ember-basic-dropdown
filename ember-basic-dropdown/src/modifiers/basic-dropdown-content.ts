import Modifier from 'ember-modifier';
import type { PositionalArgs, NamedArgs } from 'ember-modifier';
import { assert } from '@ember/debug';
import type { Dropdown } from '../components/basic-dropdown';

interface Signature {
  Element: HTMLElement;
  Args: {
    Named: {
      dropdown: Dropdown;
    };
    Positional: unknown[];
  };
}

export default class DropdownContentModifier extends Modifier<Signature> {
  didSetup = false;
  dropdownElement: HTMLElement | undefined;
  dropdown?: Dropdown;

  override modify(
    element: HTMLElement,
    _positional: PositionalArgs<Signature>,
    named: NamedArgs<Signature>,
  ): void {
    assert('must be provided dropdown object', named.dropdown);
    this.dropdown = named.dropdown;

    if (!this.didSetup) {
      return;
    }

    this.setup(element);
    this.didSetup = true;
  }

  setup(element: HTMLElement) {
    this.dropdownElement = element;
    this.dropdown?.actions?.registerContentElement &&
      this.dropdown.actions.registerContentElement(element);
  }
}
