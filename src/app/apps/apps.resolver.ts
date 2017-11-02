import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppsService } from './apps.service';
import { AppConfigService } from 'app/services/appConfig.service';


@Injectable()
export class AppsResolver implements Resolve<Object[]> {
  constructor(private appsService: AppsService, private appConfigService: AppConfigService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        this.appConfigService.assignGAppConfig({});
        return this.appsService.getAppList();
    }
}
