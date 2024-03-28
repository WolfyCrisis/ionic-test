import { Injectable } from '@angular/core';
import * as Bowser from 'bowser';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {
  bowser = Bowser.getParser(window.navigator.userAgent);

  constructor() {}

  getBrowserName() {
    return this.bowser.getBrowserName()
  }

  getBrowserVersion() {
    return this.bowser.getBrowserVersion()
  }
}
