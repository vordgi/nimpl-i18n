import React from 'react';
import Translation from './lib/Translation';
import getTranslation from './getTranslation';

type ServerTranslationProps = {
  lang: string;
  term: string;
  components?: { [key: string]: JSX.Element };
};

const ServerTranslation: React.FC<ServerTranslationProps> = async ({ lang, term, components }) => {
  const { t } = await getTranslation(lang);
  const text = t(term);

  return (
    <Translation term={term} text={text} components={components} />
  );
};

export default ServerTranslation;
