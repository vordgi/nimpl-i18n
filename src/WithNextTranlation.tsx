import React from 'react';
import op from 'object-path';
import { type ServerTOptions, type Translates } from './types';
import NextTranlationProvider from './NextTranlationProvider';
import formatServerTranslate from './lib/formatServerTranslate';
import getConfig from './lib/getConfig';
import { getParams } from 'next-impl-getters/get-params';
import { getPathname } from 'next-impl-getters/get-pathname';
import { getSearchParams } from 'next-impl-getters/get-search-params';

type WithNextTranlationProps = {
  terms: (string | [string, ServerTOptions])[];
  lang?: string;
  children: React.ReactNode;
};

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
  const config = await getConfig();
  let targetLang = lang;

  if (!targetLang) {
    if (config.getLang) {
      const params = getParams();
      const pathname = getPathname();
      targetLang = config.getLang({ params, pathname });
    } else {
      throw new Error('The language cannot be determined. Please pass the language as prop or add the getLang function to the config file.');
    }
  }

  const dictionary = await config.dataLoader.load<Translates>(targetLang);

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
    <NextTranlationProvider lang={targetLang} translates={ref}>
      {children}
    </NextTranlationProvider>
  );
};

export default WithNextTranlation;
