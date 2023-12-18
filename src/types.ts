export type Translates = { [key: string]: Translates | string };

export type Config = {
  loaders: { [lang: string]: () => Promise<Translates> };
  revalidate: number | false;
};

export type Query = { [key: string]: string | number };

export type ServerTOptions = { query?: Query; parseEntities?: boolean, removeUnusedQueries?: boolean }

export type ClientTOptions = { query?: Query, removeUnusedQueries?: boolean }
