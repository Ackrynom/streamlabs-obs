import { Service } from 'services/service';
import { UserService } from 'services/user';
import { Inject } from 'util/injector';
import { HostsService } from 'services/hosts';
import { handleErrors } from 'util/requests';
import io from 'socket.io-client';
import uuid from 'uuid/v4';
import fs from 'fs';
import path from 'path';
import electron from 'electron';
import rimraf from 'rimraf';
import { without } from 'lodash';

interface IStreamlabelActiveSubscriptions {
  filename: string;
  subscribers: string[];
}


/**
 * Returned to streamlabels subscribers.  Contains
 * information about the subscription, and must be
 * passed back when unsubscribing.
 */
export interface IStreamlabelSubscription {
  id: string;
  statname: string;
  path: string;
}


export interface IStreamlabelSettings {
  format: string;
  item_format?: string;
  item_separator?: string;
  limit?: number;
  duration?: number;
  show_clock?: 'always' | 'active';
  show_count?: 'always' | 'active';
  show_latest?: 'always' | 'active';
  include_resubs?: boolean;
}


interface ITrainInfo {
  mostRecentEventAt: number;
  mostRecentName: string;
  counter: number;
  setting: string;
}


interface IDonationTrainInfo extends ITrainInfo {
  mostRecentAmount: number;
  totalAmount: number;
  donationTrain: boolean;
}


interface ITrains {
  donation: IDonationTrainInfo;
  subscription: ITrainInfo;
  follow: ITrainInfo;
}

type TTrainType = 'donation' | 'follow' | 'subscription';

type TSocketEvent =
  IStreamlabelsSocketEvent |
  IDonationSocketEvent |
  IFollowSocketEvent |
  ISubscriptionSocketEvent;

interface IStreamlabelsSocketEvent {
  type: 'streamlabels';
  message: {
    data: Dictionary<string>;
  };
}

interface IDonationSocketEvent {
  type: 'donation';
  message: {
    name: string;
    amount: string;
  }[];
}

interface IFollowSocketEvent {
  type: 'follow';
  message: {
    name: string;
  }[];
}

interface ISubscriptionSocketEvent {
  type: 'subscription';
  message: {
    name: string;
  }[];
}


function isDonationTrain(train: ITrainInfo | IDonationTrainInfo): train is IDonationTrainInfo {
  return (train as IDonationTrainInfo).donationTrain;
}


export class StreamlabelsService extends Service {

  @Inject() userService: UserService;
  @Inject() hostsService: HostsService;


  /**
   * Represents the raw strings that should be
   * written to the files.
   */
  output: Dictionary<string> = {};

  /**
   * Represents settings which are stored on the server
   */
  settings: Dictionary<IStreamlabelSettings> = {};

  /**
   * Holds info about currently active subscribers
   */
  subscriptions: Dictionary<IStreamlabelActiveSubscriptions> = {};


  trainInterval: number;


  /**
   * Holds data about the currently running trains.
   * Will be updated by socket events and be used to
   * generate output.
   */
  trains: ITrains = {
    donation: {
      mostRecentEventAt: null,
      mostRecentName: null,
      counter: 0,
      mostRecentAmount: null,
      totalAmount: 0,
      donationTrain: true,
      setting: 'train_tips'
    },
    subscription: {
      mostRecentEventAt: null,
      mostRecentName: null,
      counter: 0,
      setting: 'train_twitch_subscriptions'
    },
    follow: {
      mostRecentEventAt: null,
      mostRecentName: null,
      counter: 0,
      setting: 'train_twitch_follows'
    }
  };


  init() {
    this.ensureDirectory();
    this.fetchInitialData();
    this.fetchSettings();
    this.initSocketConnection();
    this.initTrainClockInterval();
  }


  /**
   * Subscribe to a particular streamlabels stat
   * @param statname the stat to subscribe to
   */
  subscribe(statname: string): IStreamlabelSubscription {
    const subscriptionId = uuid();

    if (this.subscriptions[statname]) {
      this.subscriptions[statname].subscribers.push(subscriptionId);
    } else {
      this.subscriptions[statname] = {
        filename: uuid(),
        subscribers: [subscriptionId]
      };

      this.writeFileForStat(statname);
    }

    const subscription: IStreamlabelSubscription = {
      id: subscriptionId,
      path: this.getStreamlabelsPath(this.subscriptions[statname].filename),
      statname
    };

    return subscription;
  }


