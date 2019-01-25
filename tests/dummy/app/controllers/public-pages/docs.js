import { inject as service } from "@ember/service"
import { computed } from '@ember/object';
import Controller from '@ember/controller';

const groupedSections = [
  {
    groupName: 'Getting started',
    options: [
      { route: 'public-pages.docs.index',              text: 'Overview' },
      { route: 'public-pages.docs.installation',       text: 'Installation' },
      { route: 'public-pages.docs.how-to-use-it',      text: 'How to use it' },
      { route: 'public-pages.docs.dropdown-events',    text: 'Dropdown events' },
      { route: 'public-pages.docs.trigger-events',     text: 'Trigger events' },
      { route: 'public-pages.docs.content-events',     text: 'Content events' }
    ]
  },
  {
    groupName: 'Basic customization',
    options: [
      { route: 'public-pages.docs.position',         text: 'Position' },
      { route: 'public-pages.docs.disabled',         text: 'Disabled' },
      { route: 'public-pages.docs.overlays',         text: 'Overlays' },
      { route: 'public-pages.docs.styles',           text: 'Styles' }
    ]
  },
  {
    groupName: 'Advanced customization',
    options: [
      { route: 'public-pages.docs.custom-position', text: 'Custom position' }
    ]
  },
  {
    groupName: 'Other',
    options: [
      { route: 'public-pages.docs.test-helpers', text: 'Test helpers' },
      { route: 'public-pages.docs.api-reference', text: 'API reference' }
    ]
  }
];

export default Controller.extend({
  router: service(),
  groupedSections,

  currentSection: computed('router.currentRouteName', function() {
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
  }),

  actions: {
    visit(routeName) {
      this.transitionToRoute(routeName);
    }
  }
});
