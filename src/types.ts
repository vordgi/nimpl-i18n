export type Translates = { [key: string]: Translates | string };

export type Config = {
  loaders: { [lang: string]: () => Promise<Translates> };
  revalidate: number | false;
};
