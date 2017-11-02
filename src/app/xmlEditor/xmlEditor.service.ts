import { Injectable } from '@angular/core';
import { Services } from '@jatahworx/bhive-core';
import { DialogService } from '../services/dialog.service';

@Injectable()
export class XmlEditorService {

  appPageService = new Services.AppService();

  constructor(private dialogService: DialogService) { }

  getCordovaConfigXml(appName) {
    return new Promise((resolve, reject) => {
      this.appPageService.getCordovaConfigXml(appName).then(result => {
        resolve(result['data']);
      }).catch(error => {
          console.error(error);
      });
    });
  }

  putCordovaConfigXml(appName, xml) {
    this.appPageService.putCordovaConfigXml(appName, xml).then(result => {
      this.dialogService.openSnackBar(result.data);
    }).catch(error => {
      console.error(error);
    });
  }
}
