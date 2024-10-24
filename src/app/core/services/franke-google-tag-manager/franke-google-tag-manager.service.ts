import {Inject, Injectable, Optional} from '@angular/core';
import {GoogleTagManagerConfig} from 'angular-google-tag-manager';

@Injectable({
  providedIn: 'root',
})
export class FrankeGoogleTagManagerService {
  private isLoaded = false;

  private browserGlobals = {
    windowRef(): any {
      return typeof window !== 'undefined' ? window : {};
    },
    documentRef(): any {
      return typeof document !== 'undefined' ? document : {};
    },
  };

  constructor(
    @Optional()
    @Inject('googleTagManagerConfig')
    public config: GoogleTagManagerConfig = {id: null},
    @Optional() @Inject('googleTagManagerId') public googleTagManagerId: string,
    @Optional()
    @Inject('googleTagManagerAuth')
    public googleTagManagerAuth: string,
    @Optional()
    @Inject('googleTagManagerPreview')
    public googleTagManagerPreview: string
  ) {

    if (this.config == null) {
      this.config = {id: null};
    }

    this.config = {
      ...this.config,
      id: googleTagManagerId || this.config.id,
      gtm_auth: googleTagManagerAuth || this.config.gtm_auth,
      gtm_preview: googleTagManagerPreview || this.config.gtm_preview,
    };
    if (this.config.id == null) {
      this.config.id = 'GTM-MPWQFRL';
    }
  }

  public getDataLayer(): any[] {
    const window = this.browserGlobals.windowRef();
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }

  public addGtmToDom(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        return resolve(this.isLoaded);
      }
      const doc = this.browserGlobals.documentRef();
      this.pushOnDataLayer({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });

      const gtmScript = doc.createElement('script');
      gtmScript.id = 'GTMscript';
      gtmScript.async = true;
      gtmScript.src = this.applyGtmQueryParams(
        'https://www.googletagmanager.com/gtm.js'
      );
      gtmScript.addEventListener('load', () => {
        return resolve((this.isLoaded = true));
      });
      gtmScript.addEventListener('error', () => {
        return reject(false);
      });
      doc.head.insertBefore(gtmScript, doc.head.firstChild);
    });
  }

  public pushTag(item: object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.isLoaded) {
        this.addGtmToDom()
          .then(() => {
            this.pushOnDataLayer(item);
            return resolve();
          })
          .catch(() => reject());
      }
      this.pushOnDataLayer(item);
      return resolve();
    });
  }

  private pushOnDataLayer(obj: object): void {
    const dataLayer = this.getDataLayer();
    dataLayer.push(obj);
  }

  private applyGtmQueryParams(url: string): string {
    if (url.indexOf('?') === -1) {
      url += '?';
    }

    return (
      url +
      Object.keys(this.config)
        .filter((k) => this.config[k])
        .map((k) => `${k}=${this.config[k]}`)
        .join('&')
    );
  }
}
