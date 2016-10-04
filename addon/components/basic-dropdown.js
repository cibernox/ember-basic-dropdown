import Ember from 'ember';
import Component from 'ember-component';
import set from  'ember-metal/set';
import $ from 'jquery';
import layout from '../templates/components/basic-dropdown';
import { join } from 'ember-runloop';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
const { guidFor } = Ember;

const assign = Object.assign || function EmberAssign(original, ...args) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (!arg) {
      continue;
    }
    let updates = Object.keys(arg);

    for (let i = 0; i < updates.length; i++) {
      let prop = updates[i];
      original[prop] = arg[prop];
    }
  }

  return original;
};

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
  top: null,
  left: null,
  right: null,
  width: null,

  // Lifecycle hooks
  init() {
    if (this.get('renderInPlace') && this.get('tagName') === '') {
      this.set('tagName', 'div');
    }
    this._super(...arguments);
    this.set('publicAPI', {});

    let publicAPI = this.updateState({
      uniqueId: guidFor(this),
      isOpen: this.get('initiallyOpened') || false,
      disabled: this.get('disabled') || false,
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: this.reposition.bind(this)
      }
    });

    this.triggerId = this.triggerId || `ember-basic-dropdown-trigger-${publicAPI.uniqueId}`;
    this.dropdownId = this.dropdownId || `ember-basic-dropdown-content-${publicAPI.uniqueId}`;
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let oldDisabled = !!this._oldDisabled;
    let newDisabled = !!this.get('disabled');
    this._oldDisabled = newDisabled;
    if (newDisabled && !oldDisabled) {
      join(this, this.disable);
    } else if (!newDisabled && oldDisabled) {
      join(this, this.enable);
    }
  },

  // Actions
  actions: {
    handleFocus(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) {
        onFocus(this.get('publicAPI'), e);
      }
    }
  },

  // Methods
  open(e) {
    if (this.get('isDestroyed')) {
      return;
    }
    let publicAPI = this.get('publicAPI');
    if (publicAPI.disabled || publicAPI.isOpen) {
      return;
    }
    let onOpen = this.get('onOpen');
    if (onOpen && onOpen(publicAPI, e) === false) {
      return;
    }
    this.updateState({ isOpen: true });
  },

  close(e, skipFocus) {
    if (this.get('isDestroyed')) {
      return;
    }
    let publicAPI = this.get('publicAPI');
    if (publicAPI.disabled || !publicAPI.isOpen) {
      return;
    }
    let onClose = this.get('onClose');
    if (onClose && onClose(publicAPI, e) === false) {
      return;
    }
    this.setProperties({ hPosition: null, vPosition: null, top: null, left: null, right: null, width: null });
    this.previousVerticalPosition = this.previousHorizontalPosition = null;
    this.updateState({ isOpen: false });
    if (skipFocus) {
      return;
    }
    let trigger = document.getElementById(this.triggerId);
    if (trigger && trigger.tabIndex > -1) {
      trigger.focus();
    }
  },

  toggle(e) {
    if (this.get('publicAPI.isOpen')) {
      this.close(e);
    } else {
      this.open(e);
    }
  },

  reposition() {
    if (!this.get('publicAPI.isOpen')) {
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
      let viewportRight = $(self.window).scrollLeft() + self.window.innerWidth;
      horizontalPosition = triggerRect.left + dropdownRect.width > viewportRight ? 'right' : 'left';
    }
    this.applyReposition(trigger, dropdown, { horizontalPosition });
  },

  performFullReposition(trigger, dropdown) {
    let options = this.getProperties('horizontalPosition', 'verticalPosition', 'matchTriggerWidth', 'previousHorizontalPosition', 'previousVerticalPosition');
    let positionData = this.get('calculatePosition')(trigger, dropdown, options);

    this.applyReposition(trigger, dropdown, positionData);
  },

  applyReposition(trigger, dropdown, positions) {
    let changes = {
      hPosition: positions.horizontalPosition,
      vPosition: positions.verticalPosition
    };
    if (positions.style) {
      changes.top = positions.style.top;
      changes.left = positions.style.left;
      changes.right = positions.style.right;
      changes.width = positions.style.width;
      if (this.get('top') === null) {
        // Bypass Ember on the first reposition only to avoid flickering.
        $(dropdown).css(positions.style);
      }
    }
    this.setProperties(changes);
    this.previousHorizontalPosition = positions.horizontalPosition;
    this.previousVerticalPosition = positions.verticalPosition;
  },

  disable() {
    let publicAPI = this.get('publicAPI');
    if (publicAPI.isOpen) {
      publicAPI.actions.close();
    }
    this.updateState({ disabled: true });
  },

  enable() {
    this.updateState({ disabled: false });
  },

  updateState(changes) {
    let newState = set(this, 'publicAPI', assign({}, this.get('publicAPI'), changes));
    let registerAPI = this.get('registerAPI');
    if (registerAPI) {
      registerAPI(newState);
    }
    return newState;
  },

  /**
    Function used to calculate the position of the content of the dropdown.
    @public
    @method calculatePosition
    @param {DomElement} trigger The trigger of the dropdown
    @param {DomElement} dropdown The content of the dropdown
    @param {Object} options The directives that define how the position is calculated
      - {String} horizantalPosition How the users want the dropdown to be positioned horizontally. Values: right | center | left
      - {String} verticalPosition How the users want the dropdown to be positioned vertically. Values: above | below
      - {Boolean} matchTriggerWidth If the user wants the width of the dropdown to match the width of the trigger
      - {String} previousHorizantalPosition How the dropdown was positioned for the last time. Same values than horizontalPosition, but can be null the first time.
      - {String} previousVerticalPosition How the dropdown was positioned for the last time. Same values than verticalPosition, but can be null the first time.
    @return {Object} How the component is going to be positioned.
      - {String} horizantalPosition The new horizontal position.
      - {String} verticalPosition The new vertical position.
      - {Object} CSS properties to be set on the dropdown. It supports `top`, `left`, `right` and `width`.
  */
  calculatePosition(trigger, dropdown, { previousHorizontalPosition, horizontalPosition, previousVerticalPosition, verticalPosition, matchTriggerWidth }) {
    let $window = $(self.window);
    let scroll = { left: $window.scrollLeft(), top: $window.scrollTop() };
    let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
    let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
    let dropdownLeft = triggerLeft;
    let dropdownTop;
    dropdownWidth = matchTriggerWidth ? triggerWidth : dropdownWidth;

    let viewportRight = scroll.left + self.window.innerWidth;

    if (horizontalPosition === 'auto') {
      let roomForRight = viewportRight - triggerLeft;

      if (roomForRight < dropdownWidth) {
        horizontalPosition = 'right';
      } else if (triggerLeft < dropdownWidth) {
        horizontalPosition = 'left';
      } else {
        horizontalPosition = previousHorizontalPosition || 'left';
      }

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

      if (previousVerticalPosition === 'below' && !enoughRoomBelow && enoughRoomAbove) {
        verticalPosition = 'above';
      } else if (previousVerticalPosition === 'above' && !enoughRoomAbove && enoughRoomBelow) {
        verticalPosition = 'below';
      } else if (!previousVerticalPosition) {
        verticalPosition = enoughRoomBelow ? 'below' : 'above';
      } else {
        verticalPosition = previousVerticalPosition;
      }
      dropdownTop = triggerTopWithScroll + (verticalPosition === 'below' ? triggerHeight : -dropdownHeight);
    }

    let style = { top: `${dropdownTop}px` };
    if (horizontalPosition === 'right') {
      style.right = `${viewportRight - (triggerWidth + triggerLeft)}px`;
    } else {
      style.left = `${dropdownLeft}px`;
    }
    if (matchTriggerWidth) {
      style.width = `${dropdownWidth}px`;
    }

    return { horizontalPosition, verticalPosition, style };
  }
});
