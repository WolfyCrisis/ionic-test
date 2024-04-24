import { Component, Input, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { BrowserService } from 'src/app/services/browser.service';

type DeviceLogo = 'help-circle' | 'logo-android' | 'logo-apple' | 'desktop';
type BrowserLogo =
  | 'help-circle'
  | 'logo-capacitor'
  | 'logo-chrome'
  | 'logo-edge'
  | 'logo-firefox';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title = ''
  // Device Variables
  deviceLogo: DeviceLogo = 'help-circle';
  deviceInfo: string = '';

  // Browser / isApp Variables
  browserLogo: BrowserLogo = 'help-circle';
  browserInfo: string = '';
  isApp: boolean = false;

  constructor(private platform: Platform, public browserS: BrowserService) {
    this.init();
  }

  // Initialization
  async init() {
    this.deviceLogo = this.platform.is('desktop')
      ? 'desktop'
      : this.platform.is('android')
      ? 'logo-android'
      : this.platform.is('ios')
      ? 'logo-apple'
      : 'help-circle';
    this.deviceInfo = await Device.getInfo().then((val) => {
      const { manufacturer, model, operatingSystem, osVersion } = val;
      return `${manufacturer} ${model} (${operatingSystem} ${osVersion})`;
    });
    this.isApp = Capacitor.isNativePlatform();

    if (this.isApp) {
      this.browserLogo = 'logo-capacitor';
    } else {
      this.browserInfo = `${this.browserS.getBrowserName()} (${this.browserS.getBrowserVersion()})`;

      switch (this.browserS.getBrowserName()) {
        case 'Chrome':
          this.browserLogo = 'logo-chrome';
          break;
        case 'Microsoft Edge':
          this.browserLogo = 'logo-edge';
          break;
        case 'Firefox':
          this.browserLogo = 'logo-firefox';
          break;
        default:
          this.browserLogo = 'help-circle';
          break;
      }
    }
  }
}
