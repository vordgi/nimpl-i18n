import getConfig from './getConfig';
import { type Translates } from '../types';

const cachedLoaders: { [lang: string]: Promise<Translates> } = {};
const devCached: { [lang: string]: { loader: Promise<Translates>; ts: number; loaded: boolean } } = {};

const getDictionary = async (lang: string): Promise<Translates> => {
  const config = await getConfig();
  if (!config.loaders[lang]) {
    throw new Error(`Can't find loader for ${lang}`);
  }
  if (typeof config.revalidate === 'number') {
    const targetTs = +new Date();
    if (!devCached[lang] || (devCached[lang].loaded && targetTs > devCached[lang].ts + (1000 * config.revalidate))) {
      devCached[lang] = {
        ts: targetTs,
        loader: config.loaders[lang](),
        loaded: false,
      };
    }
    const data = await devCached[lang].loader;
    devCached[lang].loaded = true;
    return data;
  }

  if (!cachedLoaders[lang]) {
    cachedLoaders[lang] = config.loaders[lang]();
  }
  const data = await cachedLoaders[lang];
  return data;
};

export default getDictionary;
