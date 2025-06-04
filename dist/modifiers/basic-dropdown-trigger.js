import Modifier from 'ember-modifier';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { registerDestructor, isDestroyed } from '@ember/destroyable';
import hasMoved from '../utils/has-moved.js';
import { n } from 'decorator-transforms/runtime';

class DropdownTriggerModifier extends Modifier {
  didSetup = false;
  triggerElement;
  toggleIsBeingHandledByTouchEvents = false;
  touchMoveEvent;
  dropdown;
  desiredEventType;
  stopPropagation;
  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }
  modify(element, positional, named) {
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
  setup(element) {
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
      passive: false
    });
    element.addEventListener('touchend', this.handleTouchEndBound);
  }
  update(element, _positional, named) {
    const {
      dropdown
    } = named;
    element.setAttribute('data-ebd-id', `${dropdown.uniqueId}-trigger`);
    if (element.getAttribute('aria-owns') === null) {
      element.setAttribute('aria-owns', `ember-basic-dropdown-content-${dropdown.uniqueId}`);
    }
    if (element.getAttribute('aria-controls') === null) {
      element.setAttribute('aria-controls', `ember-basic-dropdown-content-${dropdown.uniqueId}`);
    }
    element.setAttribute('aria-expanded', dropdown.isOpen ? 'true' : 'false');
    element.setAttribute('aria-disabled', dropdown.disabled ? 'true' : 'false');
  }
  handleMouseEvent(e) {
    if (typeof document === 'undefined') return;
    const {
      dropdown,
      desiredEventType,
      stopPropagation
    } = this;
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
  static {
    n(this.prototype, "handleMouseEvent", [action]);
  }
  handleKeyDown(e) {
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
  static {
    n(this.prototype, "handleKeyDown", [action]);
  }
  handleTouchStart() {
    document.addEventListener('touchmove', this.touchMoveHandlerBound);
    if (this.triggerElement?.getRootNode() instanceof ShadowRoot) {
      (this.triggerElement?.getRootNode()).addEventListener('touchmove', this.touchMoveHandlerBound);
    }
  }
  static {
    n(this.prototype, "handleTouchStart", [action]);
  }
  handleTouchEnd(e) {
    this.toggleIsBeingHandledByTouchEvents = true;
    const disabled = this.dropdown?.disabled,
      actions = this.dropdown?.actions;
    if (e && e.defaultPrevented || disabled || !actions) {
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
    const target = e.composedPath?.()[0] || e.target;
    if (target !== null) {
      target.focus();
    }
    setTimeout(function () {
      if (!e.target) {
        return;
      }
      try {
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        e.target.dispatchEvent(event);
      } catch {
        const event = new Event('click');
        e.target.dispatchEvent(event);
      }
    }, 0);
    e.preventDefault();
  }
  static {
    n(this.prototype, "handleTouchEnd", [action]);
  }
  _touchMoveHandler(e) {
    this.touchMoveEvent = e;
    document.removeEventListener('touchmove', this.touchMoveHandlerBound);
    if (this.triggerElement?.getRootNode() instanceof ShadowRoot) {
      (this.triggerElement?.getRootNode()).removeEventListener('touchmove', this.touchMoveHandlerBound);
    }
  }
  static {
    n(this.prototype, "_touchMoveHandler", [action]);
  }
  handleMouseEventBound = e => this.handleMouseEvent(e);
  handleKeyDownBound = e => this.handleKeyDown(e);
  handleTouchStartBound = () => this.handleTouchStart();
  handleTouchEndBound = e => this.handleTouchEnd(e);
  touchMoveHandlerBound = e => this._touchMoveHandler(e);
}
function cleanup(instance) {
  const {
    triggerElement
  } = instance;
  if (triggerElement) {
    if (typeof document !== 'undefined') document.removeEventListener('touchmove', instance.touchMoveHandlerBound);
    if (triggerElement?.getRootNode() instanceof ShadowRoot) {
      (triggerElement?.getRootNode()).removeEventListener('touchmove', instance.touchMoveHandlerBound);
    }
    triggerElement.removeEventListener('click', instance.handleMouseEventBound);
    triggerElement.removeEventListener('mousedown', instance.handleMouseEventBound);
    triggerElement.removeEventListener('keydown', instance.handleKeyDownBound);
    triggerElement.removeEventListener('touchstart', instance.handleTouchStartBound);
    triggerElement.removeEventListener('touchend', instance.handleTouchEndBound);
  }
}

export { DropdownTriggerModifier as default };
//# sourceMappingURL=basic-dropdown-trigger.js.map
