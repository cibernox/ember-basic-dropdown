export interface Config {
  destination?: string;
  rootElement?: string;
}

let _config: Config = {};

// This will be removed in next major, don't use this outside the package!
let _configSet = false;

export function setConfig(config: Config) {
  _config = config;
  _configSet = true;
}

export { _config as config, _configSet };
