import { type Translates } from '../types';

const getDictionary = async (lang: string): Promise<Translates> => {
  const dataResp = await (globalThis as any)._nextOriginalFetch(`http://localhost:${process.env.NEXT_TRANSLATION_CACHE_PORT}/?secret=${process.env.NEXT_TRANSLATION_CACHE_SECRET}&lang=${lang}`, { cache: 'no-cache' });
  const data = await dataResp.json();

  return data;
};

export default getDictionary;
