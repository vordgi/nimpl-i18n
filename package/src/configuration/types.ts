export type Meta = { lastUpdated: number; isRevalidated?: boolean } & Record<string, unknown>;

export type CheckIsActual = (key: string, meta?: Meta) => Promise<boolean>;

export type Config = {
    load(key: string, meta?: Meta): Promise<{ data: unknown, meta: Meta }>
    languages: string[];
    revalidate?: number | false;
    checkIsActual?: CheckIsActual;
    retryAttempts?: number;
}
