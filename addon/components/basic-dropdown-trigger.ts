import Component from '@glimmer/component';
import { action } from "@ember/object";

interface DropdownActions {
  toggle: Function
  close: Function
}
interface Dropdown {
  disabled: boolean
  actions: DropdownActions
}
interface Args {
  dropdown: Dropdown
  eventType: 'click' | 'mousedown'
  stopPropagation: boolean
}

export default class BasicDropdownTrigger extends Component<Args> {
  private toggleIsBeingHandledByTouchEvents: boolean = false
  private hasMoved: boolean = false

  // Actions
  @action
  handleMouseDown(e: MouseEvent) {
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
  handleClick(e: MouseEvent) {
    if (typeof document === 'undefined') return;
    if (this.isDestroyed || !this.args.dropdown || this.args.dropdown.disabled) {
      return;
    }
    if ((this.args.eventType !== undefined && this.args.eventType !== 'click') || e.button !== 0) return;
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
  handleKeyDown(e: KeyboardEvent) {
    if (this.args.dropdown.disabled) {
      return;
    }
    if (e.keyCode === 13) {  // Enter
      this.args.dropdown.actions.toggle(e);
    } else if (e.keyCode === 32) { // Space
      e.preventDefault(); // prevents the space to trigger a scroll page-next
      this.args.dropdown.actions.toggle(e);
    } else if (e.keyCode === 27) {
      this.args.dropdown.actions.close(e);
    }
  }

  @action
  handleTouchStart() {
    document.addEventListener('touchmove', this._touchMoveHandler);
  }

  @action
  handleTouchEnd(e: TouchEvent) {
    this.toggleIsBeingHandledByTouchEvents = true;
    if (e && e.defaultPrevented || this.args.dropdown.disabled) {
      return;
    }
    if (!this.hasMoved) {
      this.args.dropdown.actions.toggle(e);
    }
    this.hasMoved = false;
    document.removeEventListener('touchmove', this._touchMoveHandler);
    // This next three lines are stolen from hammertime. This prevents the default
    // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
    // to simulate natural behaviour.
    let target = e.target as HTMLElement;
    if (target !== null) {
      target.focus();
    }
    setTimeout(function() {
      if (!e.target) { return; }
      try {
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        e.target.dispatchEvent(event);
      } catch (e) {
        event = new Event('click');
        e.target.dispatchEvent(event);
      }
    }, 0);
    e.preventDefault();
  }

  @action
  removeGlobalHandlers() {
    if (typeof document === 'undefined') return;
    document.removeEventListener('touchmove', this._touchMoveHandler);
    document.removeEventListener('mouseup', this._mouseupHandler, true);
  }

  @action
  _mouseupHandler() {
    document.removeEventListener('mouseup', this._mouseupHandler, true);
    document.body.classList.remove('ember-basic-dropdown-text-select-disabled');
  }

  @action
  _touchMoveHandler() {
    this.hasMoved = true;
    document.removeEventListener('touchmove', this._touchMoveHandler);
  }

  // Methods
  _stopTextSelectionUntilMouseup() {
    document.addEventListener('mouseup', this._mouseupHandler, true);
    document.body.classList.add('ember-basic-dropdown-text-select-disabled');
  }
}
