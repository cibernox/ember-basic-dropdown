import { service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';

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

export default class extends Controller {
  @service router;
  groupedSections = groupedSections;

  get currentSection() {
    let currentRouteName = this.router.currentRouteName;
    for (let i = 0; i < groupedSections.length; i++) {
      let group = groupedSections[i];
      for (let j = 0; j < group.options.length; j++) {
        let section = group.options[j];
        if (section.route === currentRouteName) {
          return section;
        }
      }
    }
    return undefined;
  }

  @action
  visit(e) {
    this.router.transitionTo(e.target.value);
  }
}
