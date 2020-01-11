export interface ConfigurationLoadingRequestInterface {
    file: string;
    path: string;
    env: Map<string, string | number | object>;
    base: object;
    parametersExtractor: (string: string) => Promise<boolean>;
    stringInterpolator: (string: string) => Promise<string>;
}
