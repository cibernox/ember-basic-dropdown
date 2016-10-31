import Ember from 'ember';
import Component from 'ember-component';
import set from  'ember-metal/set';
import $ from 'jquery';
import layout from '../templates/components/basic-dropdown';
import { join } from 'ember-runloop';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import { calculatePosition } from '../utils/calculate-position';
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
  calculatePosition: fallbackIfUndefined(calculatePosition),
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
      changes.top = `${positions.style.top}px`;
      if (positions.style.left !== undefined) {
        changes.left = `${positions.style.left}px`;
      }
      if (positions.style.right !== undefined) {
        changes.right = `${positions.style.right}px`;
      }
      if (positions.style.width !== undefined) {
        changes.width = `${positions.style.width}px`;
      }
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
