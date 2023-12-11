'use client';

import { createContext } from 'react';

type NextTranlationContextType = { lang: string; translates: { [key: string]: string } } | null;

export const NextTranlationContext = createContext<NextTranlationContextType>(null);
