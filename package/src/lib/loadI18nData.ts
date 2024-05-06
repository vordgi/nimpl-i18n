import getConfig from "../configuration/getConfig";
import { type Translates } from "../types";
import { getPathname } from "@nimpl/getters/get-pathname";
import { getParams } from "@nimpl/getters/get-params";

const loadI18nData = async (): Promise<{ dictionary: Translates; language: string }> => {
    const config = await getConfig();
    const language = await config.getLanguage({ pathname: getPathname(), params: getParams() });

    if (!language || !config.languages.includes(language)) {
        throw new Error(
            `Can\' load data for language "${language}", valid languages are: ${config.languages.join(", ")}`,
        );
    }

    const { data } = await config.load(language);
    return { dictionary: data as Translates, language };
};

export default loadI18nData;
