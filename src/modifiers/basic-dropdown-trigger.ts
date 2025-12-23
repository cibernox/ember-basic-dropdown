import Modifier from 'ember-modifier';
import type { ArgsFor, PositionalArgs, NamedArgs } from 'ember-modifier';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { isDestroyed, registerDestructor } from '@ember/destroyable';
import hasMoved from '../utils/has-moved.ts';
import type Owner from '@ember/owner';
import type { Dropdown } from '../types.ts';

interface Signature {
  Element: HTMLElement;
  Args: {
    Named: {
      dropdown: Dropdown;
      eventType?: 'click' | 'mousedown' | undefined;
      stopPropagation?: boolean | undefined;
      [named: string]: unknown;
    };
    Positional: unknown[];
  };
}

export default class DropdownTriggerModifier extends Modifier<Signature> {
  didSetup = false;

  triggerElement: HTMLElement | undefined;

  toggleIsBeingHandledByTouchEvents: boolean = false;
  touchMoveEvent: TouchEvent | undefined;

  dropdown?: Dropdown;
  desiredEventType!: string;
  stopPropagation: boolean | undefined;

  constructor(owner: Owner, args: ArgsFor<Signature>) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }

  override modify(
    element: HTMLElement,
    positional: PositionalArgs<Signature>,
    named: NamedArgs<Signature>,
  ): void {
    assert('must be provided dropdown object', named.dropdown);
    this.dropdown = named.dropdown;
    this.desiredEventType = named.eventType ?? 'click';
    this.stopPropagation = named.stopPropagation;

    if (!this.didSetup) {
      this.setup(element);
      this.didSetup = true;
    }
    this.update(element, positional, named);
  }

  setup(element: HTMLElement) {
    // Keep a reference to the element for cleanup
    this.triggerElement = element;
    if (this.dropdown?.actions?.registerTriggerElement) {
      this.dropdown.actions.registerTriggerElement(element);
    }

    if (!element.getAttribute('role')) element.setAttribute('role', 'button');

    element.addEventListener('click', this.handleMouseEventBound);
    element.addEventListener('mousedown', this.handleMouseEventBound);
    element.addEventListener('keydown', this.handleKeyDownBound);
    element.addEventListener('touchstart', this.handleTouchStartBound, {
      passive: false,
    });
    element.addEventListener('touchend', this.handleTouchEndBound);
  }

  update(
    element: HTMLElement,
    _positional: PositionalArgs<Signature>,
    named: NamedArgs<Signature>,
  ) {
    const { dropdown } = named;

    element.setAttribute('data-ebd-id', `${dropdown.uniqueId}-trigger`);

    if (element.getAttribute('aria-owns') === null) {
      element.setAttribute(
        'aria-owns',
        `ember-basic-dropdown-content-${dropdown.uniqueId}`,
      );
    }

    if (element.getAttribute('aria-controls') === null) {
      element.setAttribute(
        'aria-controls',
        `ember-basic-dropdown-content-${dropdown.uniqueId}`,
      );
    }

    element.setAttribute('aria-expanded', dropdown.isOpen ? 'true' : 'false');
    element.setAttribute('aria-disabled', dropdown.disabled ? 'true' : 'false');
  }

  @action
  handleMouseEvent(e: MouseEvent): void {
    if (typeof document === 'undefined') return;
    const { dropdown, desiredEventType, stopPropagation } = this;

    if (isDestroyed(this) || !dropdown || dropdown.disabled) return;

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
    const disabled = this.dropdown?.disabled,
      actions = this.dropdown?.actions;

    if (disabled || !actions) return;
    if (e.keyCode === 13) {
      // Enter
      actions.toggle(e);
    } else if (e.keyCode === 32) {
      // Space
      e.preventDefault(); // prevents the space to trigger a scroll page-next
      actions.toggle(e);
    } else if (e.keyCode === 27) {
      actions.close(e);
    }
  }

  @action
  handleTouchStart(): void {
    document.addEventListener('touchmove', this.touchMoveHandlerBound);
    if (this.triggerElement?.getRootNode() instanceof ShadowRoot) {
      (this.triggerElement?.getRootNode() as HTMLElement).addEventListener(
        'touchmove',
        this.touchMoveHandlerBound,
      );
    }
  }

  @action
  handleTouchEnd(e: TouchEvent): void {
    this.toggleIsBeingHandledByTouchEvents = true;
    const disabled = this.dropdown?.disabled,
      actions = this.dropdown?.actions;

    if ((e && e.defaultPrevented) || disabled || !actions) {
      return;
    }
    if (!hasMoved(e, this.touchMoveEvent)) {
      actions.toggle(e);
    }
    this.touchMoveEvent = undefined;
    document.removeEventListener('touchmove', this.touchMoveHandlerBound);
    // This next three lines are stolen from hammertime. This prevents the default
    // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
    // to simulate natural behaviour.
    const target = (e.composedPath?.()[0] || e.target) as HTMLElement;
    if (target !== null) {
      target.focus();
    }
    setTimeout(function () {
      if (!e.target) {
        return;
      }
      try {
        const event = document.createEvent('MouseEvents');
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
          null,
        );
        e.target.dispatchEvent(event);
      } catch {
        const event = new Event('click');
        e.target.dispatchEvent(event);
      }
    }, 0);
    e.preventDefault();
  }

  @action
  _touchMoveHandler(e: TouchEvent): void {
    this.touchMoveEvent = e;
    document.removeEventListener('touchmove', this.touchMoveHandlerBound);

    if (this.triggerElement?.getRootNode() instanceof ShadowRoot) {
      (this.triggerElement?.getRootNode() as HTMLElement).removeEventListener(
        'touchmove',
        this.touchMoveHandlerBound,
      );
    }
  }

  handleMouseEventBound = (e: MouseEvent) => this.handleMouseEvent(e);
  handleKeyDownBound = (e: KeyboardEvent) => this.handleKeyDown(e);
  handleTouchStartBound = () => this.handleTouchStart();
  handleTouchEndBound = (e: TouchEvent) => this.handleTouchEnd(e);
  touchMoveHandlerBound = (e: TouchEvent) => this._touchMoveHandler(e);
}

function cleanup(instance: DropdownTriggerModifier) {
  const { triggerElement } = instance;
  if (triggerElement) {
    if (typeof document !== 'undefined')
      document.removeEventListener('touchmove', instance.touchMoveHandlerBound);

    if (triggerElement?.getRootNode() instanceof ShadowRoot) {
      (triggerElement?.getRootNode() as HTMLElement).removeEventListener(
        'touchmove',
        instance.touchMoveHandlerBound,
      );
    }

    triggerElement.removeEventListener('click', instance.handleMouseEventBound);
    triggerElement.removeEventListener(
      'mousedown',
      instance.handleMouseEventBound,
    );
    triggerElement.removeEventListener('keydown', instance.handleKeyDownBound);
    triggerElement.removeEventListener(
      'touchstart',
      instance.handleTouchStartBound,
    );
    triggerElement.removeEventListener(
      'touchend',
      instance.handleTouchEndBound,
    );
  }
}
