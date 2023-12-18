import op from 'object-path';
import { type ServerTOptions } from './types';
import getDictionary from './lib/getDictionary';
import formatServerTranslate from './lib/formatServerTranslate';

type GetTranslationReturnType = { t: (term: string, opts?: ServerTOptions) => string; lang: string };

const getTranslation = async (lang: string, namespace?: string): Promise<GetTranslationReturnType> => {
  const dictionary = await getDictionary(lang);
  const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
    const translation = op.get(namespaceDictionary, term);
    const termKey = `${namespace ? `${namespace}.` : ''}${term}`;

    if (typeof translation !== 'string' || !translation) return termKey;

    return formatServerTranslate({ term: termKey, text: translation, ...opts });
  };

  return { t, lang };
};

export default getTranslation;
