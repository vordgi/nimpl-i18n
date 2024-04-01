const fs = require('fs/promises')

/** @type {import('@nimpl/i18n/configuration/types').Config} */
module.exports = {
  load: async (lang) => {
    const data = await fs.readFile(`./translates/${lang}.json`).then((data) => JSON.parse(data))
    console.log('load ' + lang);
    return { data };
  },
  /**
   * In development mode, the data will be updated each 10 seconds to load changes in files,
   * there is no need to track changes in files during the build and after it.
   * For other situations, the option can be configured differently
   */
  revalidate: process.env.NODE_ENV === 'development' ? 10 : false,
  languages: ['de', 'fr', 'en'],
}
