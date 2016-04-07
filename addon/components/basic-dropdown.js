/*jshint unused:false*/
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
  triggerDisabled: false,
  initiallyOpened: false,
  hasFocusInside: false,
  verticalPosition: 'auto', // above | below
  horizontalPosition: 'auto', // right | left
  classNames: ['ember-basic-dropdown'],
  attributeBindings: ['dir'],
  classNameBindings: [
    'renderInPlace:ember-basic-dropdown--in-place',
    'hasFocusInside:ember-basic-dropdown--focus-inside',
    '_verticalPositionClass',
    '_horizontalPositionClass'
  ],

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
    if (this.get('triggerDisabled')) { return; }
    let trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    if (this.isTouchDevice) {
      trigger.addEventListener('touchstart', e => {
        this.get('appRoot').addEventListener('touchmove', this._touchMoveHandler);
      });
      trigger.addEventListener('touchend', e => {
        this.send('handleTouchEnd', e);
        e.preventDefault(); // Prevent synthetic click
      });
    }
    trigger.addEventListener('mousedown', e => this.send('handleMousedown', e));

    let onMouseEnter = this.get('onMouseEnter');
    if (onMouseEnter) {
      trigger.addEventListener('mouseenter', e => onMouseEnter(this.get('publicAPI'), e));
    }

    let onMouseLeave = this.get('onMouseLeave');
    if (onMouseLeave) {
      trigger.addEventListener('mouseleave', e => onMouseLeave(this.get('publicAPI'), e));
    }
  },

  willDestroy() {
    this._super(...arguments);
    if (self.FastBoot) { return; }
    if (this.get('publicAPI.isOpen')) {
      this.removeGlobalEvents();
    }
    this.get('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  },

  // Events
  focusIn(e) {
    this.send('handleFocusIn', e);
  },

  focusOut(e) {
    this.send('handleFocusOut', e);
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
      isOpen: this.get('initiallyOpened'),
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: this.handleRepositioningEvent.bind(this)
      }
    };
  }),

  // Actions
  actions: {
    handleTouchEnd(e) {
      if (e && e.defaultPrevented) { return; }
      if (!this.hasMoved) {
        this.toggle(e);
      }
      this.hasMoved = false;
    },

    handleMousedown(e) {
      if (e && e.defaultPrevented) { return; }
      this.stopTextSelectionUntilMouseup();
      this.toggle(e);
    },

    keydown(e) {
      this.handleKeydown(e);
    },

    handleFocus(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) { onFocus(this.get('publicAPI'), e); }
    },

    handleFocusIn() {
      this.set('hasFocusInside', true);
    },

    handleFocusOut() {
      this.set('hasFocusInside', false);
    },
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

  close(event, skipFocus) {
    if (!this.get('publicAPI.isOpen')) { return; }
    this.set('publicAPI.isOpen', false);
    this.setProperties({ _verticalPositionClass: null, _horizontalPositionClass: null });
    run.cancel(this.addGlobalEventsTimer);
    run.cancel(this.repositionDropdownTimer);
    this.addGlobalEventsTimer = this.repositionDropdownTimer = this.addTransitionClassTimer = null;
    this.removeGlobalEvents();
    let onClose = this.get('onClose');
    if (onClose) { onClose(this.get('publicAPI'), event); }
    if (skipFocus) { return; }
    const trigger = this.element.querySelector('.ember-basic-dropdown-trigger');
    if (trigger.tabIndex > -1) {
      trigger.focus();
    }
  },

  handleKeydown(e) {
    if (this.get('disabled')) { return; }
    let onKeydown = this.get('onKeydown');
    let returnVal;
    if (onKeydown) { returnVal = onKeydown(this.get('publicAPI'), e); }
    if (returnVal === false || e.defaultPrevented) { return; }
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
    if (this.element.contains(e.target)) { return; }
    let dropdownContent = self.document.getElementById(this.get('dropdownId'));
    if (dropdownContent.contains(e.target)) { return; }
    let closestDDcontent = $(e.target).closest('.ember-basic-dropdown-content')[0];
    if (closestDDcontent) {
      let closestDropdownId = closestDDcontent.id.match(/ember\d+$/)[0];
      let clickedOnNestedDropdown = !!dropdownContent.querySelector('#' + closestDropdownId);
      if (clickedOnNestedDropdown) { return; }
    }
    this.close(e, true);
  },

  handleRepositioningEvent(/* e */) {
    run.throttle(this, 'repositionDropdown', 60, true);
  },

  addGlobalEvents() {
    if (self.FastBoot) { return; }
    this.get('appRoot').addEventListener('mousedown', this.handleRootMouseDown, true);
    if (this.get('renderInPlace')) { return; }
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
      if (!dropdown) { return; }
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
