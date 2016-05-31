import WormholeComponent from 'ember-wormhole/components/ember-wormhole';
import layout from '../../templates/components/basic-dropdown/wormhole';

export default WormholeComponent.extend({
  didInsertElement() {
    this._super(...arguments);
    let didInsert = this.getAttr('didInsert');
    didInsert && didInsert();
  },

  willDestroyElement() {
    this._super(...arguments);
    let willRemove = this.getAttr('willRemove');
    willRemove && willRemove();
  }
});