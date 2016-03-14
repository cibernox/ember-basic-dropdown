import Ember from 'ember';
import layout from '../templates/components/basic-dropdown';
import getOwner from 'ember-getowner-polyfill';
import config from 'ember-get-config';

const { Component, run, computed } = Ember;
const MutObserver = self.window.MutationObserver || self.window.WebKitMutationObserver;
const defaultDestination = config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';

export default Component.extend({
  layout: layout,
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  disabled: false,
  renderInPlace: false,
  role: 'button',
  destination: null,
  verticalPosition: 'auto', // above | below
  horizontalPosition: 'auto', // right | left
  classNames: ['ember-basic-dropdown'],
  attributeBindings: ['dir'],
  classNameBindings: ['renderInPlace:ember-basic-dropdown--in-place', '_verticalPositionClass', '_horizontalPositionClass'],

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.handleRepositioningEvent = this.handleRepositioningEvent.bind(this);
    this.repositionDropdown = this.repositionDropdown.bind(this);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
  },

  didInitAttrs() {
    this._super(...arguments);
    const registerActionsInParent = this.get('registerActionsInParent');
    if (registerActionsInParent) {
      registerActionsInParent(this.get('publicAPI'));
    }
  },

  didInsertElement() {
    this._super(...arguments);
    let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    if (this.isTouchDevice) {
      trigger.addEventListener('touchstart', e => {
        this.get('appRoot').addEventListener('touchmove', this._touchMoveHandler);
      });
      trigger.addEventListener('touchend', e => {
        e.preventDefault(); // Prevent synthetic click
        this.send('handleTouchEnd', e)
      });
    }
    trigger.addEventListener('mousedown', e => this.send('handleMousedown', e));
  },

  willDestroy() {
    this._super(...arguments);
    if (this.get('publicAPI.isOpen')) {
      this.removeGlobalEvents();
    }
    this.get('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  },

  // CPs
  appRoot: computed(function() {
    const rootSelector = Ember.testing ? '#ember-testing' : getOwner(this).lookup('application:main').rootElement;
    return self.document.querySelector(rootSelector);
  }),

  wormholeDestination: computed('destination', function() {
    return Ember.testing ? 'ember-testing' : (this.get('destination') || defaultDestination);
  }),

  dropdownId: computed(function() {
    return `ember-basic-dropdown-content-${this.elementId}`;
  }),

  tabIndex: computed('disabled', function() {
    return !this.get('disabled') ? (this.get('tabindex') || '0') : null;
  }),

  publicAPI: computed(function() {
    return {
      isOpen: false,
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: this.handleRepositioningEvent.bind(this)
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
    handleTouchEnd(e) {
      if (!this.hasMoved) {
        this.toggle(e);
      }
      this.hasMoved = false;
    },

    handleMousedown(e) {
      this.stopTextSelectionUntilMouseup();
      this.toggle(e);
    },

    keydown(e) {
      this.handleKeydown(e);
    },

    handleFocus(e) {
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
    this.set('publicAPI.isOpen', true);
    this.addGlobalEventsTimer = run.scheduleOnce('afterRender', this, this.addGlobalEvents);
    this.repositionDropdownTimer = run.scheduleOnce('afterRender', this, this.handleRepositioningEvent);
    let onOpen = this.get('onOpen');
    if (onOpen) { onOpen(this.get('publicAPI'), e); }
  },

  close(e, skipFocus) {
    if (!this.get('publicAPI.isOpen')) { return; }
    this.set('publicAPI.isOpen', false);
    this.set('_verticalPositionClass', null);
    this.set('_horizontalPositionClass', null);
    run.cancel(this.addGlobalEventsTimer);
    run.cancel(this.repositionDropdownTimer);
    this.addGlobalEventsTimer = this.repositionDropdownTimer = null;
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
    if (self.FastBoot) { return; }
    run.join(this, this._performReposition);
  },

  handleRootMouseDown(e) {
    if (!this.element.contains(e.target) && !self.document.getElementById(this.get('dropdownId')).contains(e.target)) {
      this.close(e, true);
    }
  },

  handleRepositioningEvent(/* e */) {
    run.throttle(this, 'repositionDropdown', 60, true);
  },

  addGlobalEvents() {
    if (self.FastBoot) { return; }
    this.get('appRoot').addEventListener('mousedown', this.handleRootMouseDown, true);
    self.window.addEventListener('scroll', this.handleRepositioningEvent);
    self.window.addEventListener('resize', this.handleRepositioningEvent);
    self.window.addEventListener('orientationchange', this.handleRepositioningEvent);
    if (MutObserver) {
      this.mutationObserver = new MutObserver(mutations => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          this.repositionDropdown();
        }
      });
      run.schedule('afterRender', this, function() {
        let dropdown = self.document.getElementById(this.get('dropdownId'));
        if (!dropdown) { return; }
        this.mutationObserver.observe(dropdown, { childList: true, subtree: true });
      });
    } else {
      run.schedule('afterRender', this, function() {
        let dropdown = self.document.getElementById(this.get('dropdownId'));
        dropdown.addEventListener('DOMNodeInserted', this.repositionDropdown, false);
        dropdown.addEventListener('DOMNodeRemoved', this.repositionDropdown, false);
      });
    }
  },

  stopTextSelectionUntilMouseup() {
    if (self.FastBoot) { return; }
    let $appRoot = Ember.$(this.get('appRoot'));
    let mouseupHandler = function() {
      $appRoot[0].removeEventListener('mouseup', mouseupHandler, true);
      $appRoot.removeClass('ember-basic-dropdown-text-select-disabled');
    };
    $appRoot[0].addEventListener('mouseup', mouseupHandler, true);
    $appRoot.addClass('ember-basic-dropdown-text-select-disabled');
  },

  removeGlobalEvents() {
    if (self.FastBoot) { return; }
    this.get('appRoot').removeEventListener('mousedown', this.handleRootMouseDown, true);
    self.window.removeEventListener('scroll', this.handleRepositioningEvent);
    self.window.removeEventListener('resize', this.handleRepositioningEvent);
    self.window.removeEventListener('orientationchange', this.handleRepositioningEvent);
    if (MutObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      let dropdown = self.document.getElementById(this.get('dropdownId'));
      dropdown.removeEventListener('DOMNodeInserted', this.repositionDropdown);
      dropdown.removeEventListener('DOMNodeRemoved', this.repositionDropdown);
    }
  },

  _performReposition() {
    if (!this.get('publicAPI.isOpen')) { return; }
    if (this.get('renderInPlace')) {
      return this._setFloatDirection();
    }
    let dropdown = self.document.getElementById(this.get('dropdownId'));
    if (!dropdown) { return ;}
    let verticalPositionStrategy = this.get('verticalPosition');
    let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    let { left, top: topWithoutScroll, width: triggerWidth, height } = trigger.getBoundingClientRect();
    if (this.get('matchTriggerWidth')) {
      dropdown.style.width = `${triggerWidth}px`;
    }
    let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
    let $window = Ember.$(self.window);
    let viewportTop = $window.scrollTop();
    let top = topWithoutScroll + viewportTop;

    if (verticalPositionStrategy === 'above') {
      top = top - dropdown.getBoundingClientRect().height;
      this.set('_verticalPositionClass', 'ember-basic-dropdown--above');
    } else if (verticalPositionStrategy === 'below') {
      top = top + height;
      this.set('_verticalPositionClass', 'ember-basic-dropdown--below');
    } else { // auto
      const viewportBottom = viewportTop + self.window.innerHeight;
      const enoughRoomBelow = top + height + dropdownHeight < viewportBottom;
      const enoughRoomAbove = topWithoutScroll > dropdownHeight;

      let verticalPositionClass = this.get('_verticalPositionClass');
      if (verticalPositionClass === 'ember-basic-dropdown--below' && !enoughRoomBelow && enoughRoomAbove) {
        this.set('_verticalPositionClass', 'ember-basic-dropdown--above');
      } else if (verticalPositionClass === 'ember-basic-dropdown--above' && !enoughRoomAbove && enoughRoomBelow) {
        this.set('_verticalPositionClass', 'ember-basic-dropdown--below');
      } else if (!verticalPositionClass) {
        this.set('_verticalPositionClass', enoughRoomBelow ? 'ember-basic-dropdown--below' : 'ember-basic-dropdown--above');
      }
      verticalPositionClass = this.get('_verticalPositionClass'); // It might have changed
      top = top + (verticalPositionClass === 'ember-basic-dropdown--below' ? height : -dropdownHeight);
    }

    let horizontalPositionStrategy = this.get('horizontalPosition');

    if(['right', 'left'].indexOf(horizontalPositionStrategy) === -1) {
      // horizontal auto
      let viewportRight = $window.scrollLeft() + self.window.innerWidth;
      let roomForRight = viewportRight - left;
      let roomForLeft = left;

      horizontalPositionStrategy = roomForRight > roomForLeft ? 'left' : 'right';
    }
    if (horizontalPositionStrategy === 'right') {
      left = left + triggerWidth - dropdownWidth;
    }
    this.set('_horizontalPositionClass', `ember-basic-dropdown--${horizontalPositionStrategy}`);

    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  },

  _setFloatDirection() {
    let horizontalPositionStrategy = this.get('horizontalPosition');

    if(['right', 'left'].indexOf(horizontalPositionStrategy) === -1) {
      // horizontal auto
      let dropdown = self.document.getElementById(this.get('dropdownId'));
      let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
      let { left } = trigger.getBoundingClientRect();
      let { width } = dropdown.getBoundingClientRect();
      let $window = Ember.$(self.window);
      let viewportRight = $window.scrollLeft() + self.window.innerWidth;
      horizontalPositionStrategy = left + width > viewportRight ? 'right' : 'left';
    }
    this.set('_horizontalPositionClass', `ember-basic-dropdown--${horizontalPositionStrategy}`);
  },

  _touchMoveHandler(e) {
    this.hasMoved = true;
    this.get('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  }
});
