import Component from 'ember-component';
import layout from '../../templates/components/basic-dropdown/content';
import config from 'ember-get-config';
import $ from 'jquery';
import Ember from 'ember';
import run from 'ember-runloop';

const defaultDestination = config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
const { testing } = Ember;
const MutObserver = self.window.MutationObserver || self.window.WebKitMutationObserver;

export default Component.extend({
  layout,
  tagName: '',
  to: testing ? 'ember-testing' : defaultDestination,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    // this.touchStartHandler = this.touchStartHandler.bind(this);
    // this.touchMoveHandler = this.touchMoveHandler.bind(this);
  },

  // Actions
  actions: {
    didInsert() {
      let appRoot = this.getAttr('appRoot');
      this.dropdownElement = document.getElementById(this.elementId);
      let triggerId = this.getAttr('triggerId');
      if (triggerId) {
        this.triggerElement = document.getElementById(triggerId);
      }
      appRoot.addEventListener('mousedown', this.handleRootMouseDown, true);
      if (!this.getAttr('renderInPlace')) {
        this.addGlobalEvents();
      }
      run.scheduleOnce('actions', this.getAttr('dropdown').actions.reposition);
    },

    willDestroy() {
      let appRoot = this.getAttr('appRoot');
      this.removeGlobalEvents();
      appRoot.removeEventListener('mousedown', this.handleRootMouseDown, true);
      this.dropdownElement = this.triggerElement = null;
    }
  },

  // Methods
  handleRootMouseDown(e) {
    if (this.dropdownElement.contains(e.target)) { return; }
    if (this.triggerElement && this.triggerElement.contains(e.target)) { return; }
    this.getAttr('dropdown').actions.close(e);
  },

  addGlobalEvents() {
    let reposition = this.getAttr('dropdown').actions.reposition;
    self.window.addEventListener('scroll', reposition);
    self.window.addEventListener('resize', reposition);
    self.window.addEventListener('orientationchange', reposition);
    if (MutObserver) {
      this.mutationObserver = new MutObserver(mutations => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          reposition();
        }
      });
      this.mutationObserver.observe(this.dropdownElement, { childList: true, subtree: true });
    } else {
      this.dropdownElement.addEventListener('DOMNodeInserted', reposition, false);
      this.dropdownElement.addEventListener('DOMNodeRemoved', reposition, false);
    }
  },

  removeGlobalEvents() {
    let reposition = this.getAttr('dropdown').actions.reposition;
    self.window.removeEventListener('scroll', reposition);
    self.window.removeEventListener('resize', reposition);
    self.window.removeEventListener('orientationchange', reposition);
    if (MutObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      this.dropdownElement.removeEventListener('DOMNodeInserted', reposition);
      this.dropdownElement.removeEventListener('DOMNodeRemoved', reposition);
    }
  },



  // renderInPlace: false,
  // verticalPosition: 'auto', // above | below
  // horizontalPosition: 'auto', // right | center | left
  // matchTriggerWidth: false,
  // animationEnabled: true,

  // // Actions
  // actions: {
  //   reposition() {
  //     let publicAPI = this.getAttr('dropdown');
  //     if (!publicAPI.isOpen) { return; }
  //     let dropdownElement = self.document.getElementById(this.getAttr('dropdownId'));
  //     if (!dropdownElement) { return ;}
  //     let {
  //       triggerTop, triggerLeft, triggerWidth, triggerHeight, // trigger dimensions
  //       dropdownHeight, dropdownWidth,                        // dropdown dimensions
  //       scrollTop, scrollLeft                                 // scroll
  //     } = this._getPositionInfo(dropdownElement);
  //     let dropdownTop, dropdownLeft = triggerLeft;

  //     // hPosition
  //     let hPosition = this.get('horizontalPosition');
  //     if (this.get('renderInPlace')) {
  //       if (['right', 'left', 'center'].indexOf(hPosition) === -1) {
  //         let viewportRight = scrollLeft + self.window.innerWidth;
  //         hPosition = triggerLeft + dropdownWidth > viewportRight ? 'right' : 'left';
  //       }
  //       return this.set('_horizontalPositionClass', `ember-basic-dropdown--${hPosition}`);
  //     } else {
  //       if (['right', 'left', 'center'].indexOf(hPosition) === -1) {
  //         let viewportRight = scrollLeft + self.window.innerWidth;
  //         let roomForRight = viewportRight - triggerLeft;
  //         let roomForLeft = triggerLeft;
  //         hPosition = roomForRight > roomForLeft ? 'left' : 'right';
  //       }
  //       if (hPosition === 'right') {
  //         dropdownLeft = triggerLeft + triggerWidth - dropdownWidth;
  //       } else if (hPosition === 'center') {
  //         dropdownLeft = triggerLeft + (triggerWidth - dropdownWidth) / 2;
  //       }
  //       this.set('_horizontalPositionClass', `ember-basic-dropdown--${hPosition}`);
  //     }

  //     // vPosition
  //     let vPosition = this.get('verticalPosition');
  //     let triggerTopWithScroll = triggerTop + scrollTop;
  //     if (vPosition === 'above') {
  //       dropdownTop = triggerTopWithScroll - dropdownHeight;
  //       this.set('_verticalPositionClass', 'ember-basic-dropdown--above');
  //     } else if (vPosition === 'below') {
  //       dropdownTop = triggerTopWithScroll + triggerHeight;
  //       this.set('_verticalPositionClass', 'ember-basic-dropdown--below');
  //     } else { // auto
  //       let viewportBottom = scrollTop + self.window.innerHeight;
  //       let enoughRoomBelow = triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
  //       let enoughRoomAbove = triggerTop > dropdownHeight;

  //       let verticalPositionClass = this.get('_verticalPositionClass');
  //       if (verticalPositionClass === 'ember-basic-dropdown--below' && !enoughRoomBelow && enoughRoomAbove) {
  //         this.set('_verticalPositionClass', 'ember-basic-dropdown--above');
  //       } else if (verticalPositionClass === 'ember-basic-dropdown--above' && !enoughRoomAbove && enoughRoomBelow) {
  //         this.set('_verticalPositionClass', 'ember-basic-dropdown--below');
  //       } else if (!verticalPositionClass) {
  //         this.set('_verticalPositionClass', enoughRoomBelow ? 'ember-basic-dropdown--below' : 'ember-basic-dropdown--above');
  //       }
  //       verticalPositionClass = this.get('_verticalPositionClass'); // It might have changed
  //       dropdownTop = triggerTopWithScroll + (verticalPositionClass === 'ember-basic-dropdown--below' ? triggerHeight : -dropdownHeight);
  //     }

  //     dropdownElement.style.width = `${dropdownWidth}px`;
  //     dropdownElement.style.top = `${dropdownTop}px`;
  //     dropdownElement.style.left = `${dropdownLeft}px`;
  //   }
  // },

  // // Methods
  // _getPositionInfo(dropdown) {
  //   let trigger = document.querySelector('#' + this.triggerId);
  //   let { left: triggerLeft, top: triggerTop, width: triggerWidth, height: triggerHeight } = trigger.getBoundingClientRect();
  //   let { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();
  //   let $window = Ember.$(self.window);
  //   let scrollLeft = $window.scrollLeft();
  //   let scrollTop = $window.scrollTop();
  //   if (this.get('matchTriggerWidth')) {
  //     dropdownWidth = triggerWidth;
  //   }
  //   return {
  //     triggerTop, triggerLeft, triggerWidth, triggerHeight,
  //     dropdownHeight, dropdownWidth,
  //     scrollLeft, scrollTop
  //   };
  // }
});
