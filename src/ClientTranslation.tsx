'use client';

import React from 'react';
import { type ClientTOptions } from './types';
import Translation from './lib/Translation';
import useTranslation from './useTranslation';

type ClientTranslationProps = {
  term: string;
  components?: { [key: string]: JSX.Element };
  query?: ClientTOptions['query'];
  removeUnusedQueries?: ClientTOptions['removeUnusedQueries'];
};

const ClientTranslation: React.FC<ClientTranslationProps> = ({ term, components, query, removeUnusedQueries }) => {
  const { t } = useTranslation();
  const text = t(term, { query, removeUnusedQueries });

  return (
    <Translation term={term} text={text} components={components} />
  );
};

export default ClientTranslation;
