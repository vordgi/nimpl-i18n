import React from 'react';
import op from 'object-path';
import { type ServerTOptions } from './types';
import NextTranlationProvider from './NextTranlationProvider';
import getDictionary from './lib/getDictionary';
import formatServerTranslate from './lib/formatServerTranslate';

type WithNextTranlationProps = {
  terms: (string | [string, ServerTOptions])[];
  lang: string;
  children: React.ReactNode;
};

type Translates = string | { [key: string]: Translates };

type ClientTranslates = { [key: string]: string };

const formatServerTranslates = (ref: ClientTranslates, targetKey: string, translates: string | Translates, opts: ServerTOptions = {}) => {
  if (!translates) return;

  if (typeof translates === 'string') {
    // eslint-disable-next-line no-param-reassign
    ref[targetKey] = formatServerTranslate({ term: targetKey, text: translates, isTransmitter: true, ...opts });
  } else {
    Object.entries(translates).forEach(([subKey, translate]) => {
      formatServerTranslates(ref, `${targetKey}.${subKey}`, translate, opts);
    });
  }
};

const WithNextTranlation: React.FC<WithNextTranlationProps> = async ({ terms, children, lang }) => {
  const dictionary = await getDictionary(lang);

  const ref: { [key: string]: string } = {};
  terms.forEach((term) => {
    if (Array.isArray(term)) {
      const [termKey, opts] = term;
      const translates = op.get(dictionary, termKey) as Translates;
      formatServerTranslates(ref, termKey, translates, opts);
    } else {
      const translates = op.get(dictionary, term) as Translates;
      formatServerTranslates(ref, term, translates);
    }
  });

  return (
    <NextTranlationProvider lang={lang} translates={ref}>
      {children}
    </NextTranlationProvider>
  );
};

export default WithNextTranlation;
