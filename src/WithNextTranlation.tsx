import React from 'react';
import NextTranlationProvider from './NextTranlationProvider';
import getTranslation from './getTranslation';

type WithNextTranlationProps = {
  terms: string[];
  lang: string;
  children: React.ReactNode;
};

type Translates = string | { [key: string]: Translates };

type ClientTranslates = { [key: string]: string };

const formatTranslates = (ref: ClientTranslates, targetKey: string, translates: string | Translates) => {
  if (typeof translates === 'string') {
    // eslint-disable-next-line no-param-reassign
    ref[targetKey] = translates;
  } else {
    Object.entries(translates).forEach(([subKey, translate]) => {
      formatTranslates(ref, `${targetKey}.${subKey}`, translate);
    });
  }
};

const WithNextTranlation: React.FC<WithNextTranlationProps> = async ({ terms, children, lang }) => {
  const { t } = await getTranslation(lang);

  const ref: { [key: string]: string } = {};
  terms.forEach((key) => {
    const translates = t(key) as Translates;
    formatTranslates(ref, key, translates);
  });

  return (
    <NextTranlationProvider lang={lang} translates={ref}>
      {children}
    </NextTranlationProvider>
  );
};

export default WithNextTranlation;
