# bottender-handovers

[![npm](https://img.shields.io/npm/v/bottender-handovers.svg?style=flat-square)](https://www.npmjs.com/package/bottender-handovers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> An experimental package for [Messenger Handover Protocol](https://developers.facebook.com/docs/messenger-platform/handover-protocol) with [Bottender](https://github.com/Yoctol/bottender).

## Installation

```sh
npm install bottender-handovers
```

## Usage

```js
const { middleware } = require('bottender');
const handovers = require('bottender-handovers');

const handleHandovers = handovers({
  shouldControlPass: context => context.event.text === '/help',
  shouldControlTake: context =>
    context.event.isStandby && context.event.text === '/back',
  willControlPass: async context => {
    await context.sendText('Passing thread control to the page inbox.');
  },
  didControlTake: async context => {
    await context.sendText('Took thread control back.');
  },
});

// This bot should be assigned as primary receiver app
bot.onEvent(
  middleware([
    handleHandovers,
    async context => {
      if (!context.event.isStandby && context.event.isMessage) {
        await context.sendText('Respond by bot.');
      }
    },
  ])
);
```

## Options

### shouldControlPass(context): boolean

Default: `() => false`.

### shouldControlTake(context): boolean

Default: `() => false`.

### willControlPass(context)

Default: `() => {}`.

### willControlTake(context)

Default: `() => {}`.

### didControlPass(context)

Default: `() => {}`.

### didControlTake(context)

Default: `() => {}`.

### targetAppId

Default: `263902037430900`.

## License

MIT © [Yoctol](https://github.com/bottenderjs/bottender-handovers)
