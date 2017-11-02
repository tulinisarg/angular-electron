import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WorkspaceService, Services } from '@jatahworx/bhive-core';

@Injectable()
export class AdRootService {

  private workspace;
  workspaceservice = new Services.WorkspaceService();
  // adRootService = new AdRootService();
  constructor() {

  }

  updateWorkspace() {
    return new Promise((resolve, reject) => {
      this.workspaceservice.getWSPath().then((result) => {
        if (result && result.hasOwnProperty('data')) {
          // this.adRootService.wsPath(result.data);
          this.workspace = result.data;
          return resolve(result.data);
        }
      }).catch(error => {
        console.error(error);
      });
    });
  }

  set wsPath(path) {
    this.workspace = path;
  }

  get wsPath() {
    return this.workspace;
  }

}