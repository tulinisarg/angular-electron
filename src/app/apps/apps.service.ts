import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as bhiveCore from '@jatahworx/bhive-core';
import { App, Services, AppService } from '@jatahworx/bhive-core';
import { WorkspaceService } from '@jatahworx/bhive-core';




@Injectable()
export class AppsService {

  appService = new Services.AppService();
  workspaceservice = new Services.WorkspaceService();

  archiveService = new Services.ArchiveService();
  constructor() { }

  getAppList() {
    return new Promise((resolve, reject) => {
      this.appService.getAll().then(apps => {
        if (apps.data.length > 0) {
          resolve(apps.data);
        } else {
          resolve([]);
        }
      }).catch(error => {
        reject(error);
        // console.error(error);
      });
    });
  }

  createApp(appObj) {
    return new Promise((resolve, reject) => {
      if (appObj) {
        var nwAppObj = new App(appObj.appName, appObj.description, 'user', appObj.artUrl, appObj.tenant);
        this.appService.create(nwAppObj).then(result => {
          if (result.httpStatus == 201) {
            resolve(nwAppObj);
          }
        }).catch(error => {
          console.error(error);
        });
      }
    });
  }

  removeApp(appName) {
    return new Promise((resolve, reject) => {
      this.appService.remove(appName).then(result => {
        resolve(result);
      }).catch(error => {
        console.error(error);
      });

    });
  }
  // }

  createZip(appName, exportPath) {
    return new Promise((resolve, reject) => {
      this.archiveService.createZip(appName, exportPath).then(result => {
        resolve(result);
      }).catch(err => {
        console.error(err);
        // reject(err);
      });
    });

  }

  unZip(zipFolderPath, overRideDirBol) {
    return new Promise((resolve, reject) => {
      this.archiveService.unZipDir(zipFolderPath, overRideDirBol).then(apps => {
        resolve(apps.data)
      }).catch(err => {
        console.error(err);
        reject(err);
      });
    });
  }

  updateWsObj(updatePath) {
    return new Promise((resolve, reject) => {
      this.workspaceservice.updataWsObj(updatePath).then((result) => {
        return resolve(result);
      }).catch(error => {
        console.error(error);
      });
    }
    )
  }
}
