'use client';

import React, { useContext } from 'react';
import { ClientNextTranlationContext } from './ClientNextTranlationContext';

type ClientNextTranlationProviderProps = {
  translates: { [key: string]: string };
  lang: string;
  children: React.ReactNode;
  cleanThread?: boolean;
};

const ClientNextTranlationProvider: React.FC<ClientNextTranlationProviderProps> = ({ translates, children, lang, cleanThread }) => {
  const prevTranslates = useContext(ClientNextTranlationContext);

  if (cleanThread) {
    Object.assign(translates, prevTranslates?.translates);
  }

  return (
    <ClientNextTranlationContext.Provider value={{ lang, translates }}>
      {children}
    </ClientNextTranlationContext.Provider>
  )
}

export default ClientNextTranlationProvider;
