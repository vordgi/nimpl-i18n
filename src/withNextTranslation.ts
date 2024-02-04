import createCacheServer from './configuration/createCacheServer';

const PORT = '24';
let isInited = Boolean(process.env.NEXT_TRANSLATION_CACHE_PORT && process.env.NEXT_TRANSLATION_CACHE_SECRET);

const withNextTranslation = async (phase: string) => {
    if (!isInited && process.env.NODE_ENV === 'development') {
        try {
            const devResp = await fetch(`http://localhost:${PORT}/?type=dev`);
            const data = await devResp.json();
            if (data) {
                isInited = true;
                process.env.NEXT_TRANSLATION_CACHE_PORT = PORT;
                process.env.NEXT_TRANSLATION_CACHE_SECRET = data.secret;
            }
        } catch {
            //
        }
    }

    if ((phase === 'phase-development-server' || phase === 'phase-production-server') && !isInited) {
        const { secret } = await createCacheServer(PORT);
        process.env.NEXT_TRANSLATION_CACHE_PORT = PORT;
        process.env.NEXT_TRANSLATION_CACHE_SECRET = secret;
    }

    return (nextConfig: any) => nextConfig;
}

export default withNextTranslation;
