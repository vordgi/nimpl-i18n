'use client';

import { createContext } from 'react';

type ClientI18nContextType = { lang: string; translates: { [key: string]: string } } | null;

export const ClientI18nContext = createContext<ClientI18nContextType>(null);
