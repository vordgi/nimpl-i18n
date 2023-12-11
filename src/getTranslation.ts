import op from 'object-path';
import getDictionary from './lib/getDictionary';
import injectQuery, { type Query } from './lib/injectQuery';

type GetTranslationReturnType = { t: (term: string, opts?: { query?: Query }) => string; lang: string };

const getTranslation = async (lang: string, namespace?: string): Promise<GetTranslationReturnType> => {
  const dictionary = await getDictionary(lang);
  const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
    const translation = op.get(namespaceDictionary, term);
    if (opts?.query && translation) {
      return injectQuery(term, translation, opts.query);
    }
    return translation || `${namespace ? `${namespace}.` : ''}${term}`;
  };

  return { t, lang };
};

export default getTranslation;
