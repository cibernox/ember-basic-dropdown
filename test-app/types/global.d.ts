import '@glint/environment-ember-loose';
import EmberBasicDropdownRegistry from 'ember-basic-dropdown/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends EmberBasicDropdownRegistry {}
}
