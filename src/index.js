const warning = require('warning');

const alwaysFalse = () => false;
const noop = () => {};

const isRequestControlFrom = appId => context =>
  context.event.isRequestThreadControl &&
  context.event.requestThreadControl.requested_owner_app_id === appId;

const isRequestControlFromInbox = isRequestControlFrom(263902037430900);

module.exports = ({
  shouldControlPass = alwaysFalse,
  shouldControlTake = alwaysFalse,
  willControlPass = noop,
  willControlTake = noop,
  didControlPass = noop,
  didControlTake = noop,
  targetAppId = 263902037430900, // App Id of Page Inbox
} = {}) => async (context, next) => {
  if (context.platform !== 'messenger') {
    return next();
  }

  const pass = shouldControlPass(context);
  const take = shouldControlTake(context);

  if (pass && take) {
    warning(false, 'can not pass and take thread control at the same time');
    return;
  }

  if (pass) {
    try {
      await willControlPass(context);
    } catch (err) {
      console.error(err);
    }
    try {
      await context.passThreadControl(targetAppId);
      await didControlPass(context);
    } catch (err) {
      console.error(err);
    }
  } else if (take) {
    try {
      await willControlTake(context);
    } catch (err) {
      console.error(err);
    }
    try {
      await context.takeThreadControl();
      await didControlTake(context);
    } catch (err) {
      console.error(err);
    }
  } else {
    return next();
  }
};

module.exports.isRequestControlFrom = isRequestControlFrom;
module.exports.isRequestControlFromInbox = isRequestControlFromInbox;
