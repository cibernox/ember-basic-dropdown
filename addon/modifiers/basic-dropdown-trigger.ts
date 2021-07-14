import Modifier from 'ember-modifier';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import hasMoved from '../utils/has-moved';
import { Dropdown } from '../components/basic-dropdown';

interface Args {
  positional: []
  named: {
    dropdown: Dropdown
    eventType?: 'click' | 'mousedown'
    stopPropagation?: boolean
  }
}

export default class DropdownTriggerModifier extends Modifier<Args> {
  @tracked private toggleIsBeingHandledByTouchEvents: boolean = false
  @tracked private touchMoveEvent?: TouchEvent

  didInstall() {
    if(!this.element.getAttribute('role')) this.element.setAttribute('role', 'button');

    this.element.addEventListener('click', this.handleMouseEvent);
    this.element.addEventListener('mousedown', this.handleMouseEvent);
    this.element.addEventListener('keydown', this.handleKeyDown);
    this.element.addEventListener('touchstart', this.handleTouchStart);
    this.element.addEventListener('touchend', this.handleTouchEnd);
  }

  didReceiveArguments() {
    const { dropdown } = this.args.named

    this.element.setAttribute('data-ebd-id', `${dropdown?.uniqueId}-trigger`);
    this.element.setAttribute('aria-owns', `ember-basic-dropdown-content-${dropdown?.uniqueId}`);
    this.element.setAttribute('aria-expanded', dropdown?.isOpen ? 'true' : 'false');

    if (dropdown?.disabled) {
      this.element.removeAttribute('tabindex');
      this.element.setAttribute('aria-disabled', 'true');
    } else {
      this.element.setAttribute('tabindex', '0');
      this.element.setAttribute('aria-disabled', 'false');
    }
  }

  willRemove() {
    if (typeof document !== 'undefined') document.removeEventListener('touchmove', this._touchMoveHandler);

    this.element.removeEventListener('click', this.handleMouseEvent);
    this.element.removeEventListener('mousedown', this.handleMouseEvent);
    this.element.removeEventListener('keydown', this.handleKeyDown);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }

  @action
  handleMouseEvent(e: MouseEvent): void {
    if (typeof document === 'undefined') return;
    const { dropdown, stopPropagation, eventType: desiredEventType = 'click' } = this.args.named;

    if (this.isDestroyed || !dropdown || dropdown.disabled) return;

    const eventType = e.type;
    const notLeftClick = e.button !== 0;
    if (eventType !== desiredEventType || notLeftClick) return;
    
    if (stopPropagation) e.stopPropagation();

    if (this.toggleIsBeingHandledByTouchEvents) {
      // Some devises have both touchscreen & mouse, and they are not mutually exclusive
      // In those cases the touchdown handler is fired first, and it sets a flag to
      // short-circuit the mouseup so the component is not opened and immediately closed.
      this.toggleIsBeingHandledByTouchEvents = false;
      return;
    }
    dropdown.actions.toggle(e);
  }

  @action
  handleKeyDown(e: KeyboardEvent): void {
    const { disabled, actions } = this.args.named.dropdown;

    if (disabled) return;
    if (e.keyCode === 13) {  // Enter
      actions.toggle(e);
    } else if (e.keyCode === 32) { // Space
      e.preventDefault(); // prevents the space to trigger a scroll page-next
      actions.toggle(e);
    } else if (e.keyCode === 27) {
      actions.close(e);
    }
  }

  @action
  handleTouchStart(): void {
    document.addEventListener('touchmove', this._touchMoveHandler);
  }

  @action
  handleTouchEnd(e: TouchEvent): void {
    this.toggleIsBeingHandledByTouchEvents = true;
    const { disabled, actions } = this.args.named.dropdown;
    if (e && e.defaultPrevented || disabled) {
      return;
    }
    if (!hasMoved(e, this.touchMoveEvent)) {
      actions.toggle(e);
    }
    this.touchMoveEvent = undefined;
    document.removeEventListener('touchmove', this._touchMoveHandler);
    // This next three lines are stolen from hammertime. This prevents the default
    // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
    // to simulate natural behaviour.
    const target = e.target as HTMLElement;
    if (target !== null) {
      target.focus();
    }
    setTimeout(function() {
      if (!e.target) { return; }
      try {
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        e.target.dispatchEvent(event);
      } catch (e) {
        const event = new Event('click');
        e.target.dispatchEvent(event);
      }
    }, 0);
    e.preventDefault();
  }

  @action
  _touchMoveHandler(e: TouchEvent): void {
    this.touchMoveEvent = e;
    document.removeEventListener('touchmove', this._touchMoveHandler);
  }
}
