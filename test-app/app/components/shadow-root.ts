import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';

// @ts-expect-error Public property 'isFastBoot' of exported class
const isFastBoot = typeof FastBoot !== 'undefined';

export default class ShadowRootComponent extends Component<{
  Element: HTMLDivElement;
  Args: {
    shadowRootElement?: ShadowRoot;
  };
  Blocks: { default: [] };
}> {
  get shadowDom() {
    if (this.isFastBoot) {
      return false;
    }

    if (this.args.shadowRootElement) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const config = getOwner(this).resolveRegistration('config:environment') as {
      APP: {
        shadowDom: boolean;
      };
    };

    return config.APP.shadowDom ?? false;
  }

  isFastBoot = isFastBoot;

  get shadowRootElement(): ShadowRoot | null | undefined {
    if (this.args.shadowRootElement) {
      return this.args.shadowRootElement;
    }

    return document.getElementById('shadow-root')?.shadowRoot;
  }

  get getStyles() {
    return [...document.head.querySelectorAll('link')].map((link) => link.href);
  }
}
