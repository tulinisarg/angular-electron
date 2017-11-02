import { Injectable } from '@angular/core';
import { Services } from '@jatahworx/bhive-core';

@Injectable()
export class cssEditorService {

  appPageService = new Services.AppService();

  constructor() { }

  getAppCss(appName) {
    return new Promise((resolve, reject) => {
      this.appPageService.getStyleCss(appName).then(result => {
        resolve(result['data']);
      }).catch(error => {
          console.error(error);
      });
    });
  }
  putAppCss(appName, css) {
    this.appPageService.putStyleCss(appName, css).then(result => {
        console.log(result);
    }).catch(error => {
      console.error(error);
    });
  }
}
