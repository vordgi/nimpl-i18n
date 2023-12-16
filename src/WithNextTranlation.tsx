import React from 'react';
import NextTranlationProvider from './NextTranlationProvider';
import getDictionary from './lib/getDictionary';
import op from 'object-path';
import injectQuery, { type Query } from './lib/injectQuery';

type WithNextTranlationProps = {
  terms: (string | [string, Query])[];
  lang: string;
  children: React.ReactNode;
};

type Translates = string | { [key: string]: Translates };

type ClientTranslates = { [key: string]: string };

const formatTranslates = (ref: ClientTranslates, targetKey: string, translates: string | Translates, query?: Query) => {
  if (!translates) return;

  if (typeof translates === 'string') {
    // eslint-disable-next-line no-param-reassign
    ref[targetKey] = query ? injectQuery(targetKey, translates, query) : translates;
  } else {
    Object.entries(translates).forEach(([subKey, translate]) => {
      formatTranslates(ref, `${targetKey}.${subKey}`, translate, query);
    });
  }
};

const WithNextTranlation: React.FC<WithNextTranlationProps> = async ({ terms, children, lang }) => {
  const dictionary = await getDictionary(lang);

  const ref: { [key: string]: string } = {};
  terms.forEach((term) => {
    if (Array.isArray(term)) {
      const translates = op.get(dictionary, term[0]) as Translates;
      formatTranslates(ref, term[0], translates, term[1]);
    } else {
      const translates = op.get(dictionary, term) as Translates;
      formatTranslates(ref, term, translates);
    }
  });

  return (
    <NextTranlationProvider lang={lang} translates={ref}>
      {children}
    </NextTranlationProvider>
  );
};

export default WithNextTranlation;
