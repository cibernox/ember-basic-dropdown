import RouteTemplate from 'ember-route-template';
import ShadowRoot from '../components/shadow-root';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';

export default RouteTemplate(
  <template>
    <ShadowRoot>
      <BasicDropdownWormhole />

      {{outlet}}
    </ShadowRoot>
  </template>,
);
