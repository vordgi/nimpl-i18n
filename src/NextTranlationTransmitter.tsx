import React from 'react';
import op from 'object-path';
import getServerContext from 'next-impl-getters/get-server-context';
import { NextTranlationContext } from './lib/NextTranlationContext';
import { type NextTranslationOptions, type Translates } from './types';
import ClientNextTranlationProvider from './lib/ClientNextTranlationProvider';
import formatServerTranslate from './lib/formatServerTranslate';

export type NextTranlationTransmitterProps = {
  terms: (string | [string, NextTranslationOptions])[];
  children: React.ReactNode;
  cleanThread?: boolean;
};

type ClientTranslates = { [key: string]: string };

const formatServerTranslates = (result: ClientTranslates, targetKey: string, translates: string | Translates, opts: NextTranslationOptions = {}) => {
  if (!translates) return;

  if (typeof translates === 'string') {
    // eslint-disable-next-line no-param-reassign
    result[targetKey] = formatServerTranslate({ term: targetKey, text: translates, parseEntities: true, ...opts });
  } else {
    Object.entries(translates).forEach(([subKey, translate]) => {
      formatServerTranslates(result, `${targetKey}.${subKey}`, translate, opts);
    });
  }
};

const NextTranlationTransmitter: React.FC<NextTranlationTransmitterProps> = async ({ terms, children, cleanThread }) => {
  const context = getServerContext(NextTranlationContext);

  if (!context) {
    throw new Error('Please, Init NextTranlationProvider - https://github.com/vordgi/next-translation#server-components');
  }

  const { dictionary, lang } = context;

  const result: { [key: string]: string } = {};
  terms.forEach((term) => {
    if (Array.isArray(term)) {
      const [termKey, opts] = term;
      const translates = op.get(dictionary, termKey) as Translates;
      formatServerTranslates(result, termKey, translates, opts);
    } else {
      const translates = op.get(dictionary, term) as Translates;
      formatServerTranslates(result, term, translates);
    }
  });

  return (
    <ClientNextTranlationProvider lang={lang} translates={result} cleanThread={cleanThread}>
      {children}
    </ClientNextTranlationProvider>
  );
};

export default NextTranlationTransmitter;
