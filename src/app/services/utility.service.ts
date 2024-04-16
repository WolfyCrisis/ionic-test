import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private platform: Platform) {}

  toBase64 = (file: File) =>
    new Promise<any>((resolve, reject) => {
      const reader = new FileReader();

      if (this.platform.is('android') || this.platform.is('ios')) {
        const zoneOriginalInstance = (reader as any)
          .__zone_symbol__originalInstance;
        zoneOriginalInstance.readAsDataURL(file);
        zoneOriginalInstance.onload = () =>
          resolve(zoneOriginalInstance.result);
        zoneOriginalInstance.onerror = (error: any) => reject(error);
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error: any) => reject(error);
      }
    });
}
