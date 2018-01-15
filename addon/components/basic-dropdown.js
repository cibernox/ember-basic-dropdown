import Component from '@ember/component';
import { set } from '@ember/object';
import { join } from '@ember/runloop';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { getOwner } from '@ember/application';
import layout from '../templates/components/basic-dropdown';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import calculatePosition from '../utils/calculate-position';

/**
 * If it is a number, it is considered to be in px. If it is a
 * a String, it is returned as it is.
 *
 * @function toCSSValue
 * @param {Number|String} value value for a CSS property
 * @returns {String}
 * @private
 */
function toCSSValue(value) {
  if (typeof value === 'number') {
    return `${value}px`;
  } else {
    return value;
  }
}

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
  horizontalPosition: fallbackIfUndefined('auto'), // auto-right | right | center | left
  matchTriggerWidth: fallbackIfUndefined(false),
  triggerComponent: fallbackIfUndefined('basic-dropdown/trigger'),
  contentComponent: fallbackIfUndefined('basic-dropdown/content'),
  calculatePosition: fallbackIfUndefined(calculatePosition),
  classNames: ['ember-basic-dropdown'],
  top: null,
  left: null,
  right: null,
  width: null,
  height: null,

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

    this.dropdownId = this.dropdownId || `ember-basic-dropdown-content-${publicAPI.uniqueId}`;
    let onInit = this.get('onInit');
    if (onInit) {
      onInit(publicAPI);
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

  // CPs
  destination: computed({
    get() {
      return this._getDestinationId();
    },
    set(_, v) {
      return v === undefined ? this._getDestinationId() : v;
    }
  }),

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
    if (this.get('isDestroyed')) {
      return;
    }
    this.setProperties({ hPosition: null, vPosition: null, top: null, left: null, right: null, width: null, height: null });
    this.previousVerticalPosition = this.previousHorizontalPosition = null;
    this.updateState({ isOpen: false });
    if (skipFocus) {
      return;
    }
    let trigger = document.querySelector(`[data-ebd-id=${publicAPI.uniqueId}-trigger]`);
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
    let publicAPI = this.get('publicAPI');
    if (!publicAPI.isOpen) {
      return;
    }
    let dropdownElement = self.document.getElementById(this.dropdownId);
    let triggerElement = document.querySelector(`[data-ebd-id=${publicAPI.uniqueId}-trigger]`);
    if (!dropdownElement || !triggerElement) {
      return;
    }

    this.destinationElement = this.destinationElement || self.document.getElementById(this.get('destination'));
    let options = this.getProperties('horizontalPosition', 'verticalPosition', 'matchTriggerWidth', 'previousHorizontalPosition', 'previousVerticalPosition', 'renderInPlace');
    options.dropdown = this;
    let positionData = this.get('calculatePosition')(triggerElement, dropdownElement, this.destinationElement, options);
    return this.applyReposition(triggerElement, dropdownElement, positionData);
  },

  applyReposition(trigger, dropdown, positions) {
    let changes = {
      hPosition: positions.horizontalPosition,
      vPosition: positions.verticalPosition
    };
    if (positions.style) {
      if (positions.style.top !== undefined) {
        changes.top = toCSSValue(positions.style.top);
      }
      // The component can be aligned from the right or from the left, but not from both.
      if (positions.style.left !== undefined) {
        changes.left = toCSSValue(positions.style.left);
        changes.right = null;
        // Since we set the first run manually we may need to unset the `right` property.
        if (positions.style.right !== undefined) {
          positions.style.right = toCSSValue('auto');
        }
      } else if (positions.style.right !== undefined) {
        changes.right = toCSSValue(positions.style.right);
        changes.left = toCSSValue('auto');
      }
      if (positions.style.width !== undefined) {
        changes.width = toCSSValue(positions.style.width);
      }
      if (positions.style.height !== undefined) {
        changes.height = toCSSValue(positions.style.height);
      }
      if (this.get('top') === null) {
        // Bypass Ember on the first reposition only to avoid flickering.
        let cssRules = [];
        for (let prop in positions.style) {
          if (positions.style[prop] !== undefined) {
            cssRules.push(`${prop}: ${toCSSValue(positions.style[prop])}`);
          }
        }
        dropdown.setAttribute('style', cssRules.join(';'));
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

  _getDestinationId() {
    let config = getOwner(this).resolveRegistration('config:environment');
    if (config.environment === 'test') {
      return document.querySelector('#ember-testing > .ember-view').id;
    }
    return config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
  }
});
