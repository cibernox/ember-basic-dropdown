import Ember from 'ember';
import Component from 'ember-component';
import computed from 'ember-computed';
import set from  'ember-metal/set';
import $ from 'jquery';
import layout from '../templates/components/basic-dropdown';
import { scheduleOnce, cancel } from 'ember-runloop';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
const { testing, getOwner } = Ember;
let instancesCounter = 0;

export default Component.extend({
  layout,
  tagName: '',
  renderInPlace: fallbackIfUndefined(false),
  verticalPosition: fallbackIfUndefined('auto'), // above | below
  horizontalPosition: fallbackIfUndefined('auto'), // right | center | left
  matchTriggerWidth: fallbackIfUndefined(false),
  triggerComponent: fallbackIfUndefined('basic-dropdown/trigger'),
  contentComponent: fallbackIfUndefined('basic-dropdown/content'),
  classNames: ['ember-basic-dropdown'],

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    if (this.get('renderInPlace') && this.get('tagName') === '') {
      this.set('tagName', 'div');
    }
    instancesCounter++;

    this.publicAPI = {
      _id: instancesCounter++,
      isOpen: this.get('initiallyOpened') || false,
      disabled: this.get('disabled') || false,
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: this.reposition.bind(this)
      }
    };

    this.triggerId = this.triggerId || `ember-basic-dropdown-trigger-${this.publicAPI._id}`;
    this.dropdownId = this.dropdownId || `ember-basic-dropdown-content-${this.publicAPI._id}`;

    let registerAPI = this.get('registerAPI');
    if (registerAPI) {
      registerAPI(this.publicAPI);
    }
  },

  willDestroy() {
    this._super(...arguments);
    cancel(this.updatePositionsTimer);
  },

  didUpdateAttrs() {
    this._super(...arguments);
    let disabled = this.get('disabled');
    if (disabled !== this.publicAPI.disabled) {
      set(this.publicAPI, 'disabled', disabled);
    }
  },

  // CPs
  appRoot: computed(function() {
    let rootSelector = testing ? '#ember-testing' : getOwner(this).lookup('application:main').rootElement;
    return self.document.querySelector(rootSelector);
  }),

  // Actions
  actions: {
    handleFocus(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) {
        onFocus(this.publicAPI, e);
      }
    }
  },

  // Methods
  open(e) {
    if (this.publicAPI.disabled || this.publicAPI.isOpen) {
      return;
    }
    let onOpen = this.get('onOpen');
    if (onOpen && onOpen(this.publicAPI, e) === false) {
      return;
    }
    set(this.publicAPI, 'isOpen', true);
  },

  close(e, skipFocus) {
    if (this.publicAPI.disabled || !this.publicAPI.isOpen) {
      return;
    }
    let onClose = this.get('onClose');
    if (onClose && onClose(this.publicAPI, e) === false) {
      return;
    }
    set(this.publicAPI, 'isOpen', false);
    this.setProperties({ hPosition: null, vPosition: null });
    this.previousVerticalPosition = this.previousHorizontalPosition = null;
    if (skipFocus) {
      return;
    }
    let trigger = document.getElementById(this.triggerId);
    if (trigger && trigger.tabIndex > -1) {
      trigger.focus();
    }
  },

  toggle(e) {
    if (this.publicAPI.isOpen) {
      this.close(e);
    } else {
      this.open(e);
    }
  },

  reposition() {
    if (!this.publicAPI.isOpen) {
      return;
    }
    let dropdownElement = self.document.getElementById(this.dropdownId);
    let triggerElement = self.document.getElementById(this.triggerId);
    if (!dropdownElement || !triggerElement) {
      return;
    }

    let renderInPlace = this.get('renderInPlace');
    if (renderInPlace) {
      this.performNaiveReposition(triggerElement, dropdownElement);
    } else {
      this.performFullReposition(triggerElement, dropdownElement);
    }
  },

  performNaiveReposition(trigger, dropdown) {
    let horizontalPosition = this.get('horizontalPosition');
    if (horizontalPosition === 'auto') {
      let triggerRect = trigger.getBoundingClientRect();
      let dropdownRect = dropdown.getBoundingClientRect();
      let viewportRight = $(self.window).scrollLeft + self.window.innerWidth;
      horizontalPosition = triggerRect.left + dropdownRect.width > viewportRight ? 'right' : 'left';
    }
    this.applyReposition(trigger, dropdown, { horizontalPosition });
  },

  performFullReposition(trigger, dropdown) {
    let {
      horizontalPosition, verticalPosition, matchTriggerWidth
    } = this.getProperties('horizontalPosition', 'verticalPosition', 'matchTriggerWidth');
    let $window = $(self.window);
    let scroll = { left: $window.scrollLeft(), top: $window.scrollTop() };
    let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
    let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
    let dropdownLeft = triggerLeft;
    let dropdownTop;
    dropdownWidth = matchTriggerWidth ? triggerWidth : dropdownWidth;

    if (horizontalPosition === 'auto') {
      let viewportRight = scroll.left + self.window.innerWidth;
      let roomForRight = viewportRight - triggerLeft;
      let roomForLeft = triggerLeft;
      horizontalPosition = roomForRight > roomForLeft ? 'left' : 'right';
    } else if (horizontalPosition === 'right') {
      dropdownLeft = triggerLeft + triggerWidth - dropdownWidth;
    } else if (horizontalPosition === 'center') {
      dropdownLeft = triggerLeft + (triggerWidth - dropdownWidth) / 2;
    }

    let triggerTopWithScroll = triggerTop + scroll.top;
    if (verticalPosition === 'above') {
      dropdownTop = triggerTopWithScroll - dropdownHeight;
    } else if (verticalPosition === 'below') {
      dropdownTop = triggerTopWithScroll + triggerHeight;
    } else {
      let viewportBottom = scroll.top + self.window.innerHeight;
      let enoughRoomBelow = triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
      let enoughRoomAbove = triggerTop > dropdownHeight;

      if (this.previousVerticalPosition === 'below' && !enoughRoomBelow && enoughRoomAbove) {
        verticalPosition = 'above';
      } else if (this.previousVerticalPosition === 'above' && !enoughRoomAbove && enoughRoomBelow) {
        verticalPosition = 'below';
      } else if (!this.previousVerticalPosition) {
        verticalPosition = enoughRoomBelow ? 'below' : 'above';
      } else {
        verticalPosition = this.previousVerticalPosition;
      }
      dropdownTop = triggerTopWithScroll + (verticalPosition === 'below' ? triggerHeight : -dropdownHeight);
    }

    let style = { top: `${dropdownTop}px`, left: `${dropdownLeft}px` };
    if (matchTriggerWidth) {
      style.width = `${dropdownWidth}px`;
    }
    this.applyReposition(trigger, dropdown, { horizontalPosition, verticalPosition, style });
  },

  applyReposition(trigger, dropdown, positions) {
    this.updatePositionsTimer = scheduleOnce('actions', this, this.updatePositions, positions);
    if (positions.style) {
      Object.keys(positions.style).forEach((key) => dropdown.style[key] = positions.style[key]);
    }
  },

  updatePositions(positions) {
    this.setProperties({ hPosition: positions.horizontalPosition, vPosition: positions.verticalPosition });
    this.previousHorizontalPosition = positions.horizontalPosition;
    this.previousVerticalPosition = positions.verticalPosition;
  }
});
