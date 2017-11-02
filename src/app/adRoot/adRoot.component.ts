import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Workspace } from '@jatahworx/bhive-core';
import { AppConfigService } from '../services/appConfig.service';
import { AppOperationService } from '../services/appOperation.service';
import { AppsService } from '../apps/apps.service';
import { AdRootService } from './adRoot.service'

@Component({
  selector: 'ad-root',
  templateUrl: './adRoot.template.html'
})

export class AdRootComponent implements OnInit {
  appConfig;

  constructor(private appConfigService: AppConfigService, private titleService: Title, private appOperationService: AppOperationService, private adrootservice: AdRootService) {

  }

  ngOnInit() {

    const ws = new Workspace(this.adrootservice.wsPath);

    this.appOperationService.subscribeToAppOperation('APP_OPERATION_EVENT_SUCCESS');
    this.appOperationService.subscribeToAppOperation('APP_OPERATION_EVENT_ERROR');
    this.appOperationService.subscribeToAppOperation('EXPORT_APP');
    this.appOperationService.subscribeToAppOperation('IMPORT_APP');
    this.appConfigService.gAppConfigObservable.subscribe((res) => {
      let appName = 'Bhive AD' + '-' + this.adrootservice.wsPath;
      if (Object.keys(res).length !== 0 && res.constructor === Object) {
        appName = appName + ' - ' + res.appName;
      }
      this.setTitle(appName);
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
