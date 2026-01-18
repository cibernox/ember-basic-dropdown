import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import calculatePosition from '../utils/calculate-position.js';
import { schedule } from '@ember/runloop';
import { hash } from '@ember/helper';
import BasicDropdownTrigger from './basic-dropdown-trigger.js';
import BasicDropdownContent from './basic-dropdown-content.js';
import { or } from 'ember-truth-helpers';
import { isTesting } from '@embroider/macros';
import { getConfig } from '../config.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i, n } from 'decorator-transforms/runtime-esm';

const UNINITIALIZED = {};
const IGNORED_STYLES = ['top', 'left', 'right', 'width', 'height'];
class BasicDropdown extends Component {
  static {
    g(this.prototype, "hPosition", [tracked], function () {
      return null;
    });
  }
  #hPosition = (i(this, "hPosition"), void 0);
  static {
    g(this.prototype, "vPosition", [tracked], function () {
      return null;
    });
  }
  #vPosition = (i(this, "vPosition"), void 0);
  static {
    g(this.prototype, "top", [tracked]);
  }
  #top = (i(this, "top"), void 0);
  static {
    g(this.prototype, "left", [tracked]);
  }
  #left = (i(this, "left"), void 0);
  static {
    g(this.prototype, "right", [tracked]);
  }
  #right = (i(this, "right"), void 0);
  static {
    g(this.prototype, "width", [tracked]);
  }
  #width = (i(this, "width"), void 0);
  static {
    g(this.prototype, "height", [tracked]);
  }
  #height = (i(this, "height"), void 0);
  static {
    g(this.prototype, "otherStyles", [tracked], function () {
      return {};
    });
  }
  #otherStyles = (i(this, "otherStyles"), void 0);
  static {
    g(this.prototype, "isOpen", [tracked], function () {
      return this.args.initiallyOpened || false;
    });
  }
  #isOpen = (i(this, "isOpen"), void 0);
  static {
    g(this.prototype, "renderInPlace", [tracked], function () {
      return this.args.renderInPlace !== undefined ? this.args.renderInPlace : false;
    });
  }
  #renderInPlace = (i(this, "renderInPlace"), void 0);
  previousVerticalPosition;
  previousHorizontalPosition;
  triggerElement = null;
  dropdownElement = null;
  _uid = guidFor(this);
  _dropdownId = `ember-basic-dropdown-content-${this._uid}`;
  _previousDisabled = UNINITIALIZED;
  _actions = {
    open: this.open.bind(this),
    close: this.close.bind(this),
    toggle: this.toggle.bind(this),
    reposition: this.reposition.bind(this),
    registerTriggerElement: this.registerTriggerElement.bind(this),
    registerDropdownElement: this.registerDropdownElement.bind(this),
    getTriggerElement: () => this.triggerElement
  };
  get horizontalPosition() {
    return this.args.horizontalPosition || 'auto'; // auto-right | right | center | left
  }
  get verticalPosition() {
    return this.args.verticalPosition || 'auto'; // above | below
  }
  get destination() {
    return this.args.destination || this._getDestinationId();
  }
  get destinationElement() {
    if (this.args.destinationElement) {
      return this.args.destinationElement;
    }
    const element = document.getElementById(this.destination);
    if (element) {
      return element;
    }
    if (this.triggerElement && this.triggerElement.getRootNode() instanceof ShadowRoot) {
      return this.triggerElement.getRootNode()?.querySelector(`#${this.destination}`);
    }
    return null;
  }
  get disabled() {
    const newVal = this.args.disabled || false;
    if (this._previousDisabled !== UNINITIALIZED && this._previousDisabled !== newVal) {
      // eslint-disable-next-line ember/no-runloop
      schedule('actions', () => {
        if (newVal && this.publicAPI.isOpen) {
          // eslint-disable-next-line ember/no-side-effects
          this.isOpen = false;
        }
        if (this.args.registerAPI) {
          this.args.registerAPI(this.publicAPI);
        }
      });
    }
    // eslint-disable-next-line ember/no-side-effects
    this._previousDisabled = newVal;
    return newVal;
  }
  get publicAPI() {
    return {
      uniqueId: this._uid,
      isOpen: this.isOpen,
      disabled: this.disabled,
      actions: this._actions
    };
  }
  // Lifecycle hooks
  constructor(owner, args) {
    super(owner, args);
    console.log('ember-basic-dropdown, isTesting() value is', isTesting());
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
    if (this.args.registerAPI) {
      this.args.registerAPI(this.publicAPI);
    }
  }
  willDestroy() {
    super.willDestroy();
    if (this.args.registerAPI) {
      this.args.registerAPI(null);
    }
  }
  // Actions
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
    if (this.args.registerAPI) {
      this.args.registerAPI(this.publicAPI);
    }
    const trigger = this._getTriggerElement();
    if (trigger) {
      const parent = trigger.parentElement;
      if (parent) {
        parent.setAttribute('aria-owns', this._dropdownId);
      }
    }
  }
  static {
    n(this.prototype, "open", [action]);
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
    this.hPosition = this.vPosition = null;
    this.top = this.left = this.right = this.width = this.height = undefined;
    this.previousVerticalPosition = this.previousHorizontalPosition = undefined;
    this.isOpen = false;
    if (this.args.registerAPI) {
      this.args.registerAPI(this.publicAPI);
    }
    const trigger = this._getTriggerElement();
    if (!trigger) {
      return;
    }
    const parent = trigger.parentElement;
    if (parent) {
      parent.removeAttribute('aria-owns');
    }
    if (skipFocus) {
      return;
    }
    if (trigger.tabIndex > -1) {
      trigger.focus();
    }
  }
  static {
    n(this.prototype, "close", [action]);
  }
  toggle(e) {
    if (this.publicAPI.isOpen) {
      this.close(e);
    } else {
      this.open(e);
    }
  }
  static {
    n(this.prototype, "toggle", [action]);
  }
  reposition() {
    if (!this.publicAPI.isOpen) {
      return;
    }
    const dropdownElement = this._getDropdownElement();
    const triggerElement = this._getTriggerElement();
    if (!dropdownElement || !triggerElement || !this.destinationElement) {
      return;
    }
    const {
      horizontalPosition,
      verticalPosition,
      previousHorizontalPosition,
      previousVerticalPosition
    } = this;
    const {
      renderInPlace = false,
      matchTriggerWidth = false
    } = this.args;
    const calculatePositionFn = this.args.calculatePosition || calculatePosition;
    const positionData = calculatePositionFn(triggerElement, dropdownElement, this.destinationElement, {
      horizontalPosition,
      verticalPosition,
      previousHorizontalPosition,
      previousVerticalPosition,
      renderInPlace,
      matchTriggerWidth
    });
    return this.applyReposition(triggerElement, dropdownElement, positionData);
  }
  static {
    n(this.prototype, "reposition", [action]);
  }
  registerTriggerElement(element) {
    this.triggerElement = element;
  }
  static {
    n(this.prototype, "registerTriggerElement", [action]);
  }
  registerDropdownElement(element) {
    this.dropdownElement = element;
  }
  static {
    n(this.prototype, "registerDropdownElement", [action]);
  }
  applyReposition(_trigger, dropdown, positions) {
    const changes = {
      hPosition: positions.horizontalPosition,
      vPosition: positions.verticalPosition,
      otherStyles: Object.assign({}, this.otherStyles)
    };
    if (positions.style) {
      if (positions.style.top !== undefined) {
        changes.top = `${positions.style.top}px`;
      }
      // The component can be aligned from the right or from the left, but not from both.
      if (positions.style.left !== undefined) {
        changes.left = `${positions.style.left}px`;
        changes.right = undefined;
        // Since we set the first run manually we may need to unset the `right` property.
        if (positions.style.right !== undefined) {
          positions.style.right = undefined;
        }
      } else if (positions.style.right !== undefined) {
        changes.right = `${positions.style.right}px`;
        changes.left = undefined;
      }
      if (positions.style.width !== undefined) {
        changes.width = `${positions.style.width}px`;
      }
      if (positions.style.height !== undefined) {
        changes.height = `${positions.style.height}px`;
      }
      if (this.top === undefined) {
        // Bypass Ember on the first reposition only to avoid flickering.
        for (const prop in positions.style) {
          if (positions.style[prop] !== undefined) {
            if (typeof positions.style[prop] === 'number') {
              dropdown.style.setProperty(prop, `${positions.style[prop]}px`);
            } else {
              dropdown.style.setProperty(prop, `${positions.style[prop]}`);
            }
          }
        }
      }
    }
    for (const prop in positions.style) {
      if (!IGNORED_STYLES.includes(prop)) {
        changes.otherStyles[prop] = positions.style[prop];
      }
    }
    this.hPosition = changes.hPosition;
    this.vPosition = changes.vPosition;
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
    const config = getConfig();
    if (isTesting()) {
      // document doesn't exist in fastboot apps, for this reason we need this check
      if (typeof document === 'undefined') {
        return 'ember-basic-dropdown-wormhole';
      }
      // check if destination exists in tests:
      if (config.destination) {
        const destination = config.destination;
        if (document.getElementById(destination) !== null) {
          return destination;
        }
      }
      // check if default element exists in tests:
      if (document.getElementById('ember-basic-dropdown-wormhole') !== null) {
        return 'ember-basic-dropdown-wormhole';
      }
      // fall back to rootElement as destination
      const rootElement = config.rootElement;
      return (rootElement ? document.querySelector(rootElement)?.id : undefined) ?? 'ember-basic-dropdown-wormhole';
    }
    return config.destination || 'ember-basic-dropdown-wormhole';
  }
  _getDropdownElement() {
    if (this.dropdownElement) {
      return this.dropdownElement;
    }
    return document.querySelector(`[id="${this._dropdownId}"]`);
  }
  _getTriggerElement() {
    if (this.triggerElement) {
      return this.triggerElement;
    }
    return document.querySelector(`[data-ebd-id=${this.publicAPI.uniqueId}-trigger]`);
  }
  get triggerComponent() {
    return this.args.triggerComponent || BasicDropdownTrigger;
  }
  get contentComponent() {
    return this.args.contentComponent || BasicDropdownContent;
  }
  static {
    setComponentTemplate(precompileTemplate("\n    {{#let (hash uniqueId=this.publicAPI.uniqueId isOpen=this.publicAPI.isOpen disabled=this.publicAPI.disabled actions=this.publicAPI.actions Trigger=(component this.triggerComponent dropdown=this.publicAPI hPosition=this.hPosition renderInPlace=this.renderInPlace vPosition=this.vPosition htmlTag=@triggerHtmlTag) Content=(component this.contentComponent dropdown=this.publicAPI hPosition=this.hPosition renderInPlace=this.renderInPlace preventScroll=@preventScroll rootEventType=(or @rootEventType \"click\") vPosition=this.vPosition htmlTag=@contentHtmlTag destination=this.destination destinationElement=this.destinationElement top=this.top left=this.left right=this.right width=this.width height=this.height otherStyles=this.otherStyles)) as |api|}}\n      {{#if this.renderInPlace}}\n        <div class=\"ember-basic-dropdown\" ...attributes>{{yield api}}</div>\n      {{else}}\n        {{yield api}}\n      {{/if}}\n    {{/let}}\n  ", {
      strictMode: true,
      scope: () => ({
        hash,
        or
      })
    }), this);
  }
}

export { BasicDropdown as default };
//# sourceMappingURL=basic-dropdown.js.map
