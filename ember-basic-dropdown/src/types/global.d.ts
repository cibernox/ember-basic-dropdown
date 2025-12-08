import '@glint/environment-ember-loose';

import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';
import type EmberElementHelperRegistry from 'ember-element-helper/template-registry';

// export interface StyleHelperRegistry {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }

// export interface ReadonlyRegistry {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends
      EmberTruthRegistry,
      EmberElementHelperRegistry /* other registries here */ {
    // ...
  }
}
