import '@glint/environment-ember-loose';
import type EmberBasicDropdownRegistry from 'ember-basic-dropdown/template-registry';
import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberBasicDropdownRegistry,
      EmberTruthRegistry {}
}
