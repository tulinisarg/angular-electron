import { AppRoute, Services } from '@jatahworx/bhive-core';
import { Injectable } from '@angular/core';
import { Utility } from '../util/util';


export interface AppRouteObject {
  path: string;
  page: string;
  pathMatch: Boolean;
  redirectTo: AppRouteObject,
  resolve: Object;
  data: Object;
  children: string[]
}

@Injectable()
export class AdAppRoutingService {
  private _appService = new Services.AppService();
  constructor() {

  }

  setAppRoutes(appName, appRoutes): Promise<any> {
    return new Promise((resolve, reject) => {
      this._appService.setAppRoutes(appName, appRoutes).then(result => {
        resolve(result);
      }, reason => {
        console.error(reason);
        resolve({});
      });
    });
  }
}
