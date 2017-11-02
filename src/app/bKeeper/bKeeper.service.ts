import { Injectable } from '@angular/core';
import { Services, AppPageDesign } from '@jatahworx/bhive-core'

@Injectable()
export class BKeeperService {

  appPageService = new Services.AppPageService();
  constructor() { }

  getAppPageDesign(appName, appPageName) {
    return new Promise((resolve, reject) => {
      this.appPageService.getAppPageDesign(appName, appPageName).then(result => {
        return resolve(result.data);
      }).catch(result => {
        console.error(result.error);
        return resolve(new AppPageDesign("", {}));
      });
    });

  }

}
