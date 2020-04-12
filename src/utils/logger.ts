import { configure, getLogger, Logger } from 'log4js';
import loggerSettings from '../config/logger-setting';
import SlackNotify from './slack';

configure(loggerSettings);

class SlackLogManager {
  private logger: Logger;
  private slack = SlackNotify;
  constructor() {
    this.logger = getLogger('slack');
  }

  public trace(message: string): void {
    this.logger.trace(message);
  }

  public debug(message: string) {
    this.logger.debug(message);
    return this.slack.debug(message);
  }

  public info(message: string) {
    this.logger.info(message);
    return this.slack.info(message);
  }

  public warn(message: string) {
    this.logger.warn(message);
    return this.slack.warn(message);
  }

  public error(message: string) {
    this.logger.error(message);
    return this.slack.error(message);
  }

  public fatal(message: string) {
    this.logger.fatal(message);
    return this.slack.fatal(message);
  }
}

const logger = {
  system: getLogger('system'),
  api: getLogger('api'),
  sql: getLogger('sql'),
  slack: new SlackLogManager(),
};

export default logger;
