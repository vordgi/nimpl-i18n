'use client';

import React from 'react';
import { NextTranlationContext } from './NextTranlationContext';

type NextTranlationProviderProps = {
  translates: { [key: string]: string };
  lang: string;
  children: React.ReactNode;
};

const NextTranlationProvider: React.FC<NextTranlationProviderProps> = ({ translates, children, lang }) => (
  <NextTranlationContext.Provider value={{ lang, translates }}>
    {children}
  </NextTranlationContext.Provider>
);

export default NextTranlationProvider;
