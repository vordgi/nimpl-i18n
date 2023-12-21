import getConfig from './getConfig';
import { type Translates } from '../types';

const getDictionary = async (lang: string): Promise<Translates> => {
  const config = await getConfig();
  const data = await config.dataLoader.load<Translates>(lang);
  return data;
};

export default getDictionary;
