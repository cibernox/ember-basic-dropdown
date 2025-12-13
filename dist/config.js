let _config = {};

// This will be removed in next major, don't use this outside the package!
let _configSet = false;
function setConfig(config) {
  _config = config;
  _configSet = true;
}

export { _configSet, _config as config, setConfig };
//# sourceMappingURL=config.js.map
