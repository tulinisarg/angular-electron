import { Injectable } from '@angular/core';
import { Services, AppPage } from '@jatahworx/bhive-core';

@Injectable()
export class PagesService {

  appPageService = new Services.AppPageService();

  constructor() { }

  createPage(appName, pageDetails) {
    const pageObj = new AppPage(pageDetails.pageName);
    return new Promise((resolve, reject) => {
      this.appPageService.create(appName, pageObj).then(result => {
        if (result.httpStatus == 201) {
          resolve(pageObj);
        }
      }).catch(error => {
        console.error(error);
      });
    });
  }

}
