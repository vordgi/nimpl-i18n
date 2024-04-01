import { type Translates } from '../types';

const getDictionary = async (lang: string): Promise<Translates> => {
  const origFetch = (globalThis as any)._nextOriginalFetch || fetch;
  const dataResp = await origFetch(`http://localhost:${process.env.I18N_CACHE_PORT}/?secret=${process.env.I18N_CACHE_SECRET}&lang=${lang}`, { cache: 'no-cache' });
  const data = await dataResp.json();

  return data;
};

export default getDictionary;
