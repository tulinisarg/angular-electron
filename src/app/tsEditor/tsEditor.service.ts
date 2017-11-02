import { Injectable } from '@angular/core';
import { Services } from '@jatahworx/bhive-core';
import { DialogService } from '../services/dialog.service';

@Injectable()
export class TsEditorService {

  appPageService = new Services.AppPageService();
  constructor(private dialogService: DialogService) { }

  getPageTs(appName, appPageName) {
    return new Promise((resolve, reject) => {
      this.appPageService.getAppPageTs(appName, appPageName).then(result => {
        return resolve(result.data);
      }).catch(result => {
        this.dialogService.openSnackBar(result.error);
        // return resolve(result.data = '');
      });
    })

  }

}
