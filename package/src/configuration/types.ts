import { type Translates } from "../types";

export type Meta = { lastUpdated: number; isRevalidated?: boolean } & Record<string, unknown>;

export type Config = {
    load(key: string, meta?: Meta): Promise<Translates>;
    getLanguage(options: { pathname: string | null; params: { [key: string]: string | string[] } }): Promise<string>;
    languages: string[];
};
