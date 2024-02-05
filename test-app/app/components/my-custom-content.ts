import Component from '@glimmer/component';

export interface MyCustomContentSignature {
  Element: Element;
}

export default class MyCustomContentComponent extends Component<MyCustomContentSignature> {}
