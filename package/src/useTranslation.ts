import { useContext } from "react";
import { type I18nOptions } from "./types";
import { ClientI18nContext } from "./lib/ClientI18nContext";
import injectQuery from "./lib/injectQuery";

type GetTranslationReturnType = { t: (term: string, opts?: I18nOptions) => string; lang: string };

const useTranslation = (namespace?: string): GetTranslationReturnType => {
    const context = useContext(ClientI18nContext);

    if (!context) {
        throw new Error(
            "Please, Init I18nTransmitter for client components - https://nimpl.tech/i18n/usage#client-components",
        );
    }

    const { lang, translates } = context;

    const t: GetTranslationReturnType["t"] = (term, opts) => {
        let termKey: string;
        if (term.includes(":")) {
            termKey = term.replace(":", ".");
        } else {
            termKey = `${namespace ? `${namespace}.` : ""}${term}`;
        }
        const translation = translates[termKey];

        if (!translation) return termKey;

        if (opts?.query) {
            return injectQuery({
                term,
                text: translation,
                query: opts.query,
                removeUnusedQueries: opts.removeUnusedQueries,
            });
        }

        return translation;
    };

    return { t, lang };
};

export default useTranslation;
