/* eslint-disable no-console */
export type Query = { [key: string]: string | number };

const injectQuery = (term: string, text: string, query: Query): string => {
  const newText = text.replace(/{{([a-zA-Z0-9_-]+)}}/gm, (matched, g1) => {
    if (query[g1]) {
      return query[g1].toString();
    }
    console.warn(`Unknown query for term "${term}" - ${matched}`);

    return '';
  });

  return newText;
};

export default injectQuery;
