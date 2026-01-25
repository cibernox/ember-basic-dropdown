// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/environments/ember/authoring-addons

import type BasicDropdownComponent from './components/basic-dropdown';
import type BasicDropdownWormholeComponent from './components/basic-dropdown-wormhole';
import type BasicDropdownContentTrigger from './components/basic-dropdown-trigger';
import type BasicDropdownContentComponent from './components/basic-dropdown-content';
import type DropdownTriggerModifier from './modifiers/basic-dropdown-trigger';

export default interface Registry {
  BasicDropdown: typeof BasicDropdownComponent;
  BasicDropdownWormhole: typeof BasicDropdownWormholeComponent;
  BasicDropdownTrigger: typeof BasicDropdownContentTrigger;
  BasicDropdownContent: typeof BasicDropdownContentComponent;
  'basic-dropdown-trigger': typeof DropdownTriggerModifier;
}
