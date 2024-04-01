# @nimpl/i18n

i18n library designed primarily with server components in mind and maximum optimization (due to the transfer of logic to the assembly stage and/or server side).

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
npm i @nimpl/translation
```

**Using yarn:**

```bash
yarn add @nimpl/translation
```

## Additionally

Create tasks with wishes, ideas, difficulties, etc. All of them will definitely be considered and thought over.

## License

[MIT](https://github.com/vordgi/nimpl-i18n/blob/main/LICENSE)