/* eslint-disable no-console */
import { type Query } from "../types";

export type InjectQueryArg = {
  term: string;
  text: string;
  query: Query;
  removeUnusedQueries?: boolean;
  isTransmitter?: boolean;
}

const injectQuery = ({ term, text, query, removeUnusedQueries, isTransmitter }: InjectQueryArg): string => {
  const newText = text.replace(/{{([a-zA-Z0-9_-]+)}}/gm, (matched, g1) => {
    if (query[g1]) {
      return query[g1].toString();
    }

    if (!isTransmitter) {
      console.warn(`Unknown query for term "${term}" - ${matched}`);
    }

    if (removeUnusedQueries) {
      return '';
    } else {
      return matched;
    }
  });

  return newText;
};

export default injectQuery;
