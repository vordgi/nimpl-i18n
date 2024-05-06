export type Meta = { lastUpdated: number; isRevalidated?: boolean } & Record<string, unknown>;

export type Config = {
    load(key: string, meta?: Meta): Promise<{ data: unknown; meta: Meta }>;
    languages: string[];
};
