import { type CheckIsActual, type Config, type Meta } from "./types";
import { isPromise } from "../helpers/isPromise";
import { CacheHandler } from "./CacheHandler";

class DataLoader {
    cache: { [lang: string]: Promise<unknown> | Meta | undefined } = {};

    loadTranslates: Config["load"];

    revalidate: Config["revalidate"];

    cacheHandler = new CacheHandler();

    checkIsActual: CheckIsActual | undefined;

    retryAttempts: number;

    languages: string[];

    constructor(opts: Config) {
        this.loadTranslates = opts.load;
        this.revalidate = opts.revalidate;
        this.checkIsActual = opts.checkIsActual;
        this.retryAttempts = opts.retryAttempts || 3;
        this.languages = opts.languages || [];
    }

    async prolongCache(lang: string) {
        const prevMeta = this.cache[lang];
        if (prevMeta && !isPromise(prevMeta)) {
            prevMeta.lastUpdated = Date.now();
        }
    }

    async actualizeData<T>(lang: string, lastLoadMeta: Meta | undefined): Promise<T | undefined> {
        const isOutdatedCache =
            !lastLoadMeta ||
            (this.revalidate !== undefined &&
                this.revalidate !== false &&
                lastLoadMeta.lastUpdated + 1000 * this.revalidate < Date.now());

        if (isOutdatedCache) {
            this.cache[lang] = new Promise<T | undefined>(async (resolve) => {
                if (this.checkIsActual) {
                    const isActual = await this.callWithRetries(() => this.checkIsActual!(lang, lastLoadMeta));

                    if (isActual) {
                        this.prolongCache(lang);
                        resolve(undefined);
                    }
                }
                const fullData = await this.callWithRetries(() => this.loadTranslates(lang));
                if (!fullData?.data) {
                    throw new Error(`No data key in load response for lang: ${lang}`);
                }

                this.cacheHandler.set(lang, fullData.data);
                this.cache[lang] = {
                    ...fullData.meta,
                    lastUpdated: Date.now(),
                    isRevalidated: false,
                };
                resolve(fullData.data as T);
            });
            const data = await this.cache[lang];
            return data as T | undefined;
        }
    }

    async load<T>(lang: string): Promise<T> {
        if (!this.languages.includes(lang)) {
            console.error(`Unknown language: ${lang}`);
            return {} as T;
        }
        const cache = this.cache;

        try {
            const lastLoadResult = cache[lang];
            /** We are still loading */
            if (isPromise(lastLoadResult)) {
                const data = await cache[lang];
                return data as T;
            }

            /** Cache doesn't exist or it's outdated */
            const actualData = await this.actualizeData<T>(lang, lastLoadResult);
            if (actualData) return actualData;
        } catch (e) {
            console.error(`Can\'t load actual data for lang ${lang}: `, e);
        }

        const isCacheExist = await this.cacheHandler.has(lang);
        if (isCacheExist) {
            return this.cacheHandler.get(lang);
        }

        throw new Error("Can't load data or read from cache");
    }

    async revalidateTag(lang: string) {
        const prevMeta = this.cache[lang];
        if (prevMeta && !isPromise(prevMeta)) {
            prevMeta.isRevalidated = true;
            await this.load(lang);
        }
    }

    async callWithRetries<T>(cb: () => Promise<T>) {
        let attempts = 0;

        const call = async () => {
            try {
                attempts += 1;
                return await cb();
            } catch {
                if (attempts === this.retryAttempts) {
                    throw new Error("Can't load data");
                }

                console.warn("Can't load data, trying again...");
                call();
            }
        };

        return call();
    }
}

export default DataLoader;
