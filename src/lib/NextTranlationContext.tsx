import createServerContext from 'next-impl-getters/create-server-context';
import { type Translates } from '../types';

type NextTranlationContextType = {
    lang: string;
    dictionary: Translates;
} | null;

export const NextTranlationContext = createServerContext<NextTranlationContextType>(null);
