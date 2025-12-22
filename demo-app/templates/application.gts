import Component from '@glimmer/component';
import RouteTemplate from 'ember-route-template';
import ShadowRoot from '../components/shadow-root';
import BasicDropdown from '#src/components/basic-dropdown.gts';
import BasicDropdownWormhole from '#src/components/basic-dropdown-wormhole.gts';
import type Owner from '@ember/owner';

// @ts-expect-error Cannot find name 'FastBoot'.
const isFastBoot = typeof FastBoot !== 'undefined';

class Application extends Component {
  shadowDom = false;

  constructor(owner: Owner, args: object) {
    super(owner, args);

    if (import.meta.env.VITE_SHADOW_DOM_BUILD === 'true') {
      this.shadowDom = true;
    }

    if (!this.shadowDom || isFastBoot) {
      return;
    }

    customElements.define(
      'shadow-root',
      class extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
        }
      },
    );
  }

  <template>
    <ShadowRoot>
      <BasicDropdownWormhole />

      <h1>Welcome to ember-basic-dropdown!</h1>

      <BasicDropdown as |dropdown|>
        <dropdown.Trigger>Open me, i'm in shadow</dropdown.Trigger>
        <dropdown.Content><h3>Content of the dropdown in shadow</h3></dropdown.Content>
      </BasicDropdown>

      {{outlet}}
    </ShadowRoot>
  </template>
}

export default RouteTemplate(Application);
