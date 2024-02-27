import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

export default class ShadowComponent extends Component<{
  Element: HTMLDivElement;
  Blocks: { default: [] };
}> {
  @tracked shadow: HTMLDivElement | undefined;

  setShadow = (shadowRoot: HTMLDivElement) => {
    this.shadow = shadowRoot;
  };

  get getStyles() {
    return [...document.head.querySelectorAll('link')].map((link) => link.href);
  }

  attachShadow = modifier(
    (element: Element, [set]: [(shadowRoot: ShadowRoot) => void]) => {
      const shadow = element.attachShadow({ mode: 'open' });
      set(shadow);
    },
  );
}
