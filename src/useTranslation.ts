import { useContext } from 'react';
import { type ClientTOptions } from './types';
import { NextTranlationContext } from './NextTranlationContext';
import injectQuery from './lib/injectQuery';

type GetTranslationReturnType = { t: (term: string, opts?: ClientTOptions) => string; lang: string };

const useTranslation = (namespace?: string): GetTranslationReturnType => {
  const nextTranslation = useContext(NextTranlationContext);

  if (!nextTranslation) {
    throw new Error('Please, Init WithNextTranslation - https://github.com/vordgi/next-translation#client-components');
  }

  const { lang, translates } = nextTranslation;

  const t: GetTranslationReturnType['t'] = (term, opts) => {
    const termKey = `${namespace ? `${namespace}.` : ''}${term}`;
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
