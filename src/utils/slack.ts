import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import request from 'axios';
import config from '../config';

const env = config.loggerMode;
const appName = config.appName;

class Slack {
  private endpoint: string = config.slack.webhookEndPoint;

  public send(channel: string, message: string, isSetPrefix = true) {
    let fmtMessage = message;

    if (isSetPrefix) {
      dayjs.extend(utc);
      const now = dayjs()
        .utc()
        .add(9, 'hour')
        .format('YYYY/MM/DD HH:mm:ss');

      fmtMessage = `[${appName}][${now}][${env}][${channel.toUpperCase()}]\n${fmtMessage}`;
    }

    let targetChannel = channel;
    if (env !== 'production') {
      targetChannel = 'devlog';
    }

    return this._send(targetChannel, fmtMessage);
  }

  public debug(message: string) {
    return this.send('debug', message, true);
  }

  public info(message: string) {
    return this.send(config.slack.channelNameInfo, message, true);
  }

  public warn(message: string) {
    return this.send(config.slack.channelNameWarn, message, true);
  }

  public error(message: string) {
    return this.send(config.slack.channelNameError, message, true);
  }

  public fatal(message: string) {
    return this.send(config.slack.channelNameFatal, message, true);
  }

  private _send(channel: string, message: string) {
    if (!message) {
      return Promise.resolve('not message');
    }

    return request.post(this.endpoint, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      link_names: 1,
      channel: channel.substr(0, 1) === '@' ? `${channel.substr(1)}` : `${channel}`,
      username: 'ryanbot',
      text: message,
    });
  }
}

export default new Slack();
