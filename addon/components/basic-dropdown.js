import Component from 'ember-component';
import set from  'ember-metal/set';
import $ from 'jquery';
import layout from '../templates/components/basic-dropdown';
import { join } from 'ember-runloop';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

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

    instancesCounter++;

    let publicAPI = this.updateState({
      uniqueId: instancesCounter++,
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

    let viewportRight = scroll.left + self.window.innerWidth;

    if (horizontalPosition === 'auto') {
      let roomForRight = viewportRight - triggerLeft;

      if (roomForRight < dropdownWidth) {
        horizontalPosition = 'right';
      } else if (triggerLeft < dropdownWidth) {
        horizontalPosition = 'left';
      } else {
        horizontalPosition = this.previousHorizontalPosition || 'left';
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

    let style = { top: `${dropdownTop}px` };
    if (horizontalPosition === 'right') {
      style.right = `${viewportRight - (triggerWidth + triggerLeft)}px`;
    } else {
      style.left = `${triggerLeft}px`;
    }
    if (matchTriggerWidth) {
      style.width = `${dropdownWidth}px`;
    }
    this.applyReposition(trigger, dropdown, { horizontalPosition, verticalPosition, style });
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
  }
});
