import createCacheServer from "./configuration/createCacheServer";

const PORT = "24";
let cacheSecret = process.env.I18N_CACHE_SECRET;

const withI18n = async (phase: string) => {
    if (!cacheSecret && process.env.NODE_ENV === "development") {
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

    if ((phase === "phase-development-server" || phase === "phase-production-server") && !cacheSecret) {
        const { secret } = await createCacheServer(PORT);
        cacheSecret = secret;
    }

    process.env.I18N_CACHE_PORT = PORT;
    if (cacheSecret) process.env.I18N_CACHE_SECRET = cacheSecret;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (nextConfig: any) => nextConfig;
};

export default withI18n;
