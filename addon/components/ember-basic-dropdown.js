import Ember from 'ember';
import layout from '../templates/components/ember-basic-dropdown';

const { Component, run, computed } = Ember;
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

export default Component.extend({
  layout: layout,
  disabled: false,
  renderInPlace: false,
  dropdownPosition: 'auto', // auto | above | below
  classNames: ['ember-basic-dropdown'],
  classNameBindings: ['_opened:opened', 'renderInPlace', '_dropdownPositionClass'],
  _wormholeDestination: (Ember.testing ? 'ember-testing' : 'ember-basic-dropdown-wormhole'),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    const rootSelector = Ember.testing ? '#ember-testing' : this.container.lookup('application:main').rootElement;
    this.appRoot = document.querySelector(rootSelector);
    this.handleRootClick = this.handleRootClick.bind(this);
    this.handleRepositioningEvent = this.handleRepositioningEvent.bind(this);
    this.repositionDropdown = this.repositionDropdown.bind(this);
  },

  willDestroy() {
    this._super(...arguments);
    this.removeGlobalEvents();
  },

  // CPs
  tabindex: computed('disabled', function() {
    return !this.get('disabled') ? "0" : "-1";
  }),

  // Actions
  actions: {
    toggle(e) {
      this.toggle(e);
    },

    keydown(e) {
      this.handleKeydown(e);
    }
  },

  // Methods
  toggle(e) {
    if (this.get('_opened')) {
      this.close(e);
    } else {
      this.open(e);
    }
  },

  open(e) {
    this.set('_opened', true);
    this.addGlobalEvents();
    run.scheduleOnce('afterRender', this, this.repositionDropdown);
    let onOpen = this.get('onOpen');
    if (onOpen) { onOpen(e); }
  },

  close(e) {
    this.set('_opened', false);
    this.removeGlobalEvents();
    let onClose = this.get('onClose');
    if (onClose) { onClose(e); }
  },

  handleKeydown(e) {
    if (this.get('disabled')) { return; }
    if (e.keyCode === 13) {  // Enter
      this.toggle(e);
    } else {
      let onKeydown = this.get('onKeydown');
      if (onKeydown) { onKeydown(e); }
    }
  },

  repositionDropdown() {
    if (this.get('renderInPlace')) { return; }
    const dropdownPositionStrategy = this.get('dropdownPosition');
    const dropdown = this.appRoot.querySelector('.ember-basic-dropdown-content');
    if (this.get('matchTriggerWidth')) {
      const width = this.element.offsetWidth;
      dropdown.style.width = `${width}px`;
    }
    let left = this.element.offsetLeft;
    let top;
    if (dropdownPositionStrategy === 'above') {
      top = this.element.offsetTop - dropdown.offsetHeight;
    } else if (dropdownPositionStrategy === 'below') {
      top = this.element.offsetTop + this.element.offsetHeight;
    } else { // auto
      const viewportTop = document.body.scrollTop;
      const viewportBottom = window.scrollY + window.innerHeight;
      const dropdownHeight = dropdown.offsetHeight;
      const selectTop = this.element.offsetTop;
      const enoughRoomBelow = selectTop + this.element.offsetHeight + dropdownHeight < viewportBottom;
      const enoughRoomAbove = selectTop - viewportTop > dropdownHeight;
      let positionClass = this.get('_dropdownPositionClass');
      if (positionClass === 'below' && !enoughRoomBelow && enoughRoomAbove) {
        this.set('_dropdownPositionClass', 'above');
      } else if (positionClass === 'above' && !enoughRoomAbove && enoughRoomBelow) {
        this.set('_dropdownPositionClass', 'below');
      } else if (!positionClass) {
        this.set('_dropdownPositionClass', enoughRoomBelow ? 'below' : 'above');
      }
      positionClass = this.get('_dropdownPositionClass'); // It might have changed
      top = selectTop + (positionClass === 'below' ? this.element.offsetHeight : -dropdownHeight);
    }
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  },

  handleRootClick(e) {
    if (!this.element.contains(e.target) && !this.appRoot.querySelector('.ember-basic-dropdown-content').contains(e.target)) {
      this.close();
    }
  },

  handleRepositioningEvent(/* e */) {
    run.throttle(this, 'repositionDropdown', 60, true);
  },

  addGlobalEvents() {
    this.appRoot.addEventListener('click', this.handleRootClick);
    window.addEventListener('scroll', this.handleRepositioningEvent);
    window.addEventListener('resize', this.handleRepositioningEvent);
    window.addEventListener('orientationchange', this.handleRepositioningEvent);
    if (MutationObserver) {
      this.mutationObserver = new MutationObserver(mutations => {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          this.repositionDropdown();
        }
      });
      run.schedule('afterRender', this, function() {
        const dropdown = this.appRoot.querySelector('.ember-basic-dropdown-content');
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
    this.appRoot.removeEventListener('click', this.handleRootClick);
    window.removeEventListener('scroll', this.handleRepositioningEvent);
    window.removeEventListener('resize', this.handleRepositioningEvent);
    window.removeEventListener('orientationchange', this.handleRepositioningEvent);
    if (MutationObserver) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    } else {
      const dropdown = this.appRoot.querySelector('.ember-basic-dropdown-content');
      dropdown.removeEventListener('DOMNodeInserted', this.repositionDropdown);
      dropdown.removeEventListener('DOMNodeRemoved', this.repositionDropdown);
    }
  }
});