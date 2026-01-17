import Component from '@glimmer/component';
import { getConfig } from '../config.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

class BasicDropdownWormholeComponent extends Component {
  get getDestinationId() {
    const config = getConfig();
    return config.destination || 'ember-basic-dropdown-wormhole';
  }
  static {
    setComponentTemplate(precompileTemplate("\n    <div id={{this.getDestinationId}} ...attributes></div>\n  ", {
      strictMode: true
    }), this);
  }
}

export { BasicDropdownWormholeComponent as default };
//# sourceMappingURL=basic-dropdown-wormhole.js.map
