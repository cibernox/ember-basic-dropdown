import Ember from 'ember';
import Component from 'ember-component';
import computed from 'ember-computed';
import get from  'ember-metal/get';
import set, { setProperties } from  'ember-metal/set';
import $ from 'jquery';
import { join as runJoin } from 'ember-runloop';
import layout from '../templates/components/basic-dropdown';

const { testing, getOwner } = Ember;

export default Component.extend({
  layout,
  tagName: '',
  renderInPlace: false,
  verticalPosition: 'auto', // above | below
  horizontalPosition: 'auto', // right | center | left
  matchTriggerWidth: false,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.triggerId = `ember-basic-dropdown-trigger-${this.elementId}`;
    this.dropdownId = `ember-basic-dropdown-content-${this.elementId}`;

    this.publicAPI = {
      isOpen: this.getAttr('initiallyOpened') || false,
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: this.reposition.bind(this)
      }
    };
  },

  // CPs
  appRoot: computed(function() {
    const rootSelector = testing ? '#ember-testing' : getOwner(this).lookup('application:main').rootElement;
    return self.document.querySelector(rootSelector);
  }),

  // Actions
  actions: {
    handleFocusIn() {
      this.set('hasFocusInside', true);
    },

    handleFocusOut() {
      this.set('hasFocusInside', false);
    },

    handleFocus(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) { onFocus(this.get('publicAPI'), e); }
    },
  },

  // Methods
  open(e) {
    if (this.getAttr('disabled') || this.publicAPI.isOpen) { return; }
    let onOpen = this.getAttr('onOpen');
    if (onOpen && onOpen(this.publicAPI, e) === false) { return; }
    set(this.publicAPI, 'isOpen', true);
  },

  close(e /*, skipFocus */) {
    if (this.getAttr('disabled') || !this.publicAPI.isOpen) { return; }
    let onClose = this.getAttr('onClose');
    if (onClose && onClose(this.publicAPI, e) === false) { return; }
    set(this.publicAPI, 'isOpen', false);
    setProperties(this, { _verticalPositionClass: null, _horizontalPositionClass: null });
    // if (skipFocus) { return; }
    // let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    // if (trigger.tabIndex > -1) {
    //   trigger.focus();
    // }
  },

  toggle(e) {
    this.publicAPI.isOpen ? this.close(e) : this.open(e);
  },

  reposition() {
    if (!this.publicAPI.isOpen) { return; }
    let dropdownElement = self.document.getElementById(this.dropdownId);
    if (!dropdownElement) { return ;}
    let {
      triggerTop, triggerLeft, triggerWidth, triggerHeight, // trigger dimensions
      dropdownHeight, dropdownWidth,                        // dropdown dimensions
      scrollTop, scrollLeft                                 // scroll
    } = this._getPositionInfo(dropdownElement);
    let dropdownTop, dropdownLeft = triggerLeft;

    // hPosition
    let hPosition = this.get('horizontalPosition');
    if (this.get('renderInPlace')) {
      if (['right', 'left', 'center'].indexOf(hPosition) === -1) {
        let viewportRight = scrollLeft + self.window.innerWidth;
        hPosition = triggerLeft + dropdownWidth > viewportRight ? 'right' : 'left';
      }
      return this.set('_horizontalPositionClass', `ember-basic-dropdown--${hPosition}`);
    } else {
      if (['right', 'left', 'center'].indexOf(hPosition) === -1) {
        let viewportRight = scrollLeft + self.window.innerWidth;
        let roomForRight = viewportRight - triggerLeft;
        let roomForLeft = triggerLeft;
        hPosition = roomForRight > roomForLeft ? 'left' : 'right';
      }
      if (hPosition === 'right') {
        dropdownLeft = triggerLeft + triggerWidth - dropdownWidth;
      } else if (hPosition === 'center') {
        dropdownLeft = triggerLeft + (triggerWidth - dropdownWidth) / 2;
      }
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

    dropdownElement.style.width = `${dropdownWidth}px`;
    dropdownElement.style.top = `${dropdownTop}px`;
    dropdownElement.style.left = `${dropdownLeft}px`;
  },

  _getPositionInfo(dropdown) {
    let trigger = document.getElementById(this.triggerId);
    let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
    let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
    let $window = $(self.window);
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
  }
});
