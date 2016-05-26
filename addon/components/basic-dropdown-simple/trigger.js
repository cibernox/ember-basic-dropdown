import Ember from 'ember';
import layout from '../../templates/components/basic-dropdown-simple/trigger';

const isTouchDevice = (!!self.window && 'ontouchstart' in self.window);

export default Ember.Component.extend({
  layout,
  isTouchDevice,
  classNames: ['ember-basic-dropdown-trigger'],

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
    let dropdown = this.getAttr('dropdown')
    if (this.get('isTouchDevice')) {
      this.element.addEventListener('touchstart', e => {
        this.getAttr('appRoot').addEventListener('touchmove', this._touchMoveHandler);
      });
      this.element.addEventListener('touchend', e => {
        this.send('handleTouchEnd', e);
        e.preventDefault(); // Prevent synthetic click
      });
    }
    this.element.addEventListener('mousedown', e => this.send('handleMousedown', e));
    let onMouseEnter = this.getAttr('onMouseEnter');
    if (onMouseEnter) {
      this.element.addEventListener('mouseenter', e => onMouseEnter(dropdown, e));
    }
    let onMouseLeave = this.getAttr('onMouseLeave');
    if (onMouseLeave) {
      this.element.addEventListener('mouseleave', e => onMouseLeave(dropdown, e));
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.getAttr('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  },

  // Actions
  actions: {
    handleMousedown(e) {
      if (e && e.defaultPrevented) { return; }
      this.stopTextSelectionUntilMouseup();
      this.getAttr('dropdown').actions.toggle(e);
    },

    handleTouchEnd(e) {
      if (e && e.defaultPrevented) { return; }
      if (!this.hasMoved) {
        this.getAttr('dropdown').actions.toggle(e);
      }
      this.hasMoved = false;
    }
  },

  // Methods
  _touchMoveHandler(e) {
    this.hasMoved = true;
    this.getAttr('appRoot').removeEventListener('touchmove', this._touchMoveHandler);
  },

  stopTextSelectionUntilMouseup() {
    let $appRoot = Ember.$(this.get('appRoot'));
    let mouseupHandler = function() {
      $appRoot[0].removeEventListener('mouseup', mouseupHandler, true);
      $appRoot.removeClass('ember-basic-dropdown-text-select-disabled');
    };
    $appRoot[0].addEventListener('mouseup', mouseupHandler, true);
    $appRoot.addClass('ember-basic-dropdown-text-select-disabled');
  },
});
