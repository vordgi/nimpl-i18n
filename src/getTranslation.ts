import op from 'object-path';
import getDictionary from './lib/getDictionary';
import injectQuery, { type Query } from './lib/injectQuery';

type GetTranslationReturnType = { t: (term: string, opts?: { query?: Query }) => string; lang: string };

const getTranslation = async (lang: string, namespace?: string): Promise<GetTranslationReturnType> => {
  const dictionary = await getDictionary(lang);
  const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
    const translation = op.get(namespaceDictionary, term);
    const fullKey = `${namespace ? `${namespace}.` : ''}${term}`;

    if (typeof translation !== 'string' || !translation) return fullKey;

    if (opts?.query) {
      return injectQuery(term, translation, opts.query);
    }

    return translation;
  };

  return { t, lang };
};

export default getTranslation;
