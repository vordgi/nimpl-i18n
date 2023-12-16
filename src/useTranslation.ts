import { useContext } from 'react';
import { NextTranlationContext } from './NextTranlationContext';
import injectQuery, { type Query } from './lib/injectQuery';

type GetTranslationReturnType = { t: (term: string, opts?: { query?: Query }) => string; lang: string };

const useTranslation = (namespace?: string): GetTranslationReturnType => {
  const nextTranslation = useContext(NextTranlationContext);

  if (!nextTranslation) {
    throw new Error('Please, Init WithNextTranslation - https://github.com/vordgi/next-translation#client-components');
  }

  const { lang, translates } = nextTranslation;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
    const termKey = `${namespace ? `${namespace}.` : ''}${term}`;
    const translation = translates[termKey];
    if (opts?.query && translation) {
      return injectQuery(term, translation, opts.query);
    }
    return translation || `${namespace ? `${namespace}.` : ''}${term}`;
  };

  return { t, lang };
};

export default useTranslation;
