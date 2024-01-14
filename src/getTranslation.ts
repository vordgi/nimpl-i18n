import op from 'object-path';
import { type Translates, type ServerTOptions } from './types';
import formatServerTranslate from './lib/formatServerTranslate';
import getConfig from './lib/getConfig';
import { getParams } from 'next-impl-getters/get-params';
import { getPathname } from 'next-impl-getters/get-pathname';

type GetTranslationReturnType = { t: (term: string, opts?: ServerTOptions) => string; lang: string };

const getTranslation = async (lang?: string, namespace?: string): Promise<GetTranslationReturnType> => {
  const config = await getConfig();
  let targetLang = lang;

  if (!targetLang) {
    if (config.getLang) {
      const params = getParams();
      const pathname = getPathname();
      targetLang = config.getLang({ params, pathname });
    } else {
      throw new Error('The language cannot be determined. Please pass the language as argument or add the getLang function to the config file.');
    }
  }

  const dictionary = await config.dataLoader.load<Translates>(targetLang);
  const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
    const translation = op.get(namespaceDictionary, term);
    const termKey = `${namespace ? `${namespace}.` : ''}${term}`;

    if (typeof translation !== 'string' || !translation) return termKey;

    return formatServerTranslate({ term: termKey, text: translation, ...opts });
  };

  return { t, lang: targetLang };
};

export default getTranslation;
