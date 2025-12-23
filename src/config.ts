export interface Config {
  destination?: string;
  rootElement: string;
}

let _config: Config = {
  rootElement: '',
};

let configSet = false;

export function setConfig(config: Config) {
  if (!config.rootElement) {
    throw new Error(
      "ember-basic-dropdown: 'rootElement' is required in the config. See installation instructions for more details.",
    );
  }

  _config = config;
  configSet = true;
}

export function getConfig(): Config {
  if (!configSet) {
    throw new Error(
      'ember-basic-dropdown: setConfig was not called before accessing config. See installation instructions for more details.',
    );
  }

  return _config;
}
