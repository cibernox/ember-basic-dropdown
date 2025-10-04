import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import { eq } from 'ember-truth-helpers';

const groupedSections = [
  {
    id: 'getting-started',
    groupName: 'Getting started',
    options: [
      { route: 'public-pages.docs.index', text: 'Overview' },
      { route: 'public-pages.docs.installation', text: 'Installation' },
      { route: 'public-pages.docs.how-to-use-it', text: 'How to use it' },
      { route: 'public-pages.docs.dropdown-events', text: 'Dropdown events' },
      { route: 'public-pages.docs.trigger-events', text: 'Trigger events' },
      { route: 'public-pages.docs.content-events', text: 'Content events' },
    ],
  },
  {
    id: 'basic-customization',
    groupName: 'Basic customization',
    options: [
      { route: 'public-pages.docs.position', text: 'Position' },
      { route: 'public-pages.docs.disabled', text: 'Disabled' },
      { route: 'public-pages.docs.overlays', text: 'Overlays' },
      { route: 'public-pages.docs.styles', text: 'Styles' },
    ],
  },
  {
    id: 'advanced-customization',
    groupName: 'Advanced customization',
    options: [
      { route: 'public-pages.docs.custom-position', text: 'Custom position' },
      { route: 'public-pages.docs.animations', text: 'Animations' },
    ],
  },
  {
    id: 'upgrade',
    groupName: 'Upgrade',
    options: [
      {
        route: 'public-pages.docs.migrate-7-0-to-8-0',
        text: 'Migrate from 7.0 to 8.0',
      },
    ],
  },
  {
    id: 'other',
    groupName: 'Other',
    options: [
      { route: 'public-pages.docs.test-helpers', text: 'Test helpers' },
      { route: 'public-pages.docs.api-reference', text: 'API reference' },
    ],
  },
];

export default class extends Component {
  @service declare router: RouterService;
  groupedSections = groupedSections;

  get currentSection() {
    const currentRouteName = this.router.currentRouteName;
    for (let i = 0; i < groupedSections.length; i++) {
      const group = groupedSections[i];
      if (group) {
        for (let j = 0; j < group.options.length; j++) {
          const section = group.options[j];
          if (section) {
            if (section.route === currentRouteName) {
              return section;
            }
          }
        }
      }
    }

    return undefined;
  }

  @action
  visit(e: Event) {
    const value = (e.target as HTMLSelectElement | null)?.value ?? '';
    this.router.transitionTo(value);
  }

  <template>
    <section class="docs">
      <nav class="side-nav">
        {{#each this.groupedSections key="id" as |group|}}
          <header class="side-nav-header" id={{group.id}}>
            {{group.groupName}}
          </header>
          {{#each group.options key="route" as |option|}}
            <LinkTo
              @route={{option.route}}
              @current-when={{option.route}}
              class="side-nav-link"
            >
              {{option.text}}
            </LinkTo>
          {{/each}}
        {{/each}}
      </nav>
      <section class="doc-page">
        <select class="section-selector" {{on "change" this.visit}}>
          {{#each this.groupedSections key="id" as |group|}}
            <optgroup label={{group.groupName}}>
              {{#each group.options key="route" as |section|}}
                <option
                  value={{section.route}}
                  selected={{eq section.route this.currentSection.route}}
                >
                  {{section.text}}
                </option>
              {{/each}}
            </optgroup>
          {{/each}}
        </select>
        {{outlet}}
      </section>
    </section>
  </template>
}
