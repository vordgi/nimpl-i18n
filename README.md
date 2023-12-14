# Next Translation

[![npm version](https://badge.fury.io/js/next-translation.svg)](https://badge.fury.io/js/next-translation)

Next Translation is an internationalization library for React.js with an enabled server component (especially for Next.js App Router).

## Why one more library?
Server components are an experimental feature of React, and currently translation libraries are poorly optimized for them. If supported, disable Next.js static optimization.

This library is an attempt to create a highly optimized solution exclusively using the current capabilities of React and Next.js.

## Installation

**Using npm:**
```bash
npm i next-translation
```

**Using yarn:**
```bash
yarn add next-translation
```

## Configuration
Create config file

```js
const load = async (lang) => {
  const resp = await fetch(`https://api.translate-example.com/terms/${lang}`, {
    method: 'POST',
  });
  const data = await resp.json();
  return data;
};

/** @type {import('next-translation/types').Config} */
module.exports = {
  loaders: {
    ru: () => load('ru'),
    en: () => load('en'),
  },
  revalidate: 10,
};
```

`loaders` - loaders for each language should return data in the following structure:

`type Translates = { [key: string]: Translates | string }`
I highly recommend using next.js fetch with revalidation configured for better performance with ISR mode. However, if it's not possible (e.g., when loading data with a POST request or if the response size is larger than 2MB), you can use the `revalidate` option in next-translation to optimize requests.

`revalidate`. Option works similarly to the next.js option. Setting it to `false` (default) will disable revalidation, meaning the data will be cached indefinitely. Setting it to `0` will request the data each time, while setting it to a `number` will determine the time in seconds for revalidation to occur.

## Base translates

### Server components:

Use `getTranslation` in async server components
```tsx
"use server";

import getTranslation from 'next-tranlation/getTranslation';

const ServerComponent: React.FC<{ lang: string }> = async ({ lang }) => {
    const { t } = await getTranslation(lang);

    return (
        <div>
            {/* Welcome to Next Translation */}
            {t('header.nav.home')}
        </div>
    )
}
```

### Client components:

To begin, initialize the Transmitter in the server component, which should be located under the client component.
```tsx
"use server";

import WithNextTranslation from 'next-tranlation/WithNextTranslation';
import ClientComponent from './ClientComponent';

const ServerComponent: React.FC<{ lang: string }> = ({ lang }) => (
    <WithNextTranslation lang={lang} terms={['header.nav']}>
        <ClientComponent />
    </WithNextTranslation>
)
```

Then you can use `useTranslation` in client components
```tsx
"use client";

import useTranslation from 'next-tranlation/useTranslation';

const ClientComponent: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            {/* Welcome to Next Translation */}
            {t('header.nav.home')}
        </div>
    )
}
```

Both of them agree to use `opts` as the second argument of `t`. Now you can pass a query there to inject variable strings inside translations.

```tsx
const Component: React.FC = () => {
    return (
        <div>
            {/* Price starts from ${{price}} */}
            {t('pricing.tariffs.solo', { query: { price: 16.99 } })}
        </div>
    )
}
```

## Difficult tranlates

To handle difficult translations, you can use the `ServerTranslation` or `ClientTranslation` with components prop. These components would be injected into the translation, whether on the server or the client side.

### Server components:

Use `ServerTranslation` in async server components
```tsx
"use server";

import ServerTranslation from 'next-tranlation/ServerTranslation';

const ServerComponent: React.FC<{ lang: string }> = async ({ lang }) => (
    <ServerTranslation
        lang={lang}
        term='intro.description' // We have {{number}} tariffs. Read more about pricings <link>special section</link>
        components={{
            link: <a href='#' />
        }}
        query={{ number: 5 }}
    />
)
```

### Client components:

Use `ClientTranslation` in client components
```tsx
"use client";

import ClientTranslation from 'next-tranlation/ClientTranslation';

const ClientComponent: React.FC = async () => (
    <ClientTranslation
        term='intro.description' // We have {{number}} tariffs. Read more about pricings <link>special section</link>
        components={{
            link: <a href='#' />
        }}
        query={{ number: 5 }}
    />
)
```

## License

[MIT](https://github.com/vordgi/next-translation/blob/main/LICENSE)
