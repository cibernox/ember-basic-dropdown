import layout from '../../templates/components/basic-dropdown/trigger';
import $ from 'jquery';
import Component from 'ember-component';
import computed from 'ember-computed';

const isTouchDevice = (!!self.window && 'ontouchstart' in self.window);

export default Component.extend({
  layout,
  isTouchDevice,
  classNames: ['ember-basic-dropdown-trigger'],
  role: 'button',
  tabindex: 0,
  'aria-haspopup': true,
  classNameBindings: ['horizontalPositionClass', 'verticalPositionClass', 'inPlaceClass'],
  attributeBindings: [
    'role',
    'tabIndex:tabindex',
    'dropdownId:aria-controls',
    'disabled:aria-disabled',
    'ariaLabel:aria-label',
    'ariaLabelledBy:aria-labelledby',
    'ariaDescribedBy:aria-describedby',
    'ariaRequired:aria-required',
    'ariaInvalid:aria-invalid',
    'aria-haspopup',
    'dropdown.isOpen:aria-expanded',
    'dropdown.isOpen:aria-pressed'
  ],

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);
    this.addMandatoryHandlers();
    this.addOptionalHandlers();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.getAttr('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  },

  // CPs
  tabIndex: computed('disabled', 'tabIndex', function() {
    return this.get('disabled') ? -1 : (this.get('tabindex') || 0);
  }),

  horizontalPositionClass: computed('hPosition', function() {
    let hPosition = this.getAttr('hPosition');
    if (hPosition) {
      return `ember-basic-dropdown-trigger--${hPosition}`;
    }
  }),

  verticalPositionClass: computed('vPosition', function() {
    let vPosition = this.getAttr('vPosition');
    if (vPosition) {
      return `ember-basic-dropdown-trigger--${vPosition}`;
    }
  }),

  inPlaceClass: computed('renderInPlace', function() {
    if (this.getAttr('renderInPlace')) {
      return 'ember-basic-dropdown-trigger--in-place';
    }
  }),

  // Actions
  actions: {
    handleMousedown(e) {
      if (e && e.defaultPrevented || this.getAttr('disabled')) {
        return;
      }
      this.stopTextSelectionUntilMouseup();
      this.getAttr('dropdown').actions.toggle(e);
    },

    handleTouchEnd(e) {
      if (e && e.defaultPrevented || this.getAttr('disabled')) {
        return;
      }
      if (!this.hasMoved) {
        this.getAttr('dropdown').actions.toggle(e);
      }
      this.hasMoved = false;
    },

    handleKeydown(e) {
      if (this.getAttr('disabled')) {
        return;
      }
      let onKeydown = this.getAttr('onKeydown');
      let dropdown = this.getAttr('dropdown');
      if (onKeydown && onKeydown(dropdown, e) === false) {
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
    this.getAttr('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  },

  stopTextSelectionUntilMouseup() {
    let $appRoot = $(this.get('appRoot'));
    let mouseupHandler = function() {
      $appRoot[0].removeEventListener('mouseup', mouseupHandler, true);
      $appRoot.removeClass('ember-basic-dropdown-text-select-disabled');
    };
    $appRoot[0].addEventListener('mouseup', mouseupHandler, true);
    $appRoot.addClass('ember-basic-dropdown-text-select-disabled');
  },

  addMandatoryHandlers() {
    if (this.get('isTouchDevice')) {
      this.element.addEventListener('touchstart', () => {
        this.getAttr('appRoot').addEventListener('touchmove', this._touchMoveHandler);
      });
      this.element.addEventListener('touchend', (e) => {
        this.send('handleTouchEnd', e);
        e.preventDefault(); // Prevent synthetic click
      });
    }
    this.element.addEventListener('mousedown', (e) => this.send('handleMousedown', e));
    this.element.addEventListener('keydown', (e) => this.send('handleKeydown', e));
  },

  addOptionalHandlers() {
    let dropdown = this.getAttr('dropdown');
    let onMouseEnter = this.getAttr('onMouseEnter');
    if (onMouseEnter) {
      this.element.addEventListener('mouseenter', (e) => onMouseEnter(dropdown, e));
    }
    let onMouseLeave = this.getAttr('onMouseLeave');
    if (onMouseLeave) {
      this.element.addEventListener('mouseleave', (e) => onMouseLeave(dropdown, e));
    }
    let onFocus = this.getAttr('onFocus');
    if (onFocus) {
      this.element.addEventListener('focus', (e) => onFocus(dropdown, e));
    }
    let onFocusIn = this.getAttr('onFocusIn');
    if (onFocusIn) {
      this.element.addEventListener('focusin', (e) => onFocusIn(dropdown, e));
    }
    let onFocusOut = this.getAttr('onFocusOut');
    if (onFocusOut) {
      this.element.addEventListener('focusout', (e) => onFocusOut(dropdown, e));
    }
  }
});
