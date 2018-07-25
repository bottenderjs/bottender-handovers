const warning = require('warning');

const alwaysFalse = () => false;
const noop = () => {};

const isRequestThreadControlFrom = appId => context =>
  context.event.isRequestThreadControl &&
  context.event.requestThreadControl.requested_owner_app_id === appId;

const hasThreadControl = async (
  context,
  fallback = _context => _context.state.isBot
) => {
  try {
    const data = await context.getThreadOwner();
    return data.app_id === process.env.APP_ID;
  } catch (error) {
    console.error(error);
    return fallback(context);
  }
};

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

  const pass = await shouldControlPass(context);
  const take = await shouldControlTake(context);

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

module.exports.isRequestThreadControlFrom = isRequestThreadControlFrom;
module.exports.hasThreadControl = hasThreadControl;
