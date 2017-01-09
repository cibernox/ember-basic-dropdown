import Ember from 'ember';
import Component from 'ember-component';
import set from  'ember-metal/set';
import $ from 'jquery';
import layout from '../templates/components/basic-dropdown';
import { join } from 'ember-runloop';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import { calculatePosition, calculateInPlacePosition } from '../utils/calculate-position';
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
  calculateInPlacePosition: fallbackIfUndefined(calculateInPlacePosition),
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

  didInsertElement() {
    // We cannot add these handlers to a dropdown container that does not exist
    if (this.get('tagName') !== '') {
      this.addOptionalHandlers();
    }
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

  willDestroy() {
    this._super(...arguments);
    let registerAPI = this.get('registerAPI');
    if (registerAPI) {
      registerAPI(null);
    }
  },

  // Actions
  actions: {
    handleFocus(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) {
        onFocus(this.get('publicAPI'), e);
      }
    },

    // Mouseenter/leave, Focusin/out are useful at the dropdown component level (rather than trigger or content)
    // as we typically want mouseleave/focusout events fired when the related target is outside
    // *both* the trigger and content
    handleMouseEnter: Ember.K,
    handleMouseLeave: Ember.K,
    handleFocusIn: Ember.K,
    handleFocusOut: Ember.K
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

    let calculatePosition = this.get(this.get('renderInPlace') ? 'calculateInPlacePosition' : 'calculatePosition');
    let options = this.getProperties('horizontalPosition', 'verticalPosition', 'matchTriggerWidth', 'previousHorizontalPosition', 'previousVerticalPosition');
    options.dropdown = this;
    let positionData = calculatePosition(triggerElement, dropdownElement, options);
    return this.applyReposition(triggerElement, dropdownElement, positionData);
  },

  applyReposition(trigger, dropdown, positions) {
    let changes = {
      hPosition: positions.horizontalPosition,
      vPosition: positions.verticalPosition
    };
    if (positions.style) {
      changes.top = `${positions.style.top}px`;
      // The component can be aligned from the right or from the left, but not from both.
      if (positions.style.left !== undefined) {
        changes.left = `${positions.style.left}px`;
        changes.right = null;
      } else if (positions.style.right !== undefined) {
        changes.right = `${positions.style.right}px`;
        changes.left = null;
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
    return changes;
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

  // For dropdowns utilizing mouseenter/mouseleave and focusin/focusout, it often makes sense to track the
  // events for the dropdown as a whole (e.g. when hovering over dropdown.content's element, we may not wish to
  // call dropdown.trigger's mouseleave, potentially closing the dropdown)
  addOptionalHandlers() {
    let dropdown = this.get('publicAPI');

    let onMouseEnter = this.get('onMouseEnter');
    if (onMouseEnter) {
      this.element.addEventListener('mouseenter', (e) => onMouseEnter(dropdown, e));
    }
    let onMouseLeave = this.get('onMouseLeave');
    if (onMouseLeave) {
      this.element.addEventListener('mouseleave', (e) => onMouseLeave(dropdown, e));
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
