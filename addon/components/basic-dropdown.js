import Ember from 'ember';
import layout from '../templates/components/basic-dropdown';
import getOwner from 'ember-getowner-polyfill';

const { Component, run, computed } = Ember;
const MutObserver = window.MutationObserver || window.WebKitMutationObserver;

export default Component.extend({
  layout: layout,
  disabled: false,
  renderInPlace: false,
  dropdownPosition: 'auto', // auto | above | below
  classNames: ['ember-basic-dropdown'],
  attributeBindings: ['dir'],
  classNameBindings: ['publicAPI.isOpen:ember-basic-dropdown--opened', 'disabled:ember-basic-dropdown--disabled', 'renderInPlace:ember-basic-dropdown--in-place', '_dropdownPositionClass'],
  _wormholeDestination: (Ember.testing ? 'ember-testing' : 'ember-basic-dropdown-wormhole'),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    const rootSelector = Ember.testing ? '#ember-testing' : getOwner(this).lookup('application:main').rootElement;
    this.appRoot = document.querySelector(rootSelector);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.handleRepositioningEvent = this.handleRepositioningEvent.bind(this);
    this.repositionDropdown = this.repositionDropdown.bind(this);
  },

  didInitAttrs() {
    this._super(...arguments);
    const registerActionsInParent = this.get('registerActionsInParent');
    if (registerActionsInParent) {
      registerActionsInParent(this.get('publicAPI'));
    }
  },

  willDestroy() {
    this._super(...arguments);
    this.removeGlobalEvents();
  },

  // CPs
  tabIndex: computed('disabled', function() {
    return !this.get('disabled') ? (this.get('tabindex') || '0') : "-1";
  }),

  publicAPI: computed(function() {
    return {
      isOpen: false,
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
      }
    };
  }),

  opened: computed('publicAPI.isOpen', {
    get() { return this.get('publicAPI.isOpen'); },
    set(_, newOpened) {
      const oldOpened = this.get('publicAPI.isOpen');
      if (!oldOpened && newOpened) {
        this.open();
      } else if (oldOpened && !newOpened) {
        this.close();
      }
      return this.get('publicAPI.isOpen');
    }
  }),

  // Actions
  actions: {
    toggle(e) {
      this.toggle(e);
    },

    keydown(e) {
      this.handleKeydown(e);
    },

    focusTrigger(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) { onFocus(this.get('publicAPI'), e); }
    }
  },

  // Methods
  toggle(e) {
    if (this.get('publicAPI.isOpen')) {
      this.close(e);
    } else {
      this.open(e);
    }
  },

  open(e) {
    if (this.get('disabled') || this.get('publicAPI.isOpen')) { return; }
    if (e) { e.preventDefault(); }
    this.set('publicAPI.isOpen', true);
    run.scheduleOnce('afterRender', this, this.addGlobalEvents);
    run.scheduleOnce('afterRender', this, this.repositionDropdown);
    let onOpen = this.get('onOpen');
    if (onOpen) { onOpen(this.get('publicAPI'), e); }
  },

  close(e, skipFocus) {
    if (!this.get('publicAPI.isOpen')) { return; }
    this.set('publicAPI.isOpen', false);
    this.set('_dropdownPositionClass', null);
    this.removeGlobalEvents();
    let onClose = this.get('onClose');
    if (onClose) { onClose(this.get('publicAPI'), e); }
    if (skipFocus) { return; }
    const trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    if (trigger.tabIndex > -1) {
      trigger.focus();
    }
  },

  handleKeydown(e) {
    if (this.get('disabled')) { return; }
    let onKeydown = this.get('onKeydown');
    if (onKeydown) { onKeydown(this.get('publicAPI'), e); }
    if (e.defaultPrevented) { return; }
    if (e.keyCode === 13) {  // Enter
      this.toggle(e);
    } else if (e.keyCode === 27) {
      this.close(e);
    }
  },

  repositionDropdown() {
    run(this, this._runloopAwareRepositionDropdown);
  },

  handleRootMouseDown(e) {
    if (!this.get('renderInPlace')) {
      if (!this.element.contains(e.target) && !this.appRoot.querySelector('.ember-basic-dropdown-content').contains(e.target)) {
        this.close(e, true);
      }
    }
  },

  handleRepositioningEvent(/* e */) {
    run.throttle(this, 'repositionDropdown', 60, true);
  },

  addGlobalEvents() {
    this.appRoot.addEventListener('mousedown', this.handleRootMouseDown, true);
    window.addEventListener('scroll', this.handleRepositioningEvent);
    window.addEventListener('resize', this.handleRepositioningEvent);
    window.addEventListener('orientationchange', this.handleRepositioningEvent);
    if (MutObserver) {
      this.mutationObserver = new MutObserver(mutations => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          this.repositionDropdown();
        }
      });
      run.schedule('afterRender', this, function() {
        const dropdown = this.appRoot.querySelector('.ember-basic-dropdown-content');
        if (!dropdown) { return; }
        this.mutationObserver.observe(dropdown, { childList: true, subtree: true });
      });
    } else {
      run.schedule('afterRender', this, function() {
        const dropdown = this.appRoot.querySelector('.ember-basic-dropdown-content');
        dropdown.addEventListener('DOMNodeInserted', this.repositionDropdown, false);
        dropdown.addEventListener('DOMNodeRemoved', this.repositionDropdown, false);
      });
    }
  },

  removeGlobalEvents() {
    this.appRoot.removeEventListener('mousedown', this.handleRootMouseDown, true);
    window.removeEventListener('scroll', this.handleRepositioningEvent);
    window.removeEventListener('resize', this.handleRepositioningEvent);
    window.removeEventListener('orientationchange', this.handleRepositioningEvent);
    if (MutObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      const dropdown = this.appRoot.querySelector('.ember-basic-dropdown-content');
      dropdown.removeEventListener('DOMNodeInserted', this.repositionDropdown);
      dropdown.removeEventListener('DOMNodeRemoved', this.repositionDropdown);
    }
  },

  _runloopAwareRepositionDropdown() {
    if (this.get('renderInPlace') || !this.get('publicAPI.isOpen')) { return; }
    const dropdownPositionStrategy = this.get('dropdownPosition');
    const dropdown = this.appRoot.querySelector('.ember-basic-dropdown-content');
    const trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    let { left, top: topWithoutScroll, width, height } = trigger.getBoundingClientRect();
    let viewportTop  = Ember.$(window).scrollTop();
    let top = topWithoutScroll + viewportTop;
    if (this.get('matchTriggerWidth')) {
      dropdown.style.width = `${width}px`;
    }
    if (dropdownPositionStrategy === 'above') {
      top = top - dropdown.getBoundingClientRect().height;
      this.set('_dropdownPositionClass', 'ember-basic-dropdown--above');
    } else if (dropdownPositionStrategy === 'below') {
      top = top + height;
      this.set('_dropdownPositionClass', 'ember-basic-dropdown--below');
    } else { // auto
      const viewportBottom = window.scrollY + window.innerHeight;
      const dropdownHeight = dropdown.getBoundingClientRect().height;
      const enoughRoomBelow = top + height + dropdownHeight < viewportBottom;
      const enoughRoomAbove = topWithoutScroll > dropdownHeight;
      let positionClass = this.get('_dropdownPositionClass');
      if (positionClass === 'ember-basic-dropdown--below' && !enoughRoomBelow && enoughRoomAbove) {
        this.set('_dropdownPositionClass', 'ember-basic-dropdown--above');
      } else if (positionClass === 'ember-basic-dropdown--above' && !enoughRoomAbove && enoughRoomBelow) {
        this.set('_dropdownPositionClass', 'ember-basic-dropdown--below');
      } else if (!positionClass) {
        this.set('_dropdownPositionClass', enoughRoomBelow ? 'ember-basic-dropdown--below' : 'ember-basic-dropdown--above');
      }
      positionClass = this.get('_dropdownPositionClass'); // It might have changed
      top = top + (positionClass === 'ember-basic-dropdown--below' ? height : -dropdownHeight);
    }
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  }
});
