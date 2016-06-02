import Ember from 'ember';
import Component from 'ember-component';
import computed from 'ember-computed';
import set, { setProperties } from  'ember-metal/set';
import $ from 'jquery';
import layout from '../templates/components/basic-dropdown';
import run from 'ember-runloop';

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
    this.triggerId = this.triggerId || `ember-basic-dropdown-trigger-${this.elementId}`;
    this.dropdownId = this.dropdownId || `ember-basic-dropdown-content-${this.elementId}`;

    this.publicAPI = {
      isOpen: this.getAttr('initiallyOpened') || false,
      actions: {
        open: this.open.bind(this),
        close: this.close.bind(this),
        toggle: this.toggle.bind(this),
        reposition: () => run.join(this, this.reposition)
      }
    };

    let registerAPI = this.get('registerAPI');
    if (registerAPI) {
      registerAPI(this.publicAPI);
    }
  },

  // CPs
  appRoot: computed(function() {
    let rootSelector = testing ? '#ember-testing' : getOwner(this).lookup('application:main').rootElement;
    return self.document.querySelector(rootSelector);
  }),

  // Actions
  actions: {
    handleFocus(e) {
      let onFocus = this.get('onFocus');
      if (onFocus) {
        onFocus(this.publicAPI, e);
      }
    }
  },

  // Methods
  open(e) {
    if (this.getAttr('disabled') || this.publicAPI.isOpen) {
      return;
    }
    let onOpen = this.getAttr('onOpen');
    if (onOpen && onOpen(this.publicAPI, e) === false) {
      return;
    }
    set(this.publicAPI, 'isOpen', true);
  },

  close(e, skipFocus) {
    if (this.getAttr('disabled') || !this.publicAPI.isOpen) {
      return;
    }
    let onClose = this.getAttr('onClose');
    if (onClose && onClose(this.publicAPI, e) === false) {
      return;
    }
    set(this.publicAPI, 'isOpen', false);
    setProperties(this, { vPosition: null, hPosition: null });
    if (skipFocus) {
      return;
    }
    let trigger = document.getElementById(this.triggerId);
    if (trigger && trigger.tabIndex > -1) {
      trigger.focus();
    }
  },

  toggle(e) {
    if (this.publicAPI.isOpen) {
      this.close(e);
    } else {
      this.open(e);
    }
  },

  reposition() {
    run.scheduleOnce('afterRender', this, this.repositionNow);
  },

  repositionNow() {
    if (!this.publicAPI.isOpen) {
      return;
    }
    let dropdownElement = self.document.getElementById(this.dropdownId);
    if (!dropdownElement) {
      return;
    }
    let matchTriggerWidth = this.get('matchTriggerWidth');
    let {
      triggerTop, triggerLeft, triggerWidth, triggerHeight, // trigger dimensions
      dropdownHeight, dropdownWidth,                        // dropdown dimensions
      scrollTop, scrollLeft                                 // scroll
    } = this._getPositionInfo(dropdownElement);
    if (matchTriggerWidth) {
      dropdownWidth = triggerWidth;
    }
    let dropdownLeft = triggerLeft;
    let dropdownTop;

    // hPosition
    let hPosition = this.get('horizontalPosition');
    if (this.get('renderInPlace')) {
      if (['right', 'left', 'center'].indexOf(hPosition) === -1) {
        let viewportRight = scrollLeft + self.window.innerWidth;
        hPosition = triggerLeft + dropdownWidth > viewportRight ? 'right' : 'left';
      }
      this.set('hPosition', hPosition);
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
      this.set('hPosition', hPosition);

      // vPosition
      let vPosition = this.get('verticalPosition');
      let triggerTopWithScroll = triggerTop + scrollTop;
      if (vPosition === 'above') {
        dropdownTop = triggerTopWithScroll - dropdownHeight;
        this.set('vPosition', 'above');
      } else if (vPosition === 'below') {
        dropdownTop = triggerTopWithScroll + triggerHeight;
        this.set('vPosition', 'below');
      } else { // auto
        let viewportBottom = scrollTop + self.window.innerHeight;
        let enoughRoomBelow = triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
        let enoughRoomAbove = triggerTop > dropdownHeight;

        let previousVPosition = this.get('vPosition');
        if (previousVPosition === 'below' && !enoughRoomBelow && enoughRoomAbove) {
          this.set('vPosition', 'above');
        } else if (previousVPosition === 'above' && !enoughRoomAbove && enoughRoomBelow) {
          this.set('vPosition', 'below');
        } else if (!previousVPosition) {
          this.set('vPosition', enoughRoomBelow ? 'below' : 'above');
        }
        vPosition = this.get('vPosition'); // It might have changed
        dropdownTop = triggerTopWithScroll + (vPosition === 'below' ? triggerHeight : -dropdownHeight);
      }

      if (matchTriggerWidth) {
        dropdownElement.style.width = `${dropdownWidth}px`;
      }
      dropdownElement.style.top = `${dropdownTop}px`;
      dropdownElement.style.left = `${dropdownLeft}px`;
    }
  },

  _getPositionInfo(dropdown) {
    let trigger = document.getElementById(this.triggerId);
    let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
    let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
    let $window = $(self.window);
    let scrollLeft = $window.scrollLeft();
    let scrollTop = $window.scrollTop();
    return {
      triggerTop, triggerLeft, triggerWidth, triggerHeight,
      dropdownHeight, dropdownWidth,
      scrollLeft, scrollTop
    };
  }
});
