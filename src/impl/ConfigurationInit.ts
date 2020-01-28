import * as path from "path"
import * as mkdirp from "mkdirp"
import * as fs from "fs-extra"
import {VERSION} from "./Configuration"

export class ConfigurationInit {
    public async init(configFile: string): Promise<void> {
        const $ = {
            imports: [],
            ns: null,
            $: {
                "version": VERSION
            }
        }

        await mkdirp(path.dirname(configFile))
        const $str = JSON.stringify($, null, 2)
        await fs.writeFile(configFile, $str)
    }
}
