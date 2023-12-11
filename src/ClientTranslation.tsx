'use client';

import React from 'react';
import Translation from './lib/Translation';
import useTranslation from './useTranslation';

type ClientTranslationProps = {
  term: string;
  components?: { [key: string]: JSX.Element };
};

const ClientTranslation: React.FC<ClientTranslationProps> = ({ term, components }) => {
  const { t } = useTranslation();
  const text = t(term);

  return (
    <Translation term={term} text={text} components={components} />
  );
};

export default ClientTranslation;
