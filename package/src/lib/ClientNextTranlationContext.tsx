'use client';

import { createContext } from 'react';

type ClientNextTranlationContextType = { lang: string; translates: { [key: string]: string } } | null;

export const ClientNextTranlationContext = createContext<ClientNextTranlationContextType>(null);
