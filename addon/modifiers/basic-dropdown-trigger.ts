import Modifier, { ArgsFor, PositionalArgs, NamedArgs } from 'ember-modifier';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import hasMoved from '../utils/has-moved';
import { Dropdown } from '../components/basic-dropdown';

interface Signature {
  Element: HTMLElement;
  Args: {
    Named: {
      dropdown: Dropdown;
      eventType?: 'click' | 'mousedown';
      stopPropagation?: boolean;
      [named: string]: unknown;
    };
    Positional: unknown[];
  };
}

export default class DropdownTriggerModifier extends Modifier<Signature> {
  didSetup = false;

  triggerElement?: HTMLElement;

  toggleIsBeingHandledByTouchEvents: boolean = false;
  touchMoveEvent?: TouchEvent;

  constructor(owner: unknown, args: ArgsFor<Signature>) {
    super(owner, args)
    registerDestructor(this, cleanup)
  }

  modify(element: HTMLElement, positional: PositionalArgs<Signature>, named: NamedArgs<Signature>): void {
    if (!this.didSetup) {
      this.setup(element)
      this.didSetup = true
    }
    this.update(element, positional, named)
  }

  setup(element: HTMLElement) {
    // Keep a reference to the element for cleanup
    this.triggerElement = element

    if(!element.getAttribute('role')) element.setAttribute('role', 'button');

    element.addEventListener('click', this.handleMouseEvent);
    element.addEventListener('mousedown', this.handleMouseEvent);
    element.addEventListener('keydown', this.handleKeyDown);
    element.addEventListener('touchstart', this.handleTouchStart);
    element.addEventListener('touchend', this.handleTouchEnd);
  }

  update(element: HTMLElement, _positional: PositionalArgs<Signature>, named: NamedArgs<Signature>) {
    const { dropdown } = named

    element.setAttribute('data-ebd-id', `${dropdown?.uniqueId}-trigger`);
    element.setAttribute('aria-owns', `ember-basic-dropdown-content-${dropdown?.uniqueId}`);
    element.setAttribute('aria-controls', `ember-basic-dropdown-content-${dropdown?.uniqueId}`);
    element.setAttribute('aria-expanded', dropdown?.isOpen ? 'true' : 'false');
    element.setAttribute('aria-disabled', dropdown?.disabled ? 'true' : 'false');
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
    if ((e && e.defaultPrevented) || disabled) {
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

function cleanup(instance: DropdownTriggerModifier) {
  const { triggerElement } = instance
  if (triggerElement) {
    if (typeof document !== 'undefined') document.removeEventListener('touchmove', instance._touchMoveHandler);

    triggerElement.removeEventListener('click', instance.handleMouseEvent);
    triggerElement.removeEventListener('mousedown', instance.handleMouseEvent);
    triggerElement.removeEventListener('keydown', instance.handleKeyDown);
    triggerElement.removeEventListener('touchstart', instance.handleTouchStart);
    triggerElement.removeEventListener('touchend', instance.handleTouchEnd);
  }
}