import op from 'object-path';
import getServerContext from 'next-impl-getters/get-server-context';
import { I18nContext } from './lib/I18nContext';
import formatServerTranslate from './lib/formatServerTranslate';
import { type I18nOptions } from './types';

type GetTranslationReturnType = { t: (term: string, opts?: I18nOptions) => string; lang: string };

const getTranslation = (namespace?: string): GetTranslationReturnType => {
  const context = getServerContext(I18nContext);

  if (!context) {
    throw new Error('Please, Init I18nProvider - https://nimpl.tech/i18n/usage#i18nprovider');
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
