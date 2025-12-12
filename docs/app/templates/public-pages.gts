import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import calculatePosition, {
  type CalculatePositionOptions,
  type CalculatePositionResult,
} from 'ember-basic-dropdown/utils/calculate-position';
import { LinkTo } from '@ember/routing';
import BasicDropdown, {
  type BasicDropdownDefaultBlock,
} from 'ember-basic-dropdown/components/basic-dropdown';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type RouterService from '@ember/routing/router-service';

const colors = ['orange', 'blue', 'purple', 'line', 'pink', 'red', 'brown'];
const brands = colors.map((c) => `${c}-brand`);

export default class extends Component {
  @service declare router: RouterService;

  colors = colors;
  backgrounds = this.colors.map((c) => htmlSafe(`background-color: ${c}`));
  color = undefined;

  // Actions
  @action
  preventIfNotInIndex(e: Event) {
    if (this.router.currentRouteName !== 'public-pages.index') {
      e.stopImmediatePropagation();
    }
  }

  setBrandColor(color: string, dropdown: BasicDropdownDefaultBlock<'span'>) {
    brands.forEach((klass) => document.body.classList.remove(klass));
    document.body.classList.add(`${color}-brand`);
    dropdown.actions.close();
  }

  // Methods
  calculatePosition(
    trigger: HTMLElement,
    content: HTMLElement,
    destination: HTMLElement,
    options: CalculatePositionOptions,
  ): CalculatePositionResult {
    const pos = calculatePosition(trigger, content, destination, options);

    if (pos.style.top) {
      pos.style.top += 3;
    } else {
      pos.style.top = 3;
    }

    return pos;
  }

  <template>
    <header class="main-header">
      <nav class="main-header-nav">
        <div class="main-header-nav-links">
          <LinkTo
            @route="public-pages.docs"
            class="main-header-nav-link"
          >Docs</LinkTo>
          <LinkTo
            @route="public-pages.cookbook"
            class="main-header-nav-link"
          >Cookbook</LinkTo>
          <a
            href="https://github.com/cibernox/ember-basic-dropdown"
            class="main-header-nav-link"
          >Github</a>
        </div>
        <div class="main-header-logo">
          <BasicDropdown @triggerHtmlTag="span" @calculatePosition={{this.calculatePosition}} as |dd|>
            <LinkTo @route="public-pages.index" class="home-link">
              <img src="/ember_logo.png" alt="ember" />
              <strong>Basic</strong>
              {{! template-lint-disable no-pointer-down-event-binding }}
              <dd.Trigger
                {{on "mousedown" this.preventIfNotInIndex}}
                {{on "touchend" this.preventIfNotInIndex}}
                class="logo-dropdown-button"
              >
                Dropdown
              </dd.Trigger>
            </LinkTo>
            <dd.Content class="logo-dropdown-content">
              {{#each this.colors as |color|}}
                <button
                  type="button"
                  class="logo-dropdown-content-pantone-entry {{color}}"
                  {{on "click" (fn this.setBrandColor color dd)}}
                ></button>
              {{/each}}
            </dd.Content>
          </BasicDropdown>
        </div>
      </nav>
    </header>
    <div class="main-content">
      {{outlet}}
    </div>
    <footer class="main-footer">
      <div class="main-footer-content">
        Deployed with love by
        <a href="http://github.com/cibernox">Miguel Camba</a>
      </div>
    </footer>
  </template>
}
