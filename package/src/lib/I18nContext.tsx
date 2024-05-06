import createServerContext from "@nimpl/getters/create-server-context";

type I18nContextType = {
    lang: string;
} | null;

export const I18nContext = createServerContext<I18nContextType>(null);