  /**
   * End a streamlabel subscription
   * @param subscription the subscription object
   */
  unsubscribe(subscription: IStreamlabelSubscription) {
    const subInfo = this.subscriptions[subscription.statname];

    if (!subInfo) return;

    subInfo.subscribers = without(subInfo.subscribers, subscription.id);

    if (subInfo.subscribers.length === 0) {
      delete this.subscriptions[subscription.statname];
    }
  }


  getSettingsForStat(statname: string) {
    const settings = { ...this.settings[statname] };

    if (settings.item_separator) {
      settings.item_separator = settings.item_separator.replace(/\n/gi, '\\n');
    }

    return settings;
  }


  setSettingsForStat(statname: string, settings: IStreamlabelSettings): Promise<boolean> {
    if (settings.item_separator) {
      settings.item_separator = settings.item_separator.replace(/\\n/gi, '\n');
    }

    this.settings[statname] = {
      ...this.settings[statname],
      ...settings
    };

    // Because trains are client-side, we can force a fast update
    if (['train_tips', 'train_twitch_follows', 'train_twitch_subscriptions'].includes(statname)) {
      this.outputAllTrains();
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `https://${this.hostsService.streamlabs}/api/v5/slobs/stream-labels` +
    `/settings?token=${this.userService.widgetToken}`;
    const request = new Request(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(this.settings)
    });

    return fetch(request)
      .then(handleErrors)
      .then(() => true);
  }


  private log(message: string, ...args: any[]) {
    console.debug(`Streamlabels: ${message}`, ...args);
  }


