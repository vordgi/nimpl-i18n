import createCacheServer from './configuration/createCacheServer';

const PORT = '24';
let cacheSecret = process.env.NEXT_TRANSLATION_CACHE_SECRET;

const withNextTranslation = async (phase: string) => {
    if (!cacheSecret && process.env.NODE_ENV === 'development') {
        try {
            const devResp = await fetch(`http://localhost:${PORT}/?type=dev`);
            const data = await devResp.json();
            if (data) {
                cacheSecret = data.secret;
            }
        } catch {
            //
        }
    }

    if ((phase === 'phase-development-server' || phase === 'phase-production-server') && !cacheSecret) {
        const { secret } = await createCacheServer(PORT);
        cacheSecret = secret;
    }

    process.env.NEXT_TRANSLATION_CACHE_PORT = PORT;
    if (cacheSecret) process.env.NEXT_TRANSLATION_CACHE_SECRET = cacheSecret;

    return (nextConfig: any) => nextConfig;
}

export default withNextTranslation;
