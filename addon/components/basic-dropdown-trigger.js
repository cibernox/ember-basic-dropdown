import Component from "@ember/component";
import layout from '../templates/components/basic-dropdown-trigger';

const isTouchDevice = (!!window && 'ontouchstart' in window);

export default Component.extend({
  layout,
  tagName: '',
  isTouchDevice,
  eventType: 'click',
  stopPropagation: false,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.uniqueId = `${this.dropdown.uniqueId}-trigger`;
    this.dropdownId = this.dropdownId || `ember-basic-dropdown-content-${this.dropdown.uniqueId}`;
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    this._mouseupHandler = () => {
      document.removeEventListener('mouseup', this._mouseupHandler, true);
      document.body.classList.remove('ember-basic-dropdown-text-select-disabled');
    };
  },

  didInsertElement() {
    this._super(...arguments);
    this.triggerEl = document.querySelector(`[data-ebd-id="${this.uniqueId}"]`);
    this._addMandatoryHandlers();
    this._addOptionalHandlers();
  },

  willDestroyElement() {
    this._super(...arguments);
    document.removeEventListener('touchmove', this._touchMoveHandler);
    document.removeEventListener('mouseup', this._mouseupHandler, true);
  },

  // Actions
  actions: {
    handleMouseDown(e) {
      if (this.dropdown.disabled) {
        return;
      }
      // execute user-supplied onMouseDown function before default toggle action;
      // short-circuit default behavior if user-supplied function returns `false`
      if (this.onMouseDown && this.onMouseDown(this.dropdown, e) === false) {
        return;
      }
      if (this.eventType === 'mousedown') {
        if (e.button !== 0) { return; }
        if (this.stopPropagation) {
          e.stopPropagation();
        }
        this.stopTextSelectionUntilMouseup();
        if (this.toggleIsBeingHandledByTouchEvents) {
          // Some devises have both touchscreen & mouse, and they are not mutually exclusive
          // In those cases the touchdown handler is fired first, and it sets a flag to
          // short-circuit the mouseup so the component is not opened and immediately closed.
          this.toggleIsBeingHandledByTouchEvents = false;
          return;
        }
        this.dropdown.actions.toggle(e);
      }
    },

    handleClick(e) {
      if (!this.dropdown || this.dropdown.disabled) {
        return;
      }
      // execute user-supplied onClick function before default toggle action;
      // short-circuit default behavior if user-supplied function returns `false`
      if (this.onClick && this.onClick(this.dropdown, e) === false) {
        return;
      }
      if (this.eventType === 'click') {
        if (e.button !== 0) { return; }
        if (this.stopPropagation) {
          e.stopPropagation();
        }
        if (this.toggleIsBeingHandledByTouchEvents) {
          // Some devises have both touchscreen & mouse, and they are not mutually exclusive
          // In those cases the touchdown handler is fired first, and it sets a flag to
          // short-circuit the mouseup so the component is not opened and immediately closed.
          this.toggleIsBeingHandledByTouchEvents = false;
          return;
        }
        this.dropdown.actions.toggle(e);
      }
    },

    handleKeyDown(e) {
      if (this.dropdown.disabled) {
        return;
      }
      if (this.onKeyDown && this.onKeyDown(this.dropdown, e) === false) {
        return;
      }
      if (e.keyCode === 13) {  // Enter
        this.dropdown.actions.toggle(e);
      } else if (e.keyCode === 32) { // Space
        e.preventDefault(); // prevents the space to trigger a scroll page-next
        this.dropdown.actions.toggle(e);
      } else if (e.keyCode === 27) {
        this.dropdown.actions.close(e);
      }
    },

    handleTouchEnd(e) {
      this.toggleIsBeingHandledByTouchEvents = true;
      if (e && e.defaultPrevented || this.dropdown.disabled) {
        return;
      }
      if (!this.hasMoved) {
        // execute user-supplied onTouchEnd function before default toggle action;
        // short-circuit default behavior if user-supplied function returns `false`
        if (this.onTouchEnd && this.onTouchEnd(this.dropdown, e) === false) {
          return;
        }
        this.dropdown.actions.toggle(e);
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
    },
  },

  // Methods
  _touchMoveHandler() {
    this.hasMoved = true;
    document.removeEventListener('touchmove', this._touchMoveHandler);
  },

  stopTextSelectionUntilMouseup() {
    document.addEventListener('mouseup', this._mouseupHandler, true);
    document.body.classList.add('ember-basic-dropdown-text-select-disabled');
  },

  _addMandatoryHandlers() {
    if (this.isTouchDevice) {
      // If the component opens on click there is no need of any of this, as the device will
      // take care tell apart faux clicks from scrolls.
      this.triggerEl.addEventListener('touchstart', () => {
        document.addEventListener('touchmove', this._touchMoveHandler);
      });
      this.triggerEl.addEventListener('touchend', (e) => this.send('handleTouchEnd', e));
    }
    this.triggerEl.addEventListener('mousedown', (e) => this.send('handleMouseDown', e));
    this.triggerEl.addEventListener('click', (e) => {
      if (!this.isDestroyed) {
        this.send('handleClick', e)
      }
    });
    this.triggerEl.addEventListener('keydown', (e) => this.send('handleKeyDown', e));
  },

  _addOptionalHandlers() {
    if (this.onMouseEnter) {
      this.triggerEl.addEventListener('mouseenter', (e) => this.onMouseEnter(this.dropdown, e));
    }
    if (this.onMouseLeave) {
      this.triggerEl.addEventListener('mouseleave', (e) => this.onMouseLeave(this.dropdown, e));
    }
    if (this.onFocus) {
      this.triggerEl.addEventListener('focus', (e) => this.onFocus(this.dropdown, e));
    }
    if (this.onBlur) {
      this.triggerEl.addEventListener('blur', (e) => this.onBlur(this.dropdown, e));
    }
    if (this.onFocusIn) {
      this.triggerEl.addEventListener('focusin', (e) => this.onFocusIn(this.dropdown, e));
    }
    if (this.onFocusOut) {
      this.triggerEl.addEventListener('focusout', (e) => this.onFocusOut(this.dropdown, e));
    }
    if (this.onKeyUp) {
      this.triggerEl.addEventListener('keyup', (e) => this.onKeyUp(this.dropdown, e));
    }
  }
});
