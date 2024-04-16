import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { BrowserService } from 'src/app/services/browser.service';
import { UtilityService } from 'src/app/services/utility.service';

type DeviceLogo = 'help-circle' | 'logo-android' | 'logo-apple' | 'desktop';
type BrowserLogo =
  | 'help-circle'
  | 'logo-capacitor'
  | 'logo-chrome'
  | 'logo-edge'
  | 'logo-firefox';
type FileAmount = 'none' | 'single' | 'multi';
type FileType = 'all' | 'media' | 'pdf';

@Component({
  selector: 'app-share',
  templateUrl: 'share.page.html',
  styleUrls: ['share.page.scss'],
})
export class SharePage {
  // General Variables
  loading: boolean = false;
  errMsg: string | undefined = undefined;

  // Device Variables
  deviceLogo: DeviceLogo = 'help-circle';
  deviceInfo: string = '';

  // Browser / isApp Variables
  browserLogo: BrowserLogo = 'help-circle';
  browserInfo: string = '';
  isApp: boolean = false;

  // FormGroup / FormControl Variables
  textFG = new FormGroup({
    dialogTitle: new FormControl({
      value: '',
      disabled: !this.platform.is('android'),
    }),
    title: new FormControl(''),
    text: new FormControl({
      value: '',
      disabled:
        this.platform.is('android') &&
        this.browserS.getBrowserName() === 'Firefox',
    }),
    url: new FormControl(''),
    hashtags: new FormControl(''),
    via: new FormControl(''),
    phoneNumber: new FormControl(''),
  });
  fileFG = new FormGroup({
    amount: new FormControl<FileAmount>({
      value: 'none',
      disabled: this.browserS.getBrowserName() === 'Firefox',
    }),
    type: new FormControl<FileType>({
      value: 'all',
      disabled: this.browserS.getBrowserName() === 'Firefox',
    }),
  });

  constructor(
    private platform: Platform,
    private utilS: UtilityService,
    public browserS: BrowserService
  ) {
    this.init();
  }

  // Getters for FormControls
  get dialogTitle() {
    return this.textFG.get('dialogTitle')?.value;
  }

  get title() {
    return this.textFG.get('title')?.value;
  }

  get text() {
    return this.textFG.get('text')?.value;
  }

  get url() {
    return this.textFG.get('url')?.value;
  }

  get hashtags() {
    return this.textFG.get('hashtags')?.value;
  }

  get via() {
    return this.textFG.get('via')?.value;
  }

  get phoneNumber() {
    return this.textFG.get('phoneNumber')?.value;
  }

  get fileAmount() {
    return this.fileFG.get('amount')!.value;
  }

  get acceptedTypes() {
    switch (this.fileFG.get('type')!.value) {
      case 'all':
        return '*/*';
      case 'media':
        return 'image/*, video/*';
      case 'pdf':
        return 'application/pdf';
      default:
        return '';
    }
  }

  // Getters for Share Url
  get facebookShareUrl() {
    return `https://www.facebook.com/sharer/sharer.php?u=${this.url}`
  }
  
  get redditShareurl() {
    return `https://reddit.com/submit?url=${this.url}&title=${this.title}`
  }

  get twitterShareUrl() {
    return `https://twitter.com/intent/tweet?text=${this.text}&url=${this.url}&hashtags=${this.hashtags}&via=${this.via}`
  }

  get linkedInShareUrl() {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${this.url}`
  }

  get whatsAppShareUrl() {
    return `https://api.whatsapp.com/send?phone=${this.phoneNumber}&text=${this.text}%20${this.url}`
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

  async share(event?: Event) {
    this.loading = true;
    this.errMsg = undefined;

    if (this.isApp) {
      const files: string[] = [];

      if (event && event.target instanceof HTMLInputElement) {
        const eventFiles = event.target.files;

        if (eventFiles !== null) {
          for (let i = 0; i < eventFiles?.length; i++) {
            const writeFileRes = await Filesystem.writeFile({
              path: `ionic-test/${eventFiles[i].name}`,
              directory: Directory.Cache,
              data: await this.utilS.toBase64(eventFiles[i]),
              recursive: true,
            });

            files.push(writeFileRes.uri);
          }
        }
      }

      try {
        await Share.share({
          dialogTitle: this.dialogTitle || undefined,
          title: this.title || undefined,
          text: this.text || undefined,
          url: this.url || undefined,
          files,
        });
      } catch (err: any) {
        if (err?.message && err?.message !== 'Share canceled') {
          this.errMsg = err.message;
        } else {
          console.error(err);
        }
      }
    } else {
      await navigator.share({
        title: this.title || undefined,
        text: this.text || undefined,
        url: this.url || undefined,
        files:
          event && event.target instanceof HTMLInputElement
            ? Array.from(event.target.files!)
            : undefined,
      });
    }
    this.loading = false;
  }

  uploadClick(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      event.target.value = '';
    }
  }
}
