export default {
  remApiRevision: process.env.REM_API_REVISION || 'development',
  serverPort: process.env.SERVER_PORT || '3000',
  appName: process.env.APPNAME || 'rem-api',
  slack: {
    webhookEndPoint: 'https://hooks.slack.com/services/*********/*********/************************',
    channelNameInfo: process.env.SLACK_CHANNEL_NAME_INFO || 'devlog',
    channelNameWarn: process.env.SLACK_CHANNEL_NAME_WARN || 'devlog',
    channelNameError: process.env.SLACK_CHANNEL_NAME_ERROR || 'devlog',
    channelNameFatal: process.env.SLACK_CHANNEL_NAME_FATAL || 'devlog',
  },
  loggerMode: process.env.LOGGER_MODE || 'development',
  isLoggingFile: process.env.IS_LOGGING_FILE || 'false',
  logDirectoryName: process.env.LOG_DIRECTORY_NAME || 'rem-api',
};
