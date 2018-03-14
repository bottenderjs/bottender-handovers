# bottender-handovers

[![npm](https://img.shields.io/npm/v/bottender-handovers.svg?style=flat-square)](https://www.npmjs.com/package/bottender-handovers)
[![Build Status](https://travis-ci.org/bottenderjs/bottender-handovers.svg?branch=master)](https://travis-ci.org/bottenderjs/bottender-handovers)
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
      if (
        !context.event.isStandby &&
        (context.event.isMessage || context.event.isPayload)
      ) {
        await context.sendText('Respond by bot.');
      }
    },
  ])
);
```

### Using Request Thread Control

`bottender-handovers` provide two built-in functions to utilize Messenger Platform's Request Thread Control events. Simply pass them to `shouldControlPass` option.

```js
const { middleware } = require('bottender');
const handovers = require('bottender-handovers');
const { isRequestThreadControlFrom } = require('bottender-handovers');

// request from and pass to 3rd party CRM service
const myCRMAppId = 123456;
const handleHandovers = handovers({
  shouldControlPass: isRequestThreadControlFrom(myCRMAppId),
  targetAppId: myCRMAppId,
});

// request from and pass to Facebook Page Inbox
const handleHandovers = handovers({
  shouldControlPass: context =>
    context.event.isRequestThreadControlFromPageInbox,
});
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

Default: `263902037430900` (Page Inbox).

## License

MIT © [Yoctol](https://github.com/bottenderjs/bottender-handovers)
