import op from 'object-path';
import getServerContext from 'next-impl-getters/get-server-context';
import { NextTranlationContext } from './lib/NextTranlationContext';
import formatServerTranslate from './lib/formatServerTranslate';
import { type NextTranslationOptions } from './types';

type GetTranslationReturnType = { t: (term: string, opts?: NextTranslationOptions) => string; lang: string };

const getTranslation = (namespace?: string): GetTranslationReturnType => {
  const context = getServerContext(NextTranlationContext);

  if (!context) {
    throw new Error('Please, Init NextTranlationProvider - https://github.com/vordgi/next-translation#server-components');
  }

  const { dictionary, lang } = context;

  const namespaceDictionary = namespace ? op.get(dictionary, namespace) : dictionary;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
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

export default getTranslation;
