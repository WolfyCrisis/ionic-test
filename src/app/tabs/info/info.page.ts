import { Component, NgZone, OnDestroy } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-info',
  templateUrl: 'info.page.html',
  styleUrls: ['info.page.scss'],
})
export class InfoPage implements OnDestroy {
  //General Variables
  isApp: boolean = false;

  //Information Variables
  appInfo: { [key: string]: any } = {
    id: null,
    name: null,
    build: null,
    version: null,
    launchUrl: null,
    state: false,
  };
  deviceInfo: { [key: string]: any } = {
    id: null,
    name: null,
    model: null,
    platform: null,
    operatingSystem: null,
    osVersion: null,
    iOSVersion: null,
    androidSDKVersion: null,
    manufacturer: null,
    isVirtual: null,
    memUsed: null,
    diskFree: null,
    diskTotal: null,
    realDiskFree: null,
    realDiskTotal: null,
    webViewVersion: null,
    batteryLevel: null,
    isCharging: null,
    languageCode: null,
    languageTag: null,
  };
  networkInfo: { [key: string]: any } = {
    connected: null,
    connectionType: null,
  };

  //Listerners Variables
  appStateListerner: PluginListenerHandle | undefined;
  networkListener: PluginListenerHandle | undefined;

  constructor(private ngZone: NgZone) {
    this.init();
  }

  ngOnDestroy() {
    this.appStateListerner?.remove();
    this.networkListener?.remove();
  }

  async init() {
    this.isApp = Capacitor.isNativePlatform();

    if (this.isApp) {
      //Initialize App Information
      this.appInfo = {
        ...(await App.getInfo()),
        launchUrl: (await App.getLaunchUrl())?.url || null,
        state: (await App.getState()).isActive,
      };

      //Initialize App State Listener
      this.appStateListerner = await App.addListener(
        'appStateChange',
        async () => {
          const { isActive } = await App.getState();

          this.ngZone.run(() => {
            console.warn(`App State: ${isActive}`);
            this.appInfo['state'] = isActive;
          });
        }
      );

      //Initialize Device Information
      this.deviceInfo = {
        ...this.deviceInfo,
        id: (await Device.getId()).identifier,
        ...(await Device.getInfo()),
        ...(await Device.getBatteryInfo()),
        languageCode: (await Device.getLanguageCode()).value,
        languageTag: (await Device.getLanguageTag()).value,
      };
    }

    //Initialize Network Information
    this.networkInfo = await Network.getStatus();

    //Initialize Network Listener
    this.networkListener = await Network.addListener(
      'networkStatusChange',
      (status) => {
        this.networkInfo = status;
      }
    );
  }
}
