import type BasicDropdownComponent from './components/basic-dropdown';
import type BasicDropdownWormholeComponent from './components/basic-dropdown-wormhole';
import type DropdownTriggerModifier from './modifiers/basic-dropdown-trigger';

export default interface EmberBasicDropdownRegistry {
  BasicDropdown: typeof BasicDropdownComponent;
  BasicDropdownWormhole: typeof BasicDropdownWormholeComponent;
  'basic-dropdown-trigger': typeof DropdownTriggerModifier;
}
