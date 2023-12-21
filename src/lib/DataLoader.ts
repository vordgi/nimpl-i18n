export type Meta = { lastUpdated: number; isRevalidated?: boolean } & Record<string, unknown>;

export abstract class LoaderProvider {
    abstract load(key: string, meta?: Meta): Promise<{ data: unknown, meta: Meta }>;
}

export type CheckIsActual = (key: string, meta?: Meta) => Promise<boolean>;

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

class LoaderHandler {
    revalidate: number | false = false;

    cacheProvider: CacheHandler;

    loaderProvider: LoaderProvider;

    state: { [key: string]: Promise<unknown> } = {};

    bgState: { [key: string]: Promise<{ data: unknown; meta: Meta } | undefined> } = {};

    retryAttempts: number;

    checkIsActual: CheckIsActual;

    constructor(revalidate: number | false, loaderProvider: LoaderProvider, cacheHandler: CacheHandler, retryAttempts: number, checkIsActual: CheckIsActual) {
        this.revalidate = revalidate;
        this.cacheProvider = cacheHandler;
        this.loaderProvider = loaderProvider;
        this.retryAttempts = retryAttempts;
        this.checkIsActual = checkIsActual;
    }

    async prolongCache(key: string) {
        const prevMeta = await this.cacheProvider.get(`${key}_meta`);
        if (prevMeta) {
            await this.cacheProvider.set(`${key}_meta`, {
                ...prevMeta,
                lastUpdated: Date.now(),
                isRevalidated: false,
            });
        }
    }

    async isCacheActual(key: string) {
        const { lastUpdated, isRevalidated } = await this.cacheProvider.get<Meta>(`${key}_meta`) || {};

        if (!lastUpdated || isRevalidated) return false;

        if (this.revalidate === false) return true;

        return lastUpdated + (1000 * this.revalidate) > Date.now();
    }

    async revalidateTag(key: string) {
        const prevMeta = await this.cacheProvider.get(`${key}_meta`);
        if (prevMeta) {
            await this.cacheProvider.set(`${key}_meta`, {
                ...prevMeta,
                isRevalidated: true,
            });
            await this.load(key);
        }
    }

    async loadWithRetries<T>(cb: () => Promise<T>) {
        let attempts = 0;

        const load = async () => {
            try {
                attempts += 1;
                return await cb();
            } catch {
                if (attempts === this.retryAttempts) {
                    throw new Error('Can\'t load data');
                }

                console.warn('Can\'t load data, trying again...');
                load();
            }
        }

        return load();
    }

    async _load(key: string) {
        try {
            const isCacheExist = await this.cacheProvider.has(key);
            if (isCacheExist) {
                const isCacheActual = await this.isCacheActual(key);
                let cachedMeta = await this.cacheProvider.get<Meta>(`${key}_meta`);
                if (isCacheActual) {
                    const cachedData = await this.cacheProvider.get(key);
                    return { data: cachedData, meta: cachedMeta };
                }

                const isDataActual = await this.loadWithRetries(() => this.checkIsActual(key, cachedMeta));
                if (isDataActual) {
                    await this.prolongCache(key);
                } else {
                    if (!this.bgState[key]) {
                        this.bgState[key] = this.loadWithRetries(() => this.loaderProvider.load(key, cachedMeta))
                            .then(async (respData) => {
                                if (respData) {
                                    await this.cacheProvider.set(key, respData.data);
                                    cachedMeta = { ...respData.meta, lastUpdated: Date.now(), isRevalidated: false }
                                    await this.cacheProvider.set(`${key}_meta`, cachedMeta);
                                    delete this.bgState[key];
                                    return respData;
                                }
                                delete this.bgState[key];
                            });
                    }
                }

                const cachedData = await this.cacheProvider.get(key);
                return { data: cachedData, meta: cachedMeta };
            }

            const respData = await (this.bgState[key] || this.loadWithRetries(() => this.loaderProvider.load(key)));
            if (respData) {
                await this.cacheProvider.set(key, respData.data);
                await this.cacheProvider.set(`${key}_meta`, { ...respData.meta, lastUpdated: Date.now(), isRevalidated: false, });
                return respData;
            }
        } catch {
            console.warn('Can\'t load data or read from cache');
            await this.prolongCache(key);
        }
        return {};
    }

    async load<T>(key: string): Promise<T> {
        let loader: Promise<unknown>;
        if (key in this.state) {
            loader = this.state[key];
        } else {
            loader = this._load(key).then(data => {
                setTimeout(() => {
                    delete this.state[key];
                }, 100);
                return data;
            });
            this.state[key] = loader;
        }
        const data = await loader;

        return data as T;
    }
}

export type AdvancedLoader = {
    revalidate: number | false;
    cacheHandler?: CacheHandler;
    retryAttempts?: number;
    checkIsActual?: (key: string) => Promise<boolean>;
}

type DataLoaderOptions = {
    loaderProvider: LoaderProvider;
    unstable_advancedLoader?: AdvancedLoader;
}

class DataLoader {
    private loaderHandler: LoaderHandler | LoaderProvider;

    private cacheHandler?: CacheHandler;

    constructor({ unstable_advancedLoader, loaderProvider }: DataLoaderOptions) {
        if (unstable_advancedLoader) {
            const { revalidate = false, cacheHandler, checkIsActual = async () => false, retryAttempts } = unstable_advancedLoader;
            this.cacheHandler = cacheHandler || new CacheHandler();
            this.loaderHandler = new LoaderHandler(revalidate, loaderProvider, this.cacheHandler, retryAttempts || 3, checkIsActual);
        } else {
            this.loaderHandler = loaderProvider
        }
    }

    async load<T>(key: string) {
        const respData = await this.loaderHandler.load<{ data: T }>(key);
        return respData.data as T;
    }

    async revalidateTag(key: string) {
        if (!(this.loaderHandler instanceof LoaderHandler)) {
            throw new Error('You have not enabled advanced cache mode and cannot use this option.');
        }

        await this.loaderHandler?.revalidateTag(key);
    }
}

export default DataLoader;
