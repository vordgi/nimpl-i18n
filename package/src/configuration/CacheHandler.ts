export class CacheHandler {
    cache: Map<string, unknown>;

    constructor() {
        this.cache = new Map();
    }

    async get<T>(key: string): Promise<T> {
        return this.cache.get(key) as T;
    }

    async set(key: string, data: unknown) {
        this.cache.set(key, data);
    }

    async has(key: string) {
        return this.cache.has(key);
    }
}
