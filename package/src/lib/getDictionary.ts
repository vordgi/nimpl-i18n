import getConfig from "../configuration/getConfig";
import { type Translates } from "../types";

const getDictionary = async (lang: string): Promise<Translates> => {
    const config = await getConfig();

    if (!lang || !config.languages.includes(lang)) {
        throw new Error(`Can\' load data for language "${lang}", valid languages are: ${config.languages.join(", ")}`);
    }

    const { data } = await config.load(lang);
    return data as Translates;
};

export default getDictionary;
