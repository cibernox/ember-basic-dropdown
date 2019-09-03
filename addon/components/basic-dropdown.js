import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { guidFor } from '@ember/object/internals';
import { getOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';
import { schedule } from '@ember/runloop';
import calculatePosition from '../utils/calculate-position';
import requirejs from 'require';

const ignoredStyleAttrs = [
  'top',
  'left',
  'right',
  'width',
  'height'
];

const UNINITIALIZED = {};

export default class BasicDropdown extends Component {
  @tracked hPosition
  @tracked vPosition
  @tracked otherStyles = {}
  @tracked top = null
  @tracked left = null
  @tracked right = null
  @tracked width = null
  @tracked height = null
  @tracked isOpen = this.args.initiallyOpened || false
  renderInPlace = this.args.renderInPlace !== undefined ? this.args.renderInPlace : false;
  verticalPosition = this.args.verticalPosition || 'auto'; // above | below
  horizontalPosition = this.args.horizontalPosition || 'auto'; // auto-right | right | center | left
  _uid = guidFor(this)
  dropdownId = this.dropdownId || `ember-basic-dropdown-content-${this._uid}`;
  _previousDisabled = UNINITIALIZED
  _actions = {
    open: this.open.bind(this),
    close: this.close.bind(this),
    toggle: this.toggle.bind(this),
    reposition: this.reposition.bind(this)
  }

  get destination() {
    return this.args.destination || this._getDestinationId();
  }

  get disabled() {
    let newVal = this.args.disabled || false;
    if (this._previousDisabled !== UNINITIALIZED && this._previousDisabled !== newVal) {
      schedule('actions', () => {
        if (newVal && this.publicAPI.isOpen) {
          this.isOpen = false;
        }
        this.args.registerAPI && this.args.registerAPI(this.publicAPI);
      });
    }
    this._previousDisabled = newVal;
    return newVal
  }

  get publicAPI() {
    return {
      uniqueId: this._uid,
      isOpen: this.isOpen,
      disabled: this.disabled,
      actions: this._actions
    }
  }

  // Lifecycle hooks
  constructor() {
    super(...arguments);
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.args.registerAPI) {
      this.args.registerAPI(null);
    }
  }

  // Methods
  open(e) {
    if (this.isDestroyed) {
      return;
    }
    if (this.publicAPI.disabled || this.publicAPI.isOpen) {
      return;
    }
    if (this.args.onOpen && this.args.onOpen(this.publicAPI, e) === false) {
      return;
    }
    this.isOpen = true;
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
  }

  close(e, skipFocus) {
    if (this.isDestroyed) {
      return;
    }
    if (this.publicAPI.disabled || !this.publicAPI.isOpen) {
      return;
    }
    if (this.args.onClose && this.args.onClose(this.publicAPI, e) === false) {
      return;
    }
    if (this.isDestroyed) {
      return; // To check that the `onClose` didn't destroy the dropdown
    }
    this.hPosition = this.vPosition = this.top = this.left = this.right = this.width = this.height = null;
    this.previousVerticalPosition = this.previousHorizontalPosition = null;
    this.isOpen = false;
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
    if (skipFocus) {
      return;
    }
    let trigger = document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`);
    if (trigger && trigger.tabIndex > -1) {
      trigger.focus();
    }
  }

  toggle(e) {
    if (this.publicAPI.isOpen) {
      this.close(e);
    } else {
      this.open(e);
    }
  }

  reposition() {
    if (!this.publicAPI.isOpen) {
      return;
    }
    let dropdownElement = document.getElementById(this.dropdownId);
    let triggerElement = document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`);
    if (!dropdownElement || !triggerElement) {
      return;
    }

    this.destinationElement = this.destinationElement || document.getElementById(this.destination);
    let { horizontalPosition, verticalPosition, previousHorizontalPosition, previousVerticalPosition } = this;
    let { renderInPlace = false, matchTriggerWidth = true } = this.args;
    let positionData = (this.args.calculatePosition || calculatePosition)(triggerElement, dropdownElement, this.destinationElement, {
      horizontalPosition, verticalPosition, previousHorizontalPosition, previousVerticalPosition,
      renderInPlace,matchTriggerWidth,
      dropdown: this
    });
    return this.applyReposition(triggerElement, dropdownElement, positionData);
  }

  applyReposition(trigger, dropdown, positions) {
    let changes = {
      hPosition: positions.horizontalPosition,
      vPosition: positions.verticalPosition,
      otherStyles: this.otherStyles
    };

    if (positions.style) {
      if (positions.style.top !== undefined) {
        changes.top = `${positions.style.top}px`;
      }
      // The component can be aligned from the right or from the left, but not from both.
      if (positions.style.left !== undefined) {
        changes.left = `${positions.style.left}px`;
        changes.right = null;
        // Since we set the first run manually we may need to unset the `right` property.
        if (positions.style.right !== undefined) {
          positions.style.right = undefined;
        }
      } else if (positions.style.right !== undefined) {
        changes.right = `${positions.style.right}px`;
        changes.left = null;
      }
      if (positions.style.width !== undefined) {
        changes.width = `${positions.style.width}px`;
      }
      if (positions.style.height !== undefined) {
        changes.height = `${positions.style.height}px`;
      }

      Object.keys(positions.style).forEach((attr) => {
        if (ignoredStyleAttrs.indexOf(attr) === -1) {
          if (changes[attr] !== positions.style[attr]) {
            changes.otherStyles[attr] = positions.style[attr];
          }
        }
      });

      if (this.top === null) {
        // Bypass Ember on the first reposition only to avoid flickering.
        let cssRules = [];
        for (let prop in positions.style) {
          if (positions.style[prop] !== undefined) {
            if (typeof positions.style[prop] === 'number') {
              cssRules.push(`${prop}: ${positions.style[prop]}px`)
            } else {
              cssRules.push(`${prop}: ${positions.style[prop]}`)
            }
          }
        }
        dropdown.setAttribute('style', cssRules.join(';'));
      }
    }
    for (let key in changes) {
      this[key] = changes[key]
    }
    this.previousHorizontalPosition = positions.horizontalPosition;
    this.previousVerticalPosition = positions.verticalPosition;
    return changes;
  }

  _getDestinationId() {
    let config = getOwner(this).resolveRegistration('config:environment');
    if (config.environment === 'test' && (typeof FastBoot === 'undefined')) {
      if (DEBUG) {
        let id, rootView;
        if (requirejs.has('@ember/test-helpers/dom/get-root-element')) {
          try {
            id = requirejs('@ember/test-helpers/dom/get-root-element').default().id;
          } catch(ex) {
            // no op
          }
        }
        if (!id) {
          rootView = document.querySelector('#ember-testing > .ember-view');
          id = rootView ? rootView.id : undefined;
        }
        return id;
      }
    }
    return config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
  }
}
