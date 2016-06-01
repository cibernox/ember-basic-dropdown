import WormholeComponent from 'ember-wormhole/components/ember-wormhole';

export default WormholeComponent.extend({
  didInsertElement() {
    this._super(...arguments);
    let didInsert = this.getAttr('didInsert');
    if (didInsert) { didInsert(); }
  },

  willDestroyElement() {
    this._super(...arguments);
    let willRemove = this.getAttr('willRemove');
    if (willRemove) { willRemove(); }
  }
});