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
//# sourceMappingURL=template-registry.d.ts.map