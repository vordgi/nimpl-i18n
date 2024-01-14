import { type LoaderProvider, type AdvancedLoader } from "./lib/DataLoader";

export type Translates = { [key: string]: Translates | string };

export type GetLangOpts = { pathname: string | null, params: {[key: string]: string | string[]} }

export type Config = {
  loaderProvider: LoaderProvider;
  getLang: (opts: GetLangOpts) => string;
  unstable_advancedLoader: AdvancedLoader;
};

export type Query = { [key: string]: string | number };

export type ServerTOptions = { query?: Query; parseEntities?: boolean, removeUnusedQueries?: boolean }

export type ClientTOptions = { query?: Query, removeUnusedQueries?: boolean }
