module.exports = {
  messenger: {
    appId: '__PUT_YOUR_APP_ID_HERE__',
    appSecret: '__PUT_YOUR_APP_SECRET_HERE__',
    accessToken: '__PUT_YOUR_ACCESS_TOKEN_HERE__',
    verifyToken: '__PUT_YOUR_VERITY_TOKEN_HERE__',
    fields: [
      'messages',
      'messaging_postbacks',
      'messaging_handovers',
      'standby',
    ],
    profile: {
      get_started: {
        payload: '__GET_STARTED__',
      },
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: false,
          call_to_actions: [
            {
              type: 'postback',
              title: 'Switch Human/Bot',
              payload: '__SWITCH_HUMAN_OR_BOT__',
            },
          ],
        },
      ],
    },
  },
};
