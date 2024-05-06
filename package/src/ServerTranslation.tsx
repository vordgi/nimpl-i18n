import React from "react";
import { type I18nOptions } from "./types";
import Translation from "./lib/Translation";
import getTranslation from "./getTranslation";

type ServerTranslationProps = {
    term: string;
    components?: { [key: string]: JSX.Element };
    query?: I18nOptions["query"];
    removeUnusedQueries?: I18nOptions["removeUnusedQueries"];
    language?: string;
};

const ServerTranslation: React.FC<ServerTranslationProps> = async ({
    term,
    components,
    query,
    removeUnusedQueries,
    language,
}) => {
    const { t } = await getTranslation({ language });
    const text = t(term, { query, removeUnusedQueries });

    return <Translation term={term} text={text} components={components} />;
};

export default ServerTranslation;
