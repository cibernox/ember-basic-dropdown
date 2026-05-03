import Component from '@glimmer/component';
import { getConfig } from '../config.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

class BasicDropdownWormhole extends Component {
  get getDestinationId() {
    const config = getConfig();
    return config.destination || 'ember-basic-dropdown-wormhole';
  }
  static {
    setComponentTemplate(precompileTemplate("<div id={{this.getDestinationId}} ...attributes></div>", {
      strictMode: true
    }), this);
  }
}

export { BasicDropdownWormhole as default };
//# sourceMappingURL=basic-dropdown-wormhole.js.map
