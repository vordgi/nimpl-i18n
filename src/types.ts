import { type LoaderProvider, type AdvancedLoader } from "./lib/DataLoader";

export type Translates = { [key: string]: Translates | string };

export type Config = {
  loaderProvider: LoaderProvider;
  unstable_advancedLoader: AdvancedLoader;
};

export type Query = { [key: string]: string | number };

export type ServerTOptions = { query?: Query; parseEntities?: boolean, removeUnusedQueries?: boolean }

export type ClientTOptions = { query?: Query, removeUnusedQueries?: boolean }
