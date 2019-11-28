import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { guidFor } from '@ember/object/internals';
import { getOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';
import { assert } from '@ember/debug';
import calculatePosition, { CalculatePosition, CalculatePositionResult } from '../utils/calculate-position';
// @ts-ignore
import requirejs from 'require';
import { schedule } from '@ember/runloop';
declare const FastBoot: any
// const ignoredStyleAttrs = [
//   'top',
//   'left',
//   'right',
//   'width',
//   'height'
// ];

const UNINITIALIZED = {};

interface Args {
  initiallyOpened?: boolean
  renderInPlace?: boolean
  verticalPosition?: string
  horizontalPosition?: string
  destination?: string
  disabled?: boolean
  dropdownId?: string
  matchTriggerWidth?: boolean
  onInit?: Function
  registerAPI?: Function
  onOpen?: Function
  onClose?: Function
  calculatePosition?: CalculatePosition
}

interface RepositionChanges {
  hPosition: string | null
  vPosition: string | null
  otherStyles: object
  top?: string | null
  left?: string | null
  right?: string | null
  width?: string | null
  height?: string | null
}

export default class BasicDropdown extends Component<Args> {
  @tracked hPosition: string | null = null
  @tracked vPosition: string | null = null
  @tracked top?: string | null = null
  @tracked left?: string | null = null
  @tracked right?: string | null = null
  @tracked width?: string | null = null
  @tracked height?: string | null = null
  @tracked otherStyles: object = {}
  @tracked isOpen = this.args.initiallyOpened || false
  private previousVerticalPosition?: string
  private previousHorizontalPosition?: string
  private destinationElement?: HTMLElement
  renderInPlace = this.args.renderInPlace !== undefined ? this.args.renderInPlace : false;
  verticalPosition = this.args.verticalPosition || 'auto'; // above | below
  horizontalPosition = this.args.horizontalPosition || 'auto'; // auto-right | right | center | left
  _uid = guidFor(this)
  dropdownId: string = this.args.dropdownId || `ember-basic-dropdown-content-${this._uid}`;
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
  constructor(owner: unknown, args: Args) {
    super(owner, args);
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
  }

  willDestroy() {
    super.willDestroy();
    if (this.args.registerAPI) {
      this.args.registerAPI(null);
    }
  }

  // Methods
  open(e?: Event) {
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

  close(e?: Event, skipFocus?: boolean) {
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
    this.hPosition = this.vPosition = null;
    this.top = this.left = this.right = this.width = this.height = undefined;
    this.previousVerticalPosition = this.previousHorizontalPosition = undefined;
    this.isOpen = false;
    this.args.registerAPI && this.args.registerAPI(this.publicAPI);
    if (skipFocus) {
      return;
    }
    let trigger = document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`) as HTMLElement;
    if (trigger && trigger.tabIndex > -1) {
      trigger.focus();
    }
  }

  toggle(e?: Event) {
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
    let triggerElement = document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`) as HTMLElement;
    if (!dropdownElement || !triggerElement) {
      return;
    }

    this.destinationElement = this.destinationElement || document.getElementById(this.destination) as HTMLElement;
    let { horizontalPosition, verticalPosition, previousHorizontalPosition, previousVerticalPosition } = this;
    let { renderInPlace = false, matchTriggerWidth = false } = this.args;
    let calculatePositionFn = this.args.calculatePosition || calculatePosition
    let positionData = calculatePositionFn(
      triggerElement,
      dropdownElement,
      this.destinationElement,
      {
        horizontalPosition,
        verticalPosition,
        previousHorizontalPosition,
        previousVerticalPosition,
        renderInPlace,
        matchTriggerWidth,
        dropdown: this
      }
    );
    return this.applyReposition(triggerElement, dropdownElement, positionData);
  }

  applyReposition(_trigger: HTMLElement, dropdown: HTMLElement, positions: CalculatePositionResult) {
    let changes: RepositionChanges = {
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
    this.top = changes.top;
    this.left = changes.left;
    this.right = changes.right;
    this.width = changes.width;
    this.height = changes.height;
    this.otherStyles = changes.otherStyles;
    this.previousHorizontalPosition = positions.horizontalPosition;
    this.previousVerticalPosition = positions.verticalPosition;
    return changes;
  }

  _getDestinationId() {
    let config = getOwner(this).resolveRegistration('config:environment');
    let id;
    if (config.environment === 'test' && (typeof FastBoot === 'undefined')) {
      if (DEBUG) {
        if (requirejs.has('@ember/test-helpers/dom/get-root-element')) {
          try {
            id = requirejs('@ember/test-helpers/dom/get-root-element').default().id;
          } catch(ex) {
            // no op
          }
        }
        if (!id) {
          let rootView = document.querySelector('#ember-testing > .ember-view');
          id = rootView ? rootView.id : undefined;
        }
        return id;
      }
    }
    id = config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
    if (DEBUG && typeof FastBoot === 'undefined' && !this.renderInPlace) {
      assert(`You're trying to attach the content of a dropdown to an node with ID ${id}, but there is no node with that ID in the document. This can happen when your Ember app is not in control of the index.html page. Check https://ember-power-select.com/docs/troubleshooting for more information`, document.getElementById(id));
    }
    return id;
  }
}
