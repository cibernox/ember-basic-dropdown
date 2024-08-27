import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div id={{this.getDestinationId}} ...attributes></div>");

class BasicDropdownWormholeComponent extends Component {
  get getDestinationId() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const config = getOwner(this).resolveRegistration('config:environment');
    return config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
  }
}
setComponentTemplate(TEMPLATE, BasicDropdownWormholeComponent);

export { BasicDropdownWormholeComponent as default };
//# sourceMappingURL=basic-dropdown-wormhole.js.map
