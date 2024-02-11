import crypto from 'crypto';
import getConfig from './getConfig';
import http from 'http';
import DataLoader from './DataLoader';

async function createCacheServer(port: string) {
  const serverSecret = crypto.randomBytes(32).toString('hex');
  const config = await getConfig();
  const dataLoader = new DataLoader(config);

  const server = http.createServer(
    async (req, res) => {
      try {
        const url = new URL(req.url || '/', 'http://n');
        const secret = url.searchParams.get('secret');
        const lang = url.searchParams.get('lang');
        const type = url.searchParams.get('type');

        if (type === 'dev' && process.env.NODE_ENV === 'development') {
          return res.end(JSON.stringify({ secret: serverSecret }));
        }

        if (secret !== serverSecret || !lang) {
          return res.end();
        }

        const data = await dataLoader.load(lang);
        res.end(JSON.stringify(data));
      } catch (e) {
        console.log('error on data loading', e);
      }
    }
  )

  await new Promise((resolve) => {
    server.listen(+port, 'localhost', () => {
      resolve(1);
    })
  })
  process.on('SIGINT', () => {
    server.close();
  })
  process.on('SIGQUIT', () => {
    server.close();
  })
  process.on('SIGTERM', () => {
    server.close();
  })

  return {
    secret: serverSecret,
  }
}

export default createCacheServer;
