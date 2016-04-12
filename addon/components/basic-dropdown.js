/*jshint unused:false*/
import Ember from 'ember';
import layout from '../templates/components/basic-dropdown';
import getOwner from 'ember-getowner-polyfill';
import config from 'ember-get-config';

const { Component, run, computed } = Ember;
const defaultDestination = config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';

export default Component.extend({
  layout: layout,
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  disabled: false,
  renderInPlace: false,
  role: 'button',
  destination: null,
  triggerDisabled: false,
  initiallyOpened: false,
  hasFocusInside: false,
  verticalPosition: 'auto', // above | below
  horizontalPosition: 'auto', // right | left
  classNames: ['ember-basic-dropdown'],
  attributeBindings: ['dir'],
  classNameBindings: [
    'renderInPlace:ember-basic-dropdown--in-place',
    'hasFocusInside:ember-basic-dropdown--focus-inside',
    '_verticalPositionClass',
    '_horizontalPositionClass'
  ],

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
  },

  didInitAttrs() {
    this._super(...arguments);
    const registerActionsInParent = this.get('registerActionsInParent');
    if (registerActionsInParent) {
      registerActionsInParent(this.get('publicAPI'));
    }
  },

  didInsertElement() {
    this._super(...arguments);
    if (this.get('triggerDisabled')) { return; }
    let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    if (this.isTouchDevice) {
      trigger.addEventListener('touchstart', e => {
        this.get('appRoot').addEventListener('touchmove', this._touchMoveHandler);
      });
      trigger.addEventListener('touchend', e => {
        this.send('handleTouchEnd', e);
        e.preventDefault(); // Prevent synthetic click
      });
    }
    trigger.addEventListener('mousedown', e => this.send('handleMousedown', e));

    let onMouseEnter = this.get('onMouseEnter');
    if (onMouseEnter) {
      trigger.addEventListener('mouseenter', e => onMouseEnter(this.get('publicAPI'), e));
    }

    let onMouseLeave = this.get('onMouseLeave');
    if (onMouseLeave) {
      trigger.addEventListener('mouseleave', e => onMouseLeave(this.get('publicAPI'), e));
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  },

  // Events
  focusIn(e) {
    this.send('handleFocusIn', e);
  },

  focusOut(e) {
    this.send('handleFocusOut', e);
  },

  // CPs
  appRoot: computed(function() {
    const rootSelector = Ember.testing ? '#ember-testing' : getOwner(this).lookup('application:main').rootElement;
    return self.document.querySelector(rootSelector);
  }),

  wormholeDestination: computed('destination', function() {
    return Ember.testing ? 'ember-testing' : (this.get('destination') || defaultDestination);
  }),

  dropdownId: computed(function() {
    return `ember-basic-dropdown-content-${this.elementId}`;
  }),

  tabIndex: computed('disabled', function() {
    return !this.get('disabled') ? (this.get('tabindex') || '0') : null;
  }),

  publicAPI: computed(function() {
    return {
      isOpen: this.get('initiallyOpened'),
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: () => run.join(this, this._performReposition)
      }
    };
  }),

  // Actions
  actions: {
    handleTouchEnd(e) {
      if (e && e.defaultPrevented) { return; }
      if (!this.hasMoved) {
        this.toggle(e);
      }
      this.hasMoved = false;
    },

    handleMousedown(e) {
      if (e && e.defaultPrevented) { return; }
      this.stopTextSelectionUntilMouseup();
      this.toggle(e);
    },

    keydown(e) {
      this.handleKeydown(e);
    },

    handleFocus(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) { onFocus(this.get('publicAPI'), e); }
    },

    handleFocusIn() {
      this.set('hasFocusInside', true);
    },

    handleFocusOut() {
      this.set('hasFocusInside', false);
    }
  },

  // Methods
  toggle(e) {
    if (this.get('publicAPI.isOpen')) {
      this.close(e);
    } else {
      this.open(e);
    }
  },

  open(e) {
    if (this.get('disabled') || this.get('publicAPI.isOpen')) { return; }
    let onOpen = this.get('onOpen');
    if (onOpen && onOpen(this.get('publicAPI'), e) === false) { return; }
    this.set('publicAPI.isOpen', true);
  },

  close(e, skipFocus) {
    if (!this.get('publicAPI.isOpen')) { return; }
    let onClose = this.get('onClose');
    if (onClose && onClose(this.get('publicAPI'), e) === false) { return; }
    this.set('publicAPI.isOpen', false);
    this.setProperties({ _verticalPositionClass: null, _horizontalPositionClass: null });
    if (skipFocus) { return; }
    const trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    if (trigger.tabIndex > -1) {
      trigger.focus();
    }
  },

  handleKeydown(e) {
    if (this.get('disabled')) { return; }
    let onKeydown = this.get('onKeydown');
    if (onKeydown && onKeydown(this.get('publicAPI'), e) === false) {
      return;
    }
    if (e.keyCode === 13) {  // Enter
      this.toggle(e);
    } else if (e.keyCode === 27) {
      this.close(e);
    }
  },

  stopTextSelectionUntilMouseup() {
    if (self.FastBoot) { return; }
    let $appRoot = Ember.$(this.get('appRoot'));
    let mouseupHandler = function() {
      $appRoot[0].removeEventListener('mouseup', mouseupHandler, true);
      $appRoot.removeClass('ember-basic-dropdown-text-select-disabled');
    };
    $appRoot[0].addEventListener('mouseup', mouseupHandler, true);
    $appRoot.addClass('ember-basic-dropdown-text-select-disabled');
  },

  _performReposition() {
    if (!this.get('publicAPI.isOpen')) { return; }
    let dropdown = self.document.getElementById(this.get('dropdownId'));
    if (!dropdown) { return ;}
    let {
      triggerTop, triggerLeft, triggerWidth, triggerHeight, // trigger dimensions
      dropdownHeight, dropdownWidth,                        // dropdown dimensions
      scrollTop, scrollLeft                                 // scroll
    } = this._getPositionInfo(dropdown);
    let dropdownTop, dropdownLeft = triggerLeft;

    // hPosition
    let hPosition = this.get('horizontalPosition');
    if (this.get('renderInPlace')) {
      if (['right', 'left'].indexOf(hPosition) === -1) {
        let viewportRight = scrollLeft + self.window.innerWidth;
        hPosition = triggerLeft + dropdownWidth > viewportRight ? 'right' : 'left';
      }
      return this.set('_horizontalPositionClass', `ember-basic-dropdown--${hPosition}`);
    } else {
      if (['right', 'left'].indexOf(hPosition) === -1) {
        let viewportRight = scrollLeft + self.window.innerWidth;
        let roomForRight = viewportRight - triggerLeft;
        let roomForLeft = triggerLeft;
        hPosition = roomForRight > roomForLeft ? 'left' : 'right';
      }
      if (hPosition === 'right') { dropdownLeft = triggerLeft + triggerWidth - dropdownWidth; }
      this.set('_horizontalPositionClass', `ember-basic-dropdown--${hPosition}`);
    }

    // vPosition
    let vPosition = this.get('verticalPosition');
    let triggerTopWithScroll = triggerTop + scrollTop;
    if (vPosition === 'above') {
      dropdownTop = triggerTopWithScroll - dropdownHeight;
      this.set('_verticalPositionClass', 'ember-basic-dropdown--above');
    } else if (vPosition === 'below') {
      dropdownTop = triggerTopWithScroll + triggerHeight;
      this.set('_verticalPositionClass', 'ember-basic-dropdown--below');
    } else { // auto
      let viewportBottom = scrollTop + self.window.innerHeight;
      let enoughRoomBelow = triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
      let enoughRoomAbove = triggerTop > dropdownHeight;

      let verticalPositionClass = this.get('_verticalPositionClass');
      if (verticalPositionClass === 'ember-basic-dropdown--below' && !enoughRoomBelow && enoughRoomAbove) {
        this.set('_verticalPositionClass', 'ember-basic-dropdown--above');
      } else if (verticalPositionClass === 'ember-basic-dropdown--above' && !enoughRoomAbove && enoughRoomBelow) {
        this.set('_verticalPositionClass', 'ember-basic-dropdown--below');
      } else if (!verticalPositionClass) {
        this.set('_verticalPositionClass', enoughRoomBelow ? 'ember-basic-dropdown--below' : 'ember-basic-dropdown--above');
      }
      verticalPositionClass = this.get('_verticalPositionClass'); // It might have changed
      dropdownTop = triggerTopWithScroll + (verticalPositionClass === 'ember-basic-dropdown--below' ? triggerHeight : -dropdownHeight);
    }

    dropdown.style.width = `${dropdownWidth}px`;
    dropdown.style.top = `${dropdownTop}px`;
    dropdown.style.left = `${dropdownLeft}px`;
  },

  _getPositionInfo(dropdown) {
    let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
    let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
    let $window = Ember.$(self.window);
    let scrollLeft = $window.scrollLeft();
    let scrollTop = $window.scrollTop();
    if (this.get('matchTriggerWidth')) {
      dropdownWidth = triggerWidth;
    }
    return {
      triggerTop, triggerLeft, triggerWidth, triggerHeight,
      dropdownHeight, dropdownWidth,
      scrollLeft, scrollTop
    };
  },

  _touchMoveHandler(e) {
    this.hasMoved = true;
    this.get('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  }
});
