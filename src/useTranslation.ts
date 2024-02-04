import { useContext } from 'react';
import { type NextTranslationOptions } from './types';
import { ClientNextTranlationContext } from './lib/ClientNextTranlationContext';
import injectQuery from './lib/injectQuery';

type GetTranslationReturnType = { t: (term: string, opts?: NextTranslationOptions) => string; lang: string };

const useTranslation = (namespace?: string): GetTranslationReturnType => {
  const context = useContext(ClientNextTranlationContext);

  if (!context) {
    throw new Error('Please, Init NextTranlationTransmitter for client components - https://github.com/vordgi/next-translation#client-components');
  }

  const { lang, translates } = context;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
    let termKey: string;
    if (term.includes(':')) {
      termKey = term.replace(':', '.');
    } else {
      termKey = `${namespace ? `${namespace}.` : ''}${term}`;
    }
    const translation = translates[termKey];

    if (!translation) return termKey;

    if (opts?.query) {
      return injectQuery({ term, text: translation, query: opts.query, removeUnusedQueries: opts.removeUnusedQueries });
    }

    return translation;
  };

  return { t, lang };
};

export default useTranslation;
