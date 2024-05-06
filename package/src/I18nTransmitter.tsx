import React from "react";
import op from "object-path";
import getServerContext from "@nimpl/getters/get-server-context";
import { I18nContext } from "./lib/I18nContext";
import { type I18nOptions, type Translates } from "./types";
import ClientI18nProvider from "./lib/ClientI18nProvider";
import formatServerTranslate from "./lib/formatServerTranslate";
import getDictionary from "./lib/getDictionary";

export type I18nTransmitterProps = {
    terms: (string | [string, I18nOptions])[];
    children: React.ReactNode;
    cleanThread?: boolean;
};

type ClientTranslates = { [key: string]: string };

const formatServerTranslates = (
    result: ClientTranslates,
    targetKey: string,
    translates: string | Translates,
    opts: I18nOptions = {},
) => {
    if (!translates) return;

    if (typeof translates === "string") {
        // eslint-disable-next-line no-param-reassign
        result[targetKey] = formatServerTranslate({ term: targetKey, text: translates, parseEntities: true, ...opts });
    } else {
        Object.entries(translates).forEach(([subKey, translate]) => {
            formatServerTranslates(result, `${targetKey}.${subKey}`, translate, opts);
        });
    }
};

const I18nTransmitter: React.FC<I18nTransmitterProps> = async ({ terms, children, cleanThread }) => {
    const context = getServerContext(I18nContext);

    if (!context) {
        throw new Error("Please, Init I18nProvider - https://github.com/vordgi/nimpl-i18n#server-components");
    }

    const { lang } = context;
    const dictionary = await getDictionary(lang);

    const result: { [key: string]: string } = {};
    terms.forEach((term) => {
        if (Array.isArray(term)) {
            const [termKey, opts] = term;
            const translates = op.get(dictionary, termKey) as Translates;
            formatServerTranslates(result, termKey, translates, opts);
        } else {
            const translates = op.get(dictionary, term) as Translates;
            formatServerTranslates(result, term, translates);
        }
    });

    return (
        <ClientI18nProvider lang={lang} translates={result} cleanThread={cleanThread}>
            {children}
        </ClientI18nProvider>
    );
};

export default I18nTransmitter;
