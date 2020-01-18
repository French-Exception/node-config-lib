import * as path from "path";
import * as mkdirp from "mkdirp"
import * as fs from "fs-extra"

export class ConfigurationInit {
    public async init(configFile: string): Promise<void> {
        const $ = {
            imports: [],
            ns: null,
            $: {
                "foo": "bar"
            }
        };


        await mkdirp(path.dirname(configFile));
        const $str = JSON.stringify($, null, 2);
        await fs.writeFile(configFile, $str);
    }
}
