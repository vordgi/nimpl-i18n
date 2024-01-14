import React from 'react';
import { type ServerTOptions } from './types';
import Translation from './lib/Translation';
import getTranslation from './getTranslation';

type ServerTranslationProps = {
  term: string;
  lang?: string;
  components?: { [key: string]: JSX.Element };
  query?: ServerTOptions['query'];
  parseEntities?: ServerTOptions['parseEntities'];
};

const ServerTranslation: React.FC<ServerTranslationProps> = async ({ term, lang, components, query, parseEntities }) => {
  const { t } = await getTranslation(lang);
  const text = t(term, { query, parseEntities, removeUnusedQueries: false });

  return (
    <Translation term={term} text={text} components={components} />
  );
};

export default ServerTranslation;
