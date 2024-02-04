import React from 'react';
import { NextTranlationContext } from './lib/NextTranlationContext';
import NextTranlationTransmitter, { type NextTranlationTransmitterProps } from './NextTranlationTransmitter';
import getDictionary from './lib/getDictionary';

type NextTranlationProviderProps = {
  lang: string;
  children: React.ReactNode;
  clientTerms?: NextTranlationTransmitterProps['terms'];
};

const NextTranlationProvider: React.FC<NextTranlationProviderProps> = async ({ children, lang, clientTerms = [] }) => {
  const dictionary = await getDictionary(lang);

  return (
    <NextTranlationContext.Provider value={{ lang, dictionary }}>
      <NextTranlationTransmitter terms={clientTerms} cleanThread>
        {children}
      </NextTranlationTransmitter>
    </NextTranlationContext.Provider>
  );
};

export default NextTranlationProvider;
