import React from 'react';
import { type NextTranslationOptions } from './types';
import Translation from './lib/Translation';
import getTranslation from './getTranslation';

type ServerTranslationProps = {
  term: string;
  components?: { [key: string]: JSX.Element };
  query?: NextTranslationOptions['query'];
  removeUnusedQueries?: NextTranslationOptions['removeUnusedQueries'];
};

const ServerTranslation: React.FC<ServerTranslationProps> = ({ term, components, query, removeUnusedQueries }) => {
  const { t } = getTranslation();
  const text = t(term, { query, removeUnusedQueries });

  return (
    <Translation term={term} text={text} components={components} />
  );
};

export default ServerTranslation;
