import Ember from 'ember';
import Component from 'ember-component';
import computed from 'ember-computed';
import get from  'ember-metal/get';
import set, { setProperties } from  'ember-metal/set';
import layout from '../templates/components/basic-dropdown-simple';

const { testing, getOwner } = Ember;

export default Component.extend({
  layout,
  tagName: '',

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.dropdownId = `ember-basic-dropdown-content-${this.elementId}`;

    this.publicAPI = {
      isOpen: this.getAttr('initiallyOpened'),
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: () => console.debug('reposition called!')
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
    }
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
});
