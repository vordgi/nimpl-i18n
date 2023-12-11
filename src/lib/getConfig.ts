import fs from 'fs';
import path from 'path';
import { type Config } from '../types';

const CONFIG_PATH = path.join(process.cwd(), 'next-translation.js');
const configRef = { current: null as Config | null };

const getConfig = async (): Promise<Config> => {
  if (configRef.current) return configRef.current;

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = await import('next-translation.js');
      configRef.current = config.default;
      return config;
    }
  } catch {
    //
  }
  throw new Error('Can\'t load config');
};

export default getConfig;
