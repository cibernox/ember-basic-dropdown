/**
 * Type declarations for
 *    import config from 'test-app/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none';
  rootURL: string;
  APP: Record<string, unknown>;
  'ember-basic-dropdown': Record<string, unknown>;
};

export default config;
