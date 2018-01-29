const warning = require('warning');

const alwaysFalse = () => false;
const noop = () => {};

module.exports = ({
  shouldControlPass = alwaysFalse,
  shouldControlTake = alwaysFalse,
  willControlPass = noop,
  willControlTake = noop,
  didControlPass = noop,
  didControlTake = noop,
  targetAppId = 263902037430900, // App Id of Page Inbox
} = {}) => async context => {
  if (context.platform !== 'messenger') {
    return;
  }

  if (context.event.isPassThreadControl) {
    didControlPass(context);
  } else if (context.event.isTakeThreadControl) {
    didControlTake(context);
  }

  const pass = shouldControlPass(context);
  const take = shouldControlTake(context);

  if (pass && take) {
    warning(false, 'can not pass and take thread control at the same time');
    return;
  }

  if (pass) {
    willControlPass(context);
    await context.passThreadControl(targetAppId);
  } else if (take) {
    willControlTake(context);
    await context.takeThreadControl();
  }
};
