import { layout } from "@ember-decorators/component";
import { action } from "@ember-decorators/object";
// // import Component from "@ember/component";
import Component from "@glimmer/component";
import templateLayout from '../../templates/components/basic-dropdown/trigger';

const isTouchDevice = (!!window && 'ontouchstart' in window);

@layout(templateLayout)

export default class BasicDropdownTrigger extends Component {
  isTouchDevice = isTouchDevice;
  defaultEventType = 'click';
  defaultStopPropagation = false;

  constructor() {
    super(...arguments);
  }

  // Actions
  @action
  handleMouseDown(e) {
    let { dropdown, onMouseDown, eventType = this.defaultEventType, stopPropagation = this.defaultStopPropagation } = this.args;
    if (this.isDestroyed || !dropdown || dropdown.disabled) {
      return;
    }
    // execute user-supplied onMouseDown function before default toggle action;
    // short-circuit default behavior if user-supplied function returns `false`
    if (onMouseDown && onMouseDown(dropdown, e) === false) {
      return;
    }
    if (eventType !== 'mousedown' || e.button !== 0) return;
    if (stopPropagation) { e.stopPropagation(); }
    this._stopTextSelectionUntilMouseup();
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
  handleClick(e) {
    debugger;
    if (typeof document === 'undefined') return;
    let { dropdown, onClick, eventType = this.defaultEventType, stopPropagation = this.defaultStopPropagation } = this.args;
    if (this.isDestroyed || !dropdown || dropdown.disabled) {
      return;
    }
    // execute user-supplied onClick function before default toggle action;
    // short-circuit default behavior if user-supplied function returns `false`
    if (onClick && onClick(dropdown, e) === false) {
      return;
    }
    if (eventType !== 'click' || e.button !== 0) return;
    if (stopPropagation) { e.stopPropagation(); }
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
  handleKeyDown(e) {
    let { dropdown, onKeyDown } = this.args;
    if (dropdown.disabled) {
      return;
    }
    if (onKeyDown && onKeyDown(dropdown, e) === false) {
      return;
    }
    if (e.keyCode === 13) {  // Enter
      dropdown.actions.toggle(e);
    } else if (e.keyCode === 32) { // Space
      e.preventDefault(); // prevents the space to trigger a scroll page-next
      dropdown.actions.toggle(e);
    } else if (e.keyCode === 27) {
      dropdown.actions.close(e);
    }
  }

  @action
  handleTouchEnd(e) {
    this.toggleIsBeingHandledByTouchEvents = true;
    let { dropdown, onTouchEnd } = this.args;

    if (e && e.defaultPrevented || dropdown.disabled) {
      return;
    }
    if (!this.hasMoved) {
      // execute user-supplied onTouchEnd function before default toggle action;
      // short-circuit default behavior if user-supplied function returns `false`
      if (onTouchEnd && onTouchEnd(dropdown, e) === false) {
        return;
      }
      dropdown.actions.toggle(e);
    }
    this.hasMoved = false;
    document.removeEventListener('touchmove', this._touchMoveHandler);
    // This next three lines are stolen from hammertime. This prevents the default
    // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
    // to simulate natural behaviour.
    e.target.focus();
    setTimeout(function() {
      if (!e.target) { return; }
      let event;
      try {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window);
      } catch (e) {
        event = new Event('click');
      } finally {
        e.target.dispatchEvent(event);
      }
    }, 0);
    e.preventDefault();
  }

  @action
  addTouchHandlers(triggerEl) {
    if (this.isTouchDevice) {
      // If the component opens on click there is no need of any of this, as the device will
      // take care tell apart faux clicks from scrolls.
      triggerEl.addEventListener('touchstart', () => {
        document.addEventListener('touchmove', this._touchMoveHandler);
      });
      triggerEl.addEventListener('touchend', this.handleTouchEnd);
    }
  }

  @action
  removeGlobalHandlers() {
    if (typeof document === 'undefined') return;
    document.removeEventListener('touchmove', this._touchMoveHandler);
    document.removeEventListener('mouseup', this._mouseupHandler, true);
  }

  @action
  addOptionalHandlers(triggerEl) {
    if (this.args.onMouseEnter) {
      triggerEl.addEventListener('mouseenter', (e) => this.args.onMouseEnter(this.args.dropdown, e));
    }
    if (this.args.onMouseLeave) {
      triggerEl.addEventListener('mouseleave', (e) => this.args.onMouseLeave(this.args.dropdown, e));
    }
    if (this.args.onFocus) {
      triggerEl.addEventListener('focus', (e) => this.args.onFocus(this.args.dropdown, e));
    }
    if (this.args.onBlur) {
      triggerEl.addEventListener('blur', (e) => this.args.onBlur(this.args.dropdown, e));
    }
    if (this.args.onFocusIn) {
      triggerEl.addEventListener('focusin', (e) => this.args.onFocusIn(this.args.dropdown, e));
    }
    if (this.args.onFocusOut) {
      triggerEl.addEventListener('focusout', (e) => this.args.onFocusOut(this.args.dropdown, e));
    }
    if (this.args.onKeyUp) {
      triggerEl.addEventListener('keyup', (e) => this.args.onKeyUp(this.args.dropdown, e));
    }
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


// export default class BasicDropdownTrigger extends Component {
//   isTouchDevice = isTouchDevice;
//   eventType = 'click';
//   stopPropagation = false;

//   // Actions
//   @action
//   handleMouseDown(e) {
//     if (this.dropdown.disabled) {
//       return;
//     }
//     // execute user-supplied onMouseDown function before default toggle action;
//     // short-circuit default behavior if user-supplied function returns `false`
//     if (this.onMouseDown && this.onMouseDown(this.dropdown, e) === false) {
//       return;
//     }
//     if (this.eventType !== 'mousedown' || e.button !== 0) return;
//     if (this.stopPropagation) {
//       e.stopPropagation();
//     }
//     this._stopTextSelectionUntilMouseup();
//     if (this.toggleIsBeingHandledByTouchEvents) {
//       // Some devises have both touchscreen & mouse, and they are not mutually exclusive
//       // In those cases the touchdown handler is fired first, and it sets a flag to
//       // short-circuit the mouseup so the component is not opened and immediately closed.
//       this.toggleIsBeingHandledByTouchEvents = false;
//       return;
//     }
//     this.dropdown.actions.toggle(e);
//   }

//   @action
//   handleClick(e) {
//     if (typeof document === 'undefined') return;
//     if (this.isDestroyed || !this.dropdown || this.dropdown.disabled) {
//       return;
//     }
//     // execute user-supplied onClick function before default toggle action;
//     // short-circuit default behavior if user-supplied function returns `false`
//     if (this.onClick && this.onClick(this.dropdown, e) === false) {
//       return;
//     }
//     if (this.eventType !== 'click' || e.button !== 0) return;
//     if (this.stopPropagation) {
//       e.stopPropagation();
//     }
//     if (this.toggleIsBeingHandledByTouchEvents) {
//       // Some devises have both touchscreen & mouse, and they are not mutually exclusive
//       // In those cases the touchdown handler is fired first, and it sets a flag to
//       // short-circuit the mouseup so the component is not opened and immediately closed.
//       this.toggleIsBeingHandledByTouchEvents = false;
//       return;
//     }
//     this.dropdown.actions.toggle(e);
//   }

//   @action
//   handleKeyDown(e) {
//     if (this.dropdown.disabled) {
//       return;
//     }
//     if (this.onKeyDown && this.onKeyDown(this.dropdown, e) === false) {
//       return;
//     }
//     if (e.keyCode === 13) {  // Enter
//       this.dropdown.actions.toggle(e);
//     } else if (e.keyCode === 32) { // Space
//       e.preventDefault(); // prevents the space to trigger a scroll page-next
//       this.dropdown.actions.toggle(e);
//     } else if (e.keyCode === 27) {
//       this.dropdown.actions.close(e);
//     }
//   }

//   @action
//   handleTouchEnd(e) {
//     this.toggleIsBeingHandledByTouchEvents = true;
//     if (e && e.defaultPrevented || this.dropdown.disabled) {
//       return;
//     }
//     if (!this.hasMoved) {
//       // execute user-supplied onTouchEnd function before default toggle action;
//       // short-circuit default behavior if user-supplied function returns `false`
//       if (this.onTouchEnd && this.onTouchEnd(this.dropdown, e) === false) {
//         return;
//       }
//       this.dropdown.actions.toggle(e);
//     }
//     this.hasMoved = false;
//     document.removeEventListener('touchmove', this._touchMoveHandler);
//     // This next three lines are stolen from hammertime. This prevents the default
//     // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
//     // to simulate natural behaviour.
//     e.target.focus();
//     setTimeout(function() {
//       if (!e.target) { return; }
//       let event;
//       try {
//         event = document.createEvent('MouseEvents');
//         event.initMouseEvent('click', true, true, window);
//       } catch (e) {
//         event = new Event('click');
//       } finally {
//         e.target.dispatchEvent(event);
//       }
//     }, 0);
//     e.preventDefault();
//   }

//   @action
//   addTouchHandlers(triggerEl) {
//     if (this.isTouchDevice) {
//       // If the component opens on click there is no need of any of this, as the device will
//       // take care tell apart faux clicks from scrolls.
//       triggerEl.addEventListener('touchstart', () => {
//         document.addEventListener('touchmove', this._touchMoveHandler);
//       });
//       triggerEl.addEventListener('touchend', (e) => this.send('handleTouchEnd', e));
//     }
//   }

//   @action
//   removeGlobalHandlers() {
//     if (typeof document === 'undefined') return;
//     document.removeEventListener('touchmove', this._touchMoveHandler);
//     document.removeEventListener('mouseup', this._mouseupHandler, true);
//   }

//   @action
//   addOptionalHandlers(triggerEl) {
//     if (this.onMouseEnter) {
//       triggerEl.addEventListener('mouseenter', (e) => this.onMouseEnter(this.dropdown, e));
//     }
//     if (this.onMouseLeave) {
//       triggerEl.addEventListener('mouseleave', (e) => this.onMouseLeave(this.dropdown, e));
//     }
//     if (this.onFocus) {
//       triggerEl.addEventListener('focus', (e) => this.onFocus(this.dropdown, e));
//     }
//     if (this.onBlur) {
//       triggerEl.addEventListener('blur', (e) => this.onBlur(this.dropdown, e));
//     }
//     if (this.onFocusIn) {
//       triggerEl.addEventListener('focusin', (e) => this.onFocusIn(this.dropdown, e));
//     }
//     if (this.onFocusOut) {
//       triggerEl.addEventListener('focusout', (e) => this.onFocusOut(this.dropdown, e));
//     }
//     if (this.onKeyUp) {
//       triggerEl.addEventListener('keyup', (e) => this.onKeyUp(this.dropdown, e));
//     }
//   }

//   @action
//   _mouseupHandler() {
//     document.removeEventListener('mouseup', this._mouseupHandler, true);
//     document.body.classList.remove('ember-basic-dropdown-text-select-disabled');
//   }

//   @action
//   _touchMoveHandler() {
//     this.hasMoved = true;
//     document.removeEventListener('touchmove', this._touchMoveHandler);
//   }

//   // Methods
//   _stopTextSelectionUntilMouseup() {
//     document.addEventListener('mouseup', this._mouseupHandler, true);
//     document.body.classList.add('ember-basic-dropdown-text-select-disabled');
//   }
// }
