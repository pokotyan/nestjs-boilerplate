import config from '.';

const settings = {
  stdout: {
    appenders: {
      console: {
        type: 'console',
        layout: {
          type: 'colored',
        },
      },
    },
    categories: {
      default: {
        appenders: ['console'],
        level: 'ALL',
      },
      system: {
        appenders: ['console'],
        level: 'ALL',
      },
      api: {
        appenders: ['console'],
        level: 'ALL',
      },
      sql: {
        appenders: ['console'],
        level: 'ALL',
      },
      slack: {
        appenders: ['console'],
        level: 'ALL',
      },
      auth: {
        appenders: ['console'],
        level: 'ALL',
      },
    },
    disableClustering: true,
  },
  fileout: {
    categories: {
      default: {
        appenders: ['system', 'console'],
        level: 'ALL',
      },
      system: {
        appenders: ['system', 'console'],
        level: 'ALL',
      },
      api: {
        appenders: ['api', 'console'],
        level: 'ALL',
      },
      sql: {
        appenders: ['sql', 'console'],
        level: 'ALL',
      },
      slack: {
        appenders: ['slack', 'console'],
        level: 'ALL',
      },
      auth: {
        appenders: ['auth', 'console'],
        level: 'INFO',
      },
    },
    appenders: {
      system: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd',
        filename: `/var/log/${config.logDirectoryName}/system.log`,
        layout: {
          type: 'basic',
        },
      },
      api: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd',
        filename: `/var/log/${config.logDirectoryName}/api.log`,
        layout: {
          type: 'basic',
        },
      },
      sql: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd',
        filename: `/var/log/${config.logDirectoryName}/sql.log`,
        layout: {
          type: 'basic',
        },
      },
      slack: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd',
        filename: `/var/log/${config.logDirectoryName}/slack.log`,
        layout: {
          type: 'basic',
        },
      },
      auth: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd',
        filename: `/var/log/${config.logDirectoryName}/auth.log`,
        layout: {
          type: 'basic',
        },
      },
      console: {
        type: 'console',
        layout: {
          type: 'basic',
        },
      },
    },
    disableClustering: true,
  },
};

export default config.isLoggingFile === 'true' ? settings.fileout : settings.stdout;
