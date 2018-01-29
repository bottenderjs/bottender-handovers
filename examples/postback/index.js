const { MessengerBot } = require('bottender');
const { createServer } = require('bottender/express');

const handovers = require('../../src');

const config = require('./bottender.config').messenger;

const bot = new MessengerBot({
  accessToken: config.accessToken,
  appSecret: config.appSecret,
});

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
bot.onEvent(async context => {
  await handleHandovers(context);
  if (!context.event.isStandby && context.event.isMessage) {
    await context.sendText('Respond by bot.');
  }
});

const server = createServer(bot, { verifyToken: config.verifyToken });

server.listen(5000, () => {
  console.log('server is running on 5000 port...');
});
