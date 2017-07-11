import Component from "@ember/component";
import { computed } from "@ember/object";
import layout from '../../templates/components/basic-dropdown/trigger';

const isTouchDevice = (!!self.window && 'ontouchstart' in self.window);

function trueStringIfPresent(path) {
  return computed(path, function() {
    if (this.get(path)) {
      return 'true';
    } else {
      return null;
    }
  });
}

export default Component.extend({
  layout,
  isTouchDevice,
  classNames: ['ember-basic-dropdown-trigger'],
  role: 'button',
  tabindex: 0,
  eventType: 'mousedown',
  classNameBindings: ['inPlaceClass', 'hPositionClass', 'vPositionClass'],
  attributeBindings: [
    'role',
    'style',
    'uniqueId:data-ebd-id',
    'tabIndex:tabindex',
    'dropdownId:aria-owns',
    'ariaLabel:aria-label',
    'ariaLabelledBy:aria-labelledby',
    'ariaDescribedBy:aria-describedby',
    'aria-autocomplete',
    'aria-activedescendant',
    'aria-disabled',
    'aria-expanded',
    'aria-haspopup',
    'aria-invalid',
    'aria-pressed',
    'aria-required',
    'title'
  ],

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    let dropdown = this.get('dropdown');
    this.uniqueId = `${dropdown.uniqueId}-trigger`;
    this.dropdownId = this.dropdownId || `ember-basic-dropdown-content-${dropdown.uniqueId}`;
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    this._mouseupHandler = () => {
      self.document.removeEventListener('mouseup', this._mouseupHandler, true);
      self.document.body.classList.remove('ember-basic-dropdown-text-select-disabled');
    };
  },

  didInsertElement() {
    this._super(...arguments);
    this.addMandatoryHandlers();
    this.addOptionalHandlers();
  },

  willDestroyElement() {
    this._super(...arguments);
    self.document.removeEventListener('touchmove', this._touchMoveHandler);
    self.document.removeEventListener('mouseup', this._mouseupHandler, true);
  },

  // CPs
  'aria-disabled': trueStringIfPresent('dropdown.disabled'),
  'aria-expanded': trueStringIfPresent('dropdown.isOpen'),
  'aria-invalid': trueStringIfPresent('ariaInvalid'),
  'aria-pressed': trueStringIfPresent('ariaPressed'),
  'aria-required': trueStringIfPresent('ariaRequired'),

  tabIndex: computed('dropdown.disabled', 'tabindex', function() {
    let tabindex = this.get('tabindex');
    if (tabindex === false || this.get('dropdown.disabled')) {
      return undefined;
    } else {
      return tabindex || 0;
    }
  }).readOnly(),

  inPlaceClass: computed('renderInPlace', function() {
    if (this.get('renderInPlace')) {
      return 'ember-basic-dropdown-trigger--in-place';
    }
  }),

  hPositionClass: computed('hPosition', function() {
    let hPosition = this.get('hPosition');
    if (hPosition) {
      return `ember-basic-dropdown-trigger--${hPosition}`;
    }
  }),

  vPositionClass: computed('vPosition', function() {
    let vPosition = this.get('vPosition');
    if (vPosition) {
      return `ember-basic-dropdown-trigger--${vPosition}`;
    }
  }),

  // Actions
  actions: {
    handleMouseDown(e) {
      let dropdown = this.get('dropdown');
      if (dropdown.disabled) {
        return;
      }
      this.stopTextSelectionUntilMouseup();
      // execute user-supplied onMouseDown function before default toggle action;
      // short-circuit default behavior if user-supplied function returns `false`
      let onMouseDown = this.get('onMouseDown');
      if (onMouseDown && onMouseDown(dropdown, e) === false) {
        return;
      }
      if (this.get('eventType') === 'mousedown') {
        if (this.toggleIsBeingHandledByTouchEvents) {
          // Some devises have both touchscreen & mouse, and they are not mutually exclusive
          // In those cases the touchdown handler is fired first, and it sets a flag to
          // short-circuit the mouseup so the component is not opened and immediately closed.
          this.toggleIsBeingHandledByTouchEvents = false;
          return;
        }
        dropdown.actions.toggle(e);
      }
    },

    handleClick(e) {
      let dropdown = this.get('dropdown');
      if (!dropdown || dropdown.disabled) {
        return;
      }
      if (this.get('eventType') === 'click') {
        if (this.toggleIsBeingHandledByTouchEvents) {
          // Some devises have both touchscreen & mouse, and they are not mutually exclusive
          // In those cases the touchdown handler is fired first, and it sets a flag to
          // short-circuit the mouseup so the component is not opened and immediately closed.
          this.toggleIsBeingHandledByTouchEvents = false;
          return;
        }
        dropdown.actions.toggle(e);
      }
    },

    handleTouchEnd(e) {
      this.toggleIsBeingHandledByTouchEvents = true;
      let dropdown = this.get('dropdown');
      if (e && e.defaultPrevented || dropdown.disabled) {
        return;
      }
      if (!this.hasMoved) {
        // execute user-supplied onTouchEnd function before default toggle action;
        // short-circuit default behavior if user-supplied function returns `false`
        let onTouchEnd = this.get('onTouchEnd');
        if (onTouchEnd && onTouchEnd(dropdown, e) === false) {
          return;
        }
        dropdown.actions.toggle(e);
      }
      this.hasMoved = false;
      self.document.removeEventListener('touchmove', this._touchMoveHandler);
      // This next three lines are stolen from hammertime. This prevents the default
      // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
      // to simulate natural behaviour.
      e.target.focus();
      setTimeout(function() {
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

    handleKeyDown(e) {
      let dropdown = this.get('dropdown');
      if (dropdown.disabled) {
        return;
      }
      let onKeyDown = this.get('onKeyDown');
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
  },

  // Methods
  _touchMoveHandler() {
    this.hasMoved = true;
    self.document.removeEventListener('touchmove', this._touchMoveHandler);
  },

  stopTextSelectionUntilMouseup() {
    self.document.addEventListener('mouseup', this._mouseupHandler, true);
    self.document.body.classList.add('ember-basic-dropdown-text-select-disabled');
  },

  addMandatoryHandlers() {
    if (this.get('isTouchDevice')) {
      // If the component opens on click there is no need of any of this, as the device will
      // take care tell apart faux clicks from scrolls.
      this.element.addEventListener('touchstart', () => {
        self.document.addEventListener('touchmove', this._touchMoveHandler);
      });
      this.element.addEventListener('touchend', (e) => this.send('handleTouchEnd', e));
    }
    this.element.addEventListener('mousedown', (e) => this.send('handleMouseDown', e));
    this.element.addEventListener('click', (e) => this.send('handleClick', e));
    this.element.addEventListener('keydown', (e) => this.send('handleKeyDown', e));
  },

  addOptionalHandlers() {
    let dropdown = this.get('dropdown');
    let onMouseEnter = this.get('onMouseEnter');
    if (onMouseEnter) {
      this.element.addEventListener('mouseenter', (e) => onMouseEnter(dropdown, e));
    }
    let onMouseLeave = this.get('onMouseLeave');
    if (onMouseLeave) {
      this.element.addEventListener('mouseleave', (e) => onMouseLeave(dropdown, e));
    }
    let onFocus = this.get('onFocus');
    if (onFocus) {
      this.element.addEventListener('focus', (e) => onFocus(dropdown, e));
    }
    let onBlur = this.get('onBlur');
    if (onBlur) {
      this.element.addEventListener('blur', (e) => onBlur(dropdown, e));
    }
    let onFocusIn = this.get('onFocusIn');
    if (onFocusIn) {
      this.element.addEventListener('focusin', (e) => onFocusIn(dropdown, e));
    }
    let onFocusOut = this.get('onFocusOut');
    if (onFocusOut) {
      this.element.addEventListener('focusout', (e) => onFocusOut(dropdown, e));
    }
  }
});
