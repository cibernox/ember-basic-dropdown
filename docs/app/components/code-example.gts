import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { eq, and } from 'ember-truth-helpers';
import CodeBlock from './code-block';

interface CodeExampleSignature {
  Element: HTMLElement;
  Args: {
    glimmerTs?: string;
    hbs?: string;
    hbs2?: string;
    js?: string;
    css?: string;
    scss?: string;
    activeTab?: string;
    showResult?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class CodeExample extends Component<CodeExampleSignature> {
  @tracked _activeTab: string = '';

  get showResult() {
    return this.args.showResult !== undefined ? this.args.showResult : true;
  }

  get activeTab() {
    return (
      this._activeTab ||
      (this.showResult ? 'result' : this.args.activeTab || 'js')
    );
  }

  @action
  setActiveTab(value: string) {
    this._activeTab = value;
  }

  <template>
    <article class="code-example" ...attributes>
      <nav class="code-example-tabs">
        {{#if @glimmerTs}}
          <div
            class="code-example-tab
              {{if (eq this.activeTab 'glimmer-ts') 'active'}}"
            role="button"
            {{on "click" (fn this.setActiveTab "glimmer-ts")}}
          >Template</div>
        {{/if}}
        {{#if @hbs}}
          <div
            class="code-example-tab {{if (eq this.activeTab 'hbs') 'active'}}"
            role="button"
            {{on "click" (fn this.setActiveTab "hbs")}}
          >Template</div>
        {{/if}}
        {{#if @hbs2}}
          <div
            class="code-sample-tab {{if (eq this.activeTab 'hbs2') 'active'}}"
            role="button"
            {{on "click" (fn this.setActiveTab "hbs2")}}
          >Template 2</div>
        {{/if}}
        {{#if @js}}
          <div
            class="code-example-tab {{if (eq this.activeTab 'js') 'active'}}"
            role="button"
            {{on "click" (fn this.setActiveTab "js")}}
          >Javascript</div>
        {{/if}}
        {{#if @scss}}
          <div
            class="code-example-tab {{if (eq this.activeTab 'scss') 'active'}}"
            role="button"
            {{on "click" (fn this.setActiveTab "scss")}}
          >SCSS</div>
        {{/if}}
        {{#if @css}}
          <div
            class="code-example-tab {{if (eq this.activeTab 'css') 'active'}}"
            role="button"
            {{on "click" (fn this.setActiveTab "css")}}
          >CSS</div>
        {{/if}}
        {{#if this.showResult}}
          <div
            class="code-example-tab
              {{if (eq this.activeTab 'result') 'active'}}"
            role="button"
            {{on "click" (fn this.setActiveTab "result")}}
          >Result</div>
        {{/if}}
      </nav>
      {{#if @glimmerTs}}
        {{#if (eq this.activeTab "glimmer-ts")}}
          <CodeBlock @language="gts" @fileName={{@glimmerTs}} />
        {{/if}}
      {{/if}}
      {{#if @hbs}}
        {{#if (eq this.activeTab "hbs")}}
          <CodeBlock @language="handlebars" @fileName={{@hbs}} />
        {{/if}}
      {{/if}}
      {{#if @hbs2}}
        <CodeBlock @language="handlebars" @fileName={{@hbs2}} />
      {{/if}}
      {{#if @js}}
        {{#if (eq this.activeTab "js")}}
          <CodeBlock @language="js" @fileName={{@js}} />
        {{/if}}
      {{/if}}
      {{#if @scss}}
        {{#if (eq this.activeTab "scss")}}
          <CodeBlock @language="scss" @fileName={{@scss}} />
        {{/if}}
      {{/if}}
      {{#if @css}}
        {{#if (eq this.activeTab "css")}}
          <CodeBlock @language="css" @fileName={{@css}} />
        {{/if}}
      {{/if}}
      {{#if (and this.showResult (has-block))}}
        <div
          class="code-example-snippet result
            {{if (eq this.activeTab 'result') 'active'}}"
        >
          {{yield}}
        </div>
      {{/if}}
    </article>
  </template>
}
