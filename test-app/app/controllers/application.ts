import type ApplicationInstance from '@ember/application/instance';
import Controller from '@ember/controller';
import type Owner from '@ember/owner';
import type environment from 'test-app/config/environment';
import { getOwner } from '@ember/owner';

// @ts-expect-error Cannot find name 'FastBoot'.
const isFastBoot = typeof FastBoot !== 'undefined';

export default class extends Controller {
  shadowDom = false;

  constructor(owner: Owner) {
    super(owner);

    const config = (getOwner(this) as ApplicationInstance).resolveRegistration(
      'config:environment',
    ) as typeof environment;

    this.shadowDom = (config.APP['shadowDom'] as boolean) ?? false;

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
}
