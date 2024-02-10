import op from 'object-path';
import formatServerTranslate from './lib/formatServerTranslate';
import { type NextTranslationOptions } from './types';
import getDictionary from './lib/getDictionary';

type CreateTranslationReturnType = { t: (term: string, opts?: NextTranslationOptions) => string; lang: string };

const createTranslation = async (lang: string, namespace?: string): Promise<CreateTranslationReturnType> => {
  const dictionary = await getDictionary(lang);
  const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

  const t: CreateTranslationReturnType['t'] = (term, opts) => {
    let termDictionary = namespaceDictionary;
    let termNamespace = namespace;
    let termKey: string = term;

    if (term.includes(':')) {
      [termNamespace, termKey] = term.split(':');
      termDictionary = op.get(dictionary, termNamespace);
    }

    const translation = op.get(namespaceDictionary, termKey);
    const fullTerm = `${termNamespace ? `${termNamespace}.` : ''}${termKey}`;

    if (typeof translation !== 'string' || !translation) return fullTerm;

    return formatServerTranslate({ term: fullTerm, text: translation, parseEntities: true, ...opts });
  };

  return { t, lang };
};

export default createTranslation;
