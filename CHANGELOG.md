# 0.3.0 / 2018-07-26

- [new] await `shouldControlPass` and `shouldControlTake` (#9)
- [renamed] isRequestControlFrom -> isRequestThreadControlFrom
- [removed] isRequestControlFromInbox has been removed.

# 0.2.0 / 2018-03-14

`bottender-handovers` provide two built-in functions to utilize Messenger Platform's Request Thread Control events. Simply pass them to `shouldControlPass` option.

```js
const handovers = require('bottender-handovers');
const { isRequestControlFrom, isRequestControlFromInbox } = require('bottender-handovers');

// request from and pass to 3rd party CRM service
const myCRMAppId = 123456;
const handleHandovers = handovers({
  shouldControlPass: isRequestControlFrom(myCRMAppId),
  targetAppId: myCRMAppId
});

// request from and pass to Facebook Page Inbox
const handleHandovers = handovers({
  shouldControlPass: isRequestControlFromInbox,
});
```

