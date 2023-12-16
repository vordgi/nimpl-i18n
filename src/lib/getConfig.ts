import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { type Config } from '../types';

const CONFIG_PATH = path.join(process.cwd(), 'next-translation.js');
const configRef = { current: null as Config | null };
// Crutch bypass of conversion by the assembler to require
const dynamicImport = new Function('p', 'return import(p)');

const getConfig = async (): Promise<Config> => {
  if (configRef.current) return configRef.current;

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = await dynamicImport(pathToFileURL(CONFIG_PATH).href);
      configRef.current = config.default;
      return config.default;
    }
  } catch {
    //
  }
  throw new Error('Can\'t load config - https://github.com/vordgi/next-translation#configuration');
};

export default getConfig;
