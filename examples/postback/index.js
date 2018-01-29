const { MessengerBot, middleware } = require('bottender');
const { createServer } = require('bottender/express');
const handovers = require('bottender-handovers');

const config = require('./bottender.config').messenger;

const bot = new MessengerBot({
  accessToken: config.accessToken,
  appSecret: config.appSecret,
});

bot.setInitialState({
  isStandby: false,
});

const handleHandovers = handovers({
  shouldControlPass: context =>
    !context.state.isStandby &&
    context.event.payload === '__SWITCH_HUMAN_OR_BOT__',
  shouldControlTake: context =>
    context.state.isStandby &&
    context.event.payload === '__SWITCH_HUMAN_OR_BOT__',
  willControlPass: async context => {
    await context.sendText('Passing thread control to the page inbox.');
  },
  didControlPass: async context => {
    context.setState({ isStandby: true });
  },
  didControlTake: async context => {
    context.setState({ isStandby: false });
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

const server = createServer(bot, { verifyToken: config.verifyToken });

server.listen(5000, () => {
  console.log('server is running on 5000 port...');
});
