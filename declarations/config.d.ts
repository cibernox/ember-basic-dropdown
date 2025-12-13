export interface Config {
    destination?: string;
    rootElement?: string;
}
declare let _config: Config;
declare let _configSet: boolean;
export declare function setConfig(config: Config): void;
export { _config as config, _configSet };
//# sourceMappingURL=config.d.ts.map