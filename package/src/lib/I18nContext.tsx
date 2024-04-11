import createServerContext from "next-impl-getters/create-server-context";
import { type Translates } from "../types";

type I18nContextType = {
    lang: string;
    dictionary: Translates;
} | null;

export const I18nContext = createServerContext<I18nContextType>(null);