  /**
   * Attempt to load initial data via HTTP instead of waiting
   * for a socket event
   */
  private fetchInitialData(): void {
    if (!this.userService.isLoggedIn()) return;

    const url = `https://${this.hostsService.streamlabs}/api/v5/slobs/stream-labels` +
      `/files?token=${this.userService.widgetToken}`;
    const request = new Request(url);

    fetch(request)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => this.updateOutput(json.data));
  }


  private fetchSettings(): void {
    if (!this.userService.isLoggedIn()) return;

    const url = `https://${this.hostsService.streamlabs}/api/v5/slobs/stream-labels` +
      `/settings?token=${this.userService.widgetToken}`;
    const request = new Request(url);

    fetch(request)
      .then(handleErrors)
      .then(response => response.json())
      .then(settings => this.updateSettings(settings));
  }


  private initSocketConnection(): void {
    if (!this.userService.isLoggedIn()) {
      console.warn('User must be logged in for streamlabels socket connection');
      return;
    }

    const url = `https://${this.hostsService.streamlabs}/api/v5/slobs/socket-token/${this.userService.widgetToken}`;
    const request = new Request(url);

    fetch(request)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => json.socket_token)
      .then(token => {
        const url = `https://aws-io.${this.hostsService.streamlabs}?token=${token}`;
        const socket = io(url, { transports: ['websocket'] });

        // These are useful for debugging
        socket.on('connect', () => this.log('Connection Opened'));
        socket.on('connect_error', (e: any) => this.log('Connection Error', e));
        socket.on('connect_timeout', () => this.log('Connection Timeout'));
        socket.on('error', () => this.log('Error'));
        socket.on('disconnect', () => this.log('Connection Closed'));

        socket.on('event', (e: any) => this.onSocketEvent(e));
      });
  }


  private initTrainClockInterval() {
    this.trainInterval = window.setInterval(() => {
      Object.keys(this.trains).forEach((trainType: TTrainType) => {
        const train = this.trains[trainType] as ITrainInfo;

        if (train.mostRecentEventAt == null) return;

        const statname = `${trainType}_train_clock`;
        const settings = this.getSettingsForStat(train.setting);

        // There is currently a bug where this will sometimes come back
        // from the server as a string.
        const duration = parseInt(settings.duration as any, 10) * 1000;
        const msRemaining = duration - (Date.now() - train.mostRecentEventAt);

        if (msRemaining < 0) {
          this.clearTrain(trainType);
          this.outputTrainInfo(trainType);
        } else {
          const minutes = Math.floor(msRemaining / (60 * 1000));
          const seconds = Math.floor(msRemaining % (60 * 1000) / 1000);
          const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

          this.updateOutput({
            [statname]: formatted
          });
        }
      });
    }, 1000);
  }


  private clearTrain(trainType: TTrainType) {
    const train = this.trains[trainType] as ITrainInfo | IDonationTrainInfo;

    if (isDonationTrain(train)) {
      train.mostRecentAmount = null;
      train.totalAmount = 0;
    }

    train.counter = 0;
    train.mostRecentEventAt = null;
    train.mostRecentName = null;
  }


  private outputAllTrains() {
    Object.keys(this.trains).forEach((train: TTrainType) => this.outputTrainInfo(train));
  }


  /**
   * Outputs all files on a train, except for the clock while the
   * train is running.
   */
  private outputTrainInfo(trainType: TTrainType) {
    const train = this.trains[trainType] as ITrainInfo | IDonationTrainInfo;
    const settings = this.getSettingsForStat(train.setting);
    const output = {
      [`${trainType}_train_counter`]: settings.show_count ? train.counter.toString() : '',
      [`${trainType}_train_latest_name`]: settings.show_latest ? train.mostRecentName || '' : ''
    };

    if (isDonationTrain(train)) {
      const latestAmount = train.mostRecentAmount ?
        train.mostRecentAmount.toFixed(2) : '';
      const totalAmount = train.totalAmount ?
        train.totalAmount.toFixed(2) : '';

      output[`${trainType}_train_latest_amount`] = latestAmount;
      output[`${trainType}_train_total_amount`] = totalAmount;
    }

    if (train.mostRecentEventAt == null) {
      output[`${trainType}_train_clock`] = settings.show_clock === 'always' ? '0:00' : '';
    }

    this.updateOutput(output);
  }


  private onSocketEvent(event: TSocketEvent) {
    this.log('Socket Event', event);

    if (event.type === 'streamlabels') {
      this.updateOutput(event.message.data);
    } else if (event.type === 'donation') {
      this.trains.donation.mostRecentEventAt = Date.now();
      this.trains.donation.counter += event.message.length;
      this.trains.donation.totalAmount += event.message.reduce((sum: number, donation: any) => {
        return sum + parseFloat(donation.amount);
      }, 0);

      const latest = event.message[event.message.length - 1];
      this.trains.donation.mostRecentName = latest.name;
      this.trains.donation.mostRecentAmount = parseFloat(latest.amount);

      this.outputTrainInfo('donation');
    } else if (event.type === 'follow') {
      this.trains.follow.mostRecentEventAt = Date.now();
      this.trains.follow.counter += event.message.length;

      const latest = event.message[event.message.length - 1];
      this.trains.follow.mostRecentName = latest.name;

      this.outputTrainInfo('follow');
    } else if (event.type === 'subscription') {
      this.trains.subscription.mostRecentEventAt = Date.now();
      this.trains.subscription.counter += event.message.length;

      const latest = event.message[event.message.length - 1];
      this.trains.subscription.mostRecentName = latest.name;

      this.outputTrainInfo('subscription');
    }
  }


  private ensureDirectory() {
    if (fs.existsSync(this.streamlabelsDirectory)) {
      rimraf.sync(this.streamlabelsDirectory);
    }

    fs.mkdirSync(this.streamlabelsDirectory);
  }


  private get streamlabelsDirectory() {
    return path.join(electron.remote.app.getPath('userData'), 'Streamlabels');
  }


  private getStreamlabelsPath(filename: string) {
    return path.join(this.streamlabelsDirectory, `${filename}.txt`);
  }

  /**
   * Applies a patch to the settings object
   * @param settingsPatch the new settings to be applied
   */
  private updateSettings(settingsPatch: Dictionary<IStreamlabelSettings>) {
    this.settings = {
      ...this.settings,
      ...settingsPatch
    };
    this.outputAllTrains();
  }


  /**
   * Applies a patch to the output object and writes files for
   * the newly updated outputs.
   * @param outputPatch the new output strings
   */
  private updateOutput(outputPatch: Dictionary<string>) {
    this.output = {
      ...this.output,
      ...outputPatch
    };

    Object.keys(outputPatch).forEach(stat => this.writeFileForStat(stat));
  }


  /**
   * Writes data for a particular stat.  Will not do anything
   * if there is no data available for that stat, or if there
   * are no subscribers for that particular stat.
   */
  private writeFileForStat(statname: string) {
    if (this.output[statname] == null) return;
    if (this.subscriptions[statname] == null) return;

    electron.ipcRenderer.send('streamlabels-writeFile', {
      path: this.getStreamlabelsPath(this.subscriptions[statname].filename),
      data: this.output[statname]
    });
  }

}
