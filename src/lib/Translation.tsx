/* eslint-disable no-console, react/no-array-index-key */
import React from 'react';
import injectQuery, { type Query } from './injectQuery';

type TranslationProps = {
  term: string;
  text: string;
  components?: { [key: string]: JSX.Element };
  query?: Query;
};

const Translation = ({ term, text, components, query }: TranslationProps): React.ReactNode[] => {
  const parsedText = query ? injectQuery(term, text, query) : text;
  const parts: JSX.Element[] = parsedText.split(/<\/?[a-zA-Z0-9]+>|<[a-zA-Z0-9]+ ?\/>/gm).map((el, i) => <React.Fragment key={`p-${i}`}>{el}</React.Fragment>);

  if (components) {
    const tags = parsedText.match(/<\/?[a-zA-Z0-9]+>|<[a-zA-Z0-9]+ ?\/>/gm);
    const openedTags: { tag: string; position: number }[] = [];
    tags?.forEach((tag, tagIndex) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tagName = tag.match(/[a-zA-Z0-9]+/)![0];
      if (tag.match(/<[a-zA-Z0-9]+ ?\/>/)) {
        const component = components[tagName as keyof typeof components];
        if (component) {
          parts.splice(
            tagIndex + 1,
            1,
            React.cloneElement(
              component,
              { key: `c-${tagIndex}` },
              component.props.children,
            ),
          );
        } else {
          console.warn(`Unknown component for term "${term}" - ${tagName}`);
        }
      } else if (tag.match(/<\/[a-zA-Z0-9]+>/)) {
        const openedTagIndex = openedTags.findIndex((i) => i.tag === tagName);
        if (openedTagIndex !== -1) {
          const lastOpenedIndex = openedTags.length - 1 - openedTagIndex;
          const openedTagsLength = openedTags.length;
          for (let i = openedTagsLength; i > lastOpenedIndex; i--) {
            const targetIndex = i - 1;
            const targetTag = openedTags[targetIndex];
            const component = components[targetTag.tag as keyof typeof components];
            if (component) {
              const children = parts.slice(targetTag.position + 1, tagIndex + 1)
                .filter((c) => Boolean(c.props.children));
              parts.splice(
                targetTag.position + 1, // parts на 1 больше
                tagIndex - targetTag.position,
                React.cloneElement(
                  component,
                  { key: `${tagIndex}-${targetIndex}` },
                  children.length ? children : component.props.children,
                ),
              );
            } else {
              console.warn(`Unknown component for term "${term}" - ${targetTag}`);
            }
            openedTags.splice(targetIndex, 1);
          }
        }
      } else {
        openedTags.push({ tag: tagName, position: tagIndex });
      }
    });
  }

  return (
    parts
  );
};

export default Translation;
