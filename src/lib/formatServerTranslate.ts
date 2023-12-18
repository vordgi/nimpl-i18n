import { decode } from "html-entities";
import injectQuery, { type InjectQueryArg } from "./injectQuery";

interface FormatServerTranslateArg extends Omit<InjectQueryArg, 'query'> {
    parseEntities?: boolean;
    query?: InjectQueryArg['query'];
}

const formatServerTranslate = ({ term, text, removeUnusedQueries, query, parseEntities, isTransmitter }: FormatServerTranslateArg) => {
    let newTranslate = text;
    if (query) {
        newTranslate = injectQuery({ term, text: newTranslate, query, removeUnusedQueries, isTransmitter });
    }
    if (parseEntities === undefined || parseEntities === true) {
        newTranslate = decode(newTranslate, { scope: 'strict' });
    }
    return newTranslate;
}

export default formatServerTranslate;
