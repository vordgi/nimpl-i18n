import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { type Config } from "./types";

const CONFIG_PATH = path.join(process.cwd(), "nimpl-i18n.js");
// Crutch bypass of conversion by the assembler to require
const dynamicImport = new Function("p", "return import(p)");

const getConfig = async (): Promise<Config> => {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const config: { default: Config } = await dynamicImport(pathToFileURL(CONFIG_PATH).href);
            const { load, getLanguage, languages } = config.default;

            if (!load) {
                throw new Error(
                    `Can't find "load" method in configuration file - https://github.com/vordgi/nimpl-i18n#configuration`,
                );
            }

            if (!languages) {
                throw new Error(
                    `Can't find "languages" list in configuration file - https://github.com/vordgi/nimpl-i18n#configuration`,
                );
            }

            if (!getLanguage) {
                throw new Error(
                    `Can't find "getLanguage" method in configuration file - https://github.com/vordgi/nimpl-i18n#configuration`,
                );
            }

            return config.default;
        } else {
            throw new Error(
                `Can't load config from "${CONFIG_PATH}". Read more - https://github.com/vordgi/nimpl-i18n#configuration`,
            );
        }
    } catch (err) {
        throw err;
    }
};

export default getConfig;
