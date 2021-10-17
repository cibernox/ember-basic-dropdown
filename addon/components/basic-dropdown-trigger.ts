import Component from '@glimmer/component';
import { action } from '@ember/object';
import hasMoved from '../utils/has-moved';
import { Dropdown } from './basic-dropdown';
interface Args {
  dropdown: Dropdown;
  eventType: 'click' | 'mousedown';
  stopPropagation: boolean;
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
}

export default class BasicDropdownTrigger extends Component<Args> {
  private toggleIsBeingHandledByTouchEvents: boolean = false;
  private touchMoveEvent?: TouchEvent;

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
  handleMouseDown(e: MouseEvent): void {
    if (this.args.dropdown.disabled) {
      return;
    }
    if (this.args.eventType !== 'mousedown' || e.button !== 0) return;
    if (this.args.stopPropagation) {
      e.stopPropagation();
    }
    this._stopTextSelectionUntilMouseup();
    if (this.toggleIsBeingHandledByTouchEvents) {
      // Some devises have both touchscreen & mouse, and they are not mutually exclusive
      // In those cases the touchdown handler is fired first, and it sets a flag to
      // short-circuit the mouseup so the component is not opened and immediately closed.
      this.toggleIsBeingHandledByTouchEvents = false;
      return;
    }
    this.args.dropdown.actions.toggle(e);
  }

  @action
  handleClick(e: MouseEvent): void {
    if (typeof document === 'undefined') return;
    if (
      this.isDestroyed ||
      !this.args.dropdown ||
      this.args.dropdown.disabled
    ) {
      return;
    }
    if (
      (this.args.eventType !== undefined && this.args.eventType !== 'click') ||
      e.button !== 0
    )
      return;
    if (this.args.stopPropagation) {
      e.stopPropagation();
    }
    if (this.toggleIsBeingHandledByTouchEvents) {
      // Some devises have both touchscreen & mouse, and they are not mutually exclusive
      // In those cases the touchdown handler is fired first, and it sets a flag to
      // short-circuit the mouseup so the component is not opened and immediately closed.
      this.toggleIsBeingHandledByTouchEvents = false;
      return;
    }
    this.args.dropdown.actions.toggle(e);
  }

  @action
  handleKeyDown(e: KeyboardEvent): void {
    if (this.args.dropdown.disabled) {
      return;
    }
    if (e.keyCode === 13) {
      // Enter
      this.args.dropdown.actions.toggle(e);
    } else if (e.keyCode === 32) {
      // Space
      e.preventDefault(); // prevents the space to trigger a scroll page-next
      this.args.dropdown.actions.toggle(e);
    } else if (e.keyCode === 27) {
      this.args.dropdown.actions.close(e);
    }
  }

  @action
  handleTouchStart(): void {
    document.addEventListener('touchmove', this._touchMoveHandler);
  }

  @action
  handleTouchEnd(e: TouchEvent): void {
    this.toggleIsBeingHandledByTouchEvents = true;
    if ((e && e.defaultPrevented) || this.args.dropdown.disabled) {
      return;
    }
    if (!hasMoved(e, this.touchMoveEvent)) {
      this.args.dropdown.actions.toggle(e);
    }
    this.touchMoveEvent = undefined;
    document.removeEventListener('touchmove', this._touchMoveHandler);
    // This next three lines are stolen from hammertime. This prevents the default
    // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
    // to simulate natural behaviour.
    let target = e.target as HTMLElement;
    if (target !== null) {
      target.focus();
    }
    setTimeout(function () {
      if (!e.target) {
        return;
      }
      try {
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent(
          'click',
          true,
          true,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        e.target.dispatchEvent(event);
      } catch (e) {
        event = new Event('click');
        e.target.dispatchEvent(event);
      }
    }, 0);
    e.preventDefault();
  }

  @action
  removeGlobalHandlers(): void {
    if (typeof document === 'undefined') return;
    document.removeEventListener('touchmove', this._touchMoveHandler);
    document.removeEventListener('mouseup', this._mouseupHandler, true);
  }

  @action
  _mouseupHandler(): void {
    document.removeEventListener('mouseup', this._mouseupHandler, true);
    document.body.classList.remove('ember-basic-dropdown-text-select-disabled');
  }

  @action
  _touchMoveHandler(e: TouchEvent): void {
    this.touchMoveEvent = e;
    document.removeEventListener('touchmove', this._touchMoveHandler);
  }

  // Methods
  _stopTextSelectionUntilMouseup(): void {
    document.addEventListener('mouseup', this._mouseupHandler, true);
    document.body.classList.add('ember-basic-dropdown-text-select-disabled');
  }
}
