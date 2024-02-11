# next-translation

[![npm version](https://badge.fury.io/js/next-translation.svg)](https://badge.fury.io/js/next-translation)

Next Translation is an internationalization library for Next.js App Router.

## Why one more library?

Server components are a recent feature in React. Existing translation libraries are not yet well-optimized for them. If they support it, then only by disabling Next.js static optimization.

This library is an attempt to create a highly optimized solution exclusively using the current capabilities of React.js, Next.js and node.js.

## Features

Support for loading translations during page rendering (*instead of the application build step*), allowing for up-to-date translations with ISR or SSR;

Support for revalidation logic, i.e. you can specify how often translations should be updated (*or that they should not be updated at all*);

Optimized caching system - not a single extra request will be sent, even with parallel building (which is now enabled by default);

Passing only those translations to the client that are needed on the client;

Embedding parameters in client translations on the server;

Support for html entities.

## Installation

**Using npm:**

```bash
npm i next-translation
```

**Using yarn:**

```bash
yarn add next-translation
```

## Usage

### NextTranslationProvider

It is recommended to use the configuring provider at the page level.

```tsx
import NextTranlationProvider from 'next-translation/NextTranlationProvider'

export default function HomePage({ params }: { params: { lang: string } }) {
    return (
        <NextTranlationProvider lang={params.lang} clientTerms={['shared', 'banking.about']}>
            {/* ... */}
        </NextTranlationProvider>
    )
}
```

Client terms will be passed to the client. You can specify both namespaces and specific keys.

*Note: Layout lives independently, so it needs to be wrapped in* `NextTranslationProvider` *separately.*

### Server components

Use `getTranslation` for simple translations

```tsx
import getTranslation from 'next-tranlation/getTranslation';

const ServerComponent: React.FC = () => {
    const { t } = getTranslation();

    return (
        <div>
            {/* Welcome to Next Translation */}
            {t('header.nav.home')}
        </div>
    )
}
```

Use `ServerTranslation` to get complex translations

```tsx
import ServerTranslation from 'next-tranlation/ServerTranslation';

const ServerComponent: React.FC = () => (
    <ServerTranslation
        term='intro.description' // We have {{number}} tariffs. Read more about pricings <link>special section</link>
        components={{
            link: <a href='#' />
        }}
        query={{ number: 5 }}
    />
)
```

### Client components

The translations specified in `NextTranslationProvider` are passed to the client, but you can specify additional translations in any parent server component using `NextTranslationTransmitter`.

You can specify both namespaces and specific keys.

```tsx
import NextTranslationTransmitter from 'next-tranlation/NextTranslationTransmitter';
import ClientComponent from './ClientComponent';

const ServerComponent: React.FC = () => (
    <NextTranslationTransmitter terms={['header.nav']}>
        <ClientComponent />
    </NextTranslationTransmitter>
)
```

Use `useTranslation` for simple translations

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

Use `ClientTranslation` for complex translations

```tsx
"use client";

import ClientTranslation from 'next-tranlation/ClientTranslation';

const ClientComponent: React.FC = () => (
    <ClientTranslation
        term='intro.description' // We have {{number}} tariffs. Read more about pricings <link>special section</link>
        components={{
            link: <a href='#' />
        }}
        query={{ number: 5 }}
    />
)
```

### Other

Use `createTranslation` to get a simple translation outside the page tree.

```tsx
import createTranslation from 'next-translation/createTranslation'
// ...
export async function generateMetadata({ params }: { params: { lang: string } }) {
    const { t } = await createTranslation(params.lang);
    return {
        title: t('homePage.meta.title'),
    }
}
```

### Options

You can pass `opts` as the second argument of `t`.

Now you can pass a query there to inject variable strings inside translations.

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

Also you can inject query to client terms on the server side. For example, when they depend on the server environment or when you get values from a database on the server.

Just add an array value instead of a string in terms arr, where the second element will be the query object.

```tsx
import NextTranslationTransmitter from 'next-tranlation/NextTranslationTransmitter';
import ClientComponent from './ClientComponent';

const ServerComponent: React.FC = () => (
    <NextTranslationTransmitter terms={[['home.welcome', { stage: process.env.GITHUB_REF === 'main' ? 'production' : 'test' }]]}>
        <ClientComponent />
    </NextTranslationTransmitter>
)
```

## Configuration

### Config file

Create `next-translation.js` file in the root directory

```jsx
/** @type {import('next-translation/configuration/types').Config} */
module.exports = {
    load: async (lang) => {
        const resp = await fetch(`https://api.translation-example.com/terms/${lang}`, {
            method: 'POST',
        });
        const data = await resp.json();
        return { data, meta: {} };
    },
    languages: ['en', 'de', 'fr'],
    revalidate: 3600,
    checkIsActual: async (lang, lastLoadMeta) => {
        // ...
    },
    retryAttempts: 2,
};
```

### Options

**load [required]**

Asynchronous function for translates loading

Function will receive 2 arguments:

`key` - current language;

`meta` - meta data from previous request.

Function should return object with keys:

`data` - object with translates;

`meta` - object with additional data which will be passed to the next load.

*Don't combine next.js fetch caching with the next-translation load caching, it will repeat the logic and may not work correctly.*

**languages [required]**

Array of allowed languages. Languages outside of this array will be ignored.

**revalidate [optional]**

Option works similarly to the next.js option. Setting it to `false` will disable revalidation, meaning the data will be cached indefinitely. Setting it to `0` will request the data each time, while setting it to a `number` will determine the time in seconds for revalidation to occur.

**retryAttempts [optional]**

Number of retries when loading data (*3 by default*)

**checkIsActual [optional]**

Check that the data is up to date. Use it when you can perform additional steps to ensure that cached data is up to date. For example, make a HEAD request with meta information, or check the meta on a different route. Option type:

`(key: string, meta?: { [key: string]: string }) => Promise<boolean>`

where:

`key` - target language

`meta` - meta information returned from the load function

### Configure app

You also need to configure the environment for correct caching to work, for this you need to wrap your `next.config.js` in `withNextTranslation`

```js
const withNextTranslation = require('next-translation/withNextTranslation').default;

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = async (phase) => {
    const withTranslation = await withNextTranslation(phase);
    return withTranslation(nextConfig);
}
```

*Note: the library does not modify the webpack or application configuration, it only configures the process.*

## App organization

### Pages structure

```
app
    [lang]
        page-name
            page.tsx
        page.tsx
        layout.tsx
    (root)
        page-name
            page.tsx
        page.tsx
        layout.tsx
```

### Why so?

You can only create one root layout. In the root (`/app`) we don't know the language, so we can't add a `lang` attribute there on the server side.

Therefore, the only way to do it is to create a root layout for localized pages in the `[lang]` folder.

```tsx
// /app/[lang]/layout.tsx
type RootLayoutProps = { children: React.ReactNode; params: { lang: string } }

export default function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}

```

## Additionally

Create tasks with wishes, ideas, difficulties, etc. All of them will definitely be considered and thought over.

## License

[MIT](https://github.com/vordgi/next-translation/blob/main/LICENSE)