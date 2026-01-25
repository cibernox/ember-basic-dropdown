export interface Config {
  destination?: string;
  rootElement?: string;
}

let _config: Config = {};

export function setConfig(config: Config) {
  _config = config;
}

export function getConfig(): Config {
  return _config;
}
