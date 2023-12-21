import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { type Config } from '../types';
import DataLoader from './DataLoader';

type ModifiedConfig = { dataLoader: DataLoader }

const CONFIG_PATH = path.join(process.cwd(), 'next-translation.js');
const configRef = { current: null as ModifiedConfig | null };
// Crutch bypass of conversion by the assembler to require
const dynamicImport = new Function('p', 'return import(p)');

const getConfig = async (): Promise<ModifiedConfig> => {
  if (configRef.current) return configRef.current;

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config: { default: Config } = await dynamicImport(pathToFileURL(CONFIG_PATH).href);
      const { loaderProvider, unstable_advancedLoader } = config.default;

      if (!loaderProvider) {
        throw new Error(`Can't find loaderProvider - https://github.com/vordgi/next-translation#configuration`);
      }

      configRef.current = {
        dataLoader: new DataLoader({ loaderProvider, unstable_advancedLoader })
      };
      return configRef.current;
    }
  } catch {
    //
  }
  throw new Error('Can\'t load config - https://github.com/vordgi/next-translation#configuration');
};

export default getConfig;
