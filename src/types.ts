export type Translates = { [key: string]: Translates | string };

export type GetLangOpts = { pathname: string | null, params: {[key: string]: string | string[]} }

export type Query = { [key: string]: string | number };

export type NextTranslationOptions = { query?: Query, removeUnusedQueries?: boolean }

export type NextTranlationContextType = { lang: string; translates: { [key: string]: string } } | null;