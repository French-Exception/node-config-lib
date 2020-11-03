"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs-extra");
const Configuration_1 = require("./Configuration");
class ConfigurationInit {
    async init(configFile) {
        const $ = {
            imports: [],
            ns: null,
            $: {
                "version": Configuration_1.VERSION
            }
        };
        await mkdirp(path.dirname(configFile));
        const $str = JSON.stringify($, null, 2);
        await fs.writeFile(configFile, $str);
    }
}
exports.ConfigurationInit = ConfigurationInit;
//# sourceMappingURL=ConfigurationInit.js.map