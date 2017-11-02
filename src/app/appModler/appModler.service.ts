import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Services } from '@jatahworx/bhive-core';

@Injectable()
export class AppModlerService {

  appService = new Services.AppService();

  getAppData(appName) {
    return new Promise((resolve, reject) => {
      this.appService.getByAppName(appName).then(result => {
        if (result) {
          resolve(result.data);
        }
      }).catch(error => {
        console.error(error);
        reject({});
      });
    });
  }
}
