import { Utility } from 'app/util/util';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
// import { AppTabService } from '../services/appTab.service';
import { DialogService } from '../services/dialog.service';
import { CreatePageComponent } from '../pages/createPage.component';
import { AppModlerService } from './appModler.service';
import { MdDialogRef, MdSidenav } from '@angular/material';
import { AppConfigService } from '../services/appConfig.service';
import { PubSubService } from '../services/pubSub.service';
import { CreateDataModelComponent } from '../dataModel/createDataModel.component';
import { DataModelService } from '../dataModel/dataModel.service';
import { PagesService } from '../pages/pages.service';
import { Services } from '@jatahworx/bhive-core';
import { CreateEnvironmentComponent } from '../environments/createEnvironment/createEnvironment.component';
import { EnvironmentService } from '../environments/environment.service';
import { CreateNgServiceComponent } from '../ngServices/createNgService/createNgService.component';
import { NgServicesService } from '../ngServices/ngService.service';
const shell = require('electron').shell;

@Component({
  selector: 'bh-app-modler',
  templateUrl: './appModler.template.html',
  styleUrls: ['./appModler.style.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(100%)', opacity: 0 }),
          animate('100ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateY(0)', opacity: 1 }),
          animate('100ms', style({ transform: 'translateY(100%)', opacity: 0 }))
        ])
      ]
    )
  ]
})
export class AppModlerComponent implements OnInit, OnDestroy {
  @Input() mode = 'slider';
  @Output() selectedIndexChange = new EventEmitter();
  @ViewChild('sidenav') slider: MdSidenav;

  dialogRef: MdDialogRef<any>;
  selectedIndex = -1;
  tabChangeEvent;
  tabs = [];
  toggleSideNav;
  appConfig;
  appPage;
  dataModelObj;
  dataModelArr;
  config;
  tempDataModelObj;
  pageListObj;
  tempPageListObj;
  utility;
  toggle: Object = {
    pages: false,
    models: false,
    add: false,
    expanded: false
  };
  _nodeRedUrl;
  isServerStarted = false;
  appConfigSub;
  environmentObject;
  tempEnvironmentObject;
  environmentArray;
  ngServiceObj;
  tempNgServiceObj;
  nrService = new Services.NRService();
  constructor(private dialogService: DialogService, private appConfigService: AppConfigService,
    private appModlerService: AppModlerService, private activatedRoute: ActivatedRoute, private pubsub: PubSubService,
    private dataModelService: DataModelService, private pagesService: PagesService, private environmentService: EnvironmentService,
    private ngServicesService: NgServicesService) {
    this.utility = new Utility();
  }

  ngOnInit() {
    /**
     * getting the resolved data
     */
    this.appConfig = this.activatedRoute.snapshot.data['appData'];
    /* Initializing nodeREd url */
    this.nrService.initialize(this.appConfig.appName).then(result => {
      if (result['data']) {
        this.isServerStarted = true;
        this._nodeRedUrl = result.data.nrUrl;
      }
    }).catch(error => {
      console.error(error);
    });
    /* Get All Providers */
    this.ngServicesService.getAllProviders(this.appConfig.appName).then(result => {
      this.appConfig['appProviders'] = result;
      this.appConfigSub = this.appConfigService.assignGAppConfig(this.appConfig); // setting the global appConfig
    }, error => {
      console.log(error);
    });

    this.appConfigSub = this.appConfigService.assignGAppConfig(this.appConfig); // setting the global appConfig
    this.appConfigService.gAppConfigObservable.subscribe(gAppCongfig => {
      this.appConfig = gAppCongfig;
      this.tempDataModelObj = gAppCongfig['dataModels'];
      this.dataModelObj = this.utility.generateArrayOfKeyValuePairs(gAppCongfig['dataModels']);
      this.dataModelArr = this.utility.generateArrayOfKeys(gAppCongfig['dataModels']);
      this.pageListObj = this.utility.generateArrayOfKeyValuePairs(gAppCongfig['appPages']);
      this.tempPageListObj = gAppCongfig['appPages'];
      this.environmentObject = this.utility.generateArrayOfKeyValuePairs(gAppCongfig['environment']);
      this.tempEnvironmentObject = gAppCongfig['environment'];
      this.environmentArray = this.utility.generateArrayOfKeys(gAppCongfig['environment']);
      this.ngServiceObj = this.utility.generateArrayOfKeys(gAppCongfig['appProviders']);
      this.tempNgServiceObj = gAppCongfig['appProviders'];
    })
    /**
     * appTabService.tabs is of Observable type which of
     * type Array. It contains tab objects which contains
     * the following information:
     * {
     *  "tabIndex": tabIndex, "configType": configType, "config": config
     * }
     */
    // this.appTabService.tabs.subscribe(result => {
    //   this.tabs = result;
    // });

    this.toggleSideNav = this.pubsub.$sub('navigationMenu', (eventObject) => {
      if (eventObject === 'toggle') {
        this.toggleSideMenu();
      }
    });

    this.pubsub.$sub('closeTab', (eventObject) => {
      const index = eventObject.tabIndex;
      this.deleteTab(index);
      if (eventObject.appPageId) {
        delete this.appConfig['appPages'][eventObject.appPageId];
      } else if (eventObject.modelId) {
        delete this.appConfig['dataModels'][eventObject.modelId];
      } else if (eventObject.envKey) {
        delete this.appConfig['environment'][eventObject.envKey];
      } else if (eventObject.appProviderId) {
        delete this.appConfig['appProviders'][eventObject.appProviderId];
      }
      this.appConfigService.assignGAppConfig(this.appConfig); // setting the global appConfig
    });
  }

  ngOnDestroy() {
    this.isServerStarted = false;
    this.nrService.destroy().then(result => {
      this._nodeRedUrl = '';
    }).catch(error => {
      console.error(error);
    });

    if (this.appConfigSub) {
      this.appConfigSub.unsubscribe();
    }
    this.toggleSideNav.unsubscribe();
    if (this.appConfigSub) this.appConfigSub.unsubscribe();
  }

  toggleSideMenu() {
    this.slider.toggle();
  }

  onTabChange = ($event: any): void => {
    this.tabChangeEvent = $event;
  }

  /**
   *
   * @param configType routes | components | models | permissions
   */
  assignConfigToTab(configType, index?) {
    if (configType == 'nodeRED' && this.isServerStarted == false) {
      this.dialogService.openSnackBar('server is not started, please restart');
    } else if (configType === 'nodeRED' && this.isServerStarted) {
      /**
       * TODO: Condition to removed once we get a fix for this issue: https://github.com/angular/angular/issues/16994
       * This is a temporary fix.
       **/
      shell.openExternal(this._nodeRedUrl);
    } else {
      let tabName;
      let isObjectThere = false;
      const insertObject = {
        'configType': configType,
        'appName': this.appConfig.appName
      };

      if (configType == 'pages') {
        tabName = insertObject['tabName'] = this.pageListObj[index]['val']['appPageName'];
        insertObject['appPageId'] = this.pageListObj[index]['key'];
        insertObject['appPageName'] = this.pageListObj[index]['val']['appPageName'];
      } else if (configType == 'appRoutes') {
        tabName = insertObject['tabName'] = 'Routes';
      } else if (configType == 'models') {
        tabName = insertObject['tabName'] = this.dataModelArr[index]['name'];
        insertObject['dataModelConfig'] = this.dataModelArr[index];
      } else if (configType == 'cordovaConfig') {
        tabName = insertObject['tabName'] = 'config.xml';
      } else if (configType == 'nodeRED') {
        tabName = insertObject['tabName'] = 'Node RED';
        insertObject['nrUrl'] = this._nodeRedUrl;
      } else if (configType == 'environments') {
        tabName = insertObject['tabName'] = this.environmentArray[index]['name'];
      } else if (configType == 'resources') {
        tabName = insertObject['tabName'] = 'Asset Editor';
      } else if (configType == 'css') {
        tabName = insertObject['tabName'] = 'styles.css';
      } else if (configType == 'ngService') {
        tabName = insertObject['tabName'] = this.ngServiceObj[index]['appProviderName'];
        insertObject['appProviderId'] = this.ngServiceObj[index]['appProviderId'];
      }


      for (var i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].tabName === tabName) {
          isObjectThere = true;
          insertObject['tabIndex'] = this.selectedIndex = i;
          break;
        }
      }

      if (!isObjectThere) {
        this.pubsub.$pub('tabListner', []); /*Action Bar init */
        insertObject['tabIndex'] = this.selectedIndex = this.tabs.length;
        if (insertObject['configType'] == 'appRoutes') {
          insertObject['tabIcon'] = 'settings_input_composite';
        } else if (insertObject['configType'] == 'pages') {
          insertObject['tabIcon'] = 'web';
        } else if (insertObject['configType'] == 'cordovaConfig') {
          insertObject['tabIcon'] = 'extension';
        } else if (insertObject['configType'] == 'models') {
          insertObject['tabIcon'] = 'developer_board';
        } else if (insertObject['configType'] == 'nodeRED') {
          insertObject['tabIcon'] = 'device_hub';
        } else if (insertObject['configType'] == 'environments') {
          insertObject['tabIcon'] = 'domain';
        } else if (configType == 'css') {
          insertObject['tabIcon'] = 'format_color_fill';
        } else if (configType == 'ngService') {
          insertObject['tabIcon'] = 'merge_type';
        } else if (configType == 'resources') {
          insertObject['tabIcon'] = 'web_asset';
        }

        this.tabs.push(insertObject);
      }
    }
  }

  deleteTab(index) {
    this.pubsub.$pub('tabListner', []);
    this.tabs.splice(index, 1);
  }

  deleteFromMultiTab(index, config) {
    this.deleteTab(index);
    if (config.appPageId) {
      delete this.appConfig['appPages'][config.appPageId];
    } else if (config.modelId) {
      delete this.appConfig['dataModels'][config.modelId];
    } else if (config.envKey) {
      delete this.appConfig['environment'][config.envKey];
    } else if (config.appProviderId) {
      delete this.appConfig['ngService'][config.appProviderId];
    }
    this.appConfigService.assignGAppConfig(this.appConfig); // setting the global appConfig
  }

  createAppPage() {
    this.dialogRef = this.dialogService.createDialog(CreatePageComponent);
    this.dialogRef.afterClosed().subscribe(pageDetails => {
      if (pageDetails) {
        this.pagesService.createPage(this.appConfig.appName, pageDetails).then(nwPage => {
          this.tempPageListObj[nwPage['appPageId']] = { 'appPageName': nwPage['appPageName'], 'componentName': nwPage['componentName'] };
          this.appConfigService.updateConfigTypeOfGAppConfig('appPages', this.tempPageListObj);
        });
      }
    });
  }

  createDataModel() {
    this.dialogRef = this.dialogService.createDialog(CreateDataModelComponent, { data: { appName: this.appConfig.appName } });
    this.dialogRef.afterClosed().subscribe(dataModel => {
      if (dataModel) {
        this.dataModelService.addDataModel(this.appConfig.appName, dataModel).then(result => {
          if (result) {
            this.dataModelService.getDataModelsByAppName(this.appConfig.appName).then(dataModelsList => {
              this.appConfigService.updateConfigTypeOfGAppConfig('dataModels', dataModelsList);
            })
          } else {
            this.tempDataModelObj[result['dataModelId']] = result;
            this.appConfigService.updateConfigTypeOfGAppConfig('dataModels', this.tempDataModelObj);
          }
        });
      }
    });
  }


  createEnvironment() {
    this.dialogRef = this.dialogService.createDialog(CreateEnvironmentComponent);
    this.dialogRef.afterClosed().subscribe(environmentDetails => {
      if (environmentDetails) {
        this.environmentService.createEnvironment(this.appConfig.appName, environmentDetails, 'create').then(newEnvironment => {
          this.tempEnvironmentObject[newEnvironment['name']] = newEnvironment;
          this.appConfigService.updateConfigTypeOfGAppConfig('environment', this.tempEnvironmentObject);
        });
      }
    });
  }

  createService() {
    this.dialogRef = this.dialogService.createDialog(CreateNgServiceComponent);
    this.dialogRef.afterClosed().subscribe(serviceDetails => {
      if (serviceDetails) {
        this.ngServicesService.createNgService(serviceDetails, this.appConfig.appName).then(nwNgService => {
          this.tempNgServiceObj[nwNgService['appProviderId']] = nwNgService;
          this.appConfigService.updateConfigTypeOfGAppConfig('appProviders', this.tempNgServiceObj);
        });
      }
    });
  }

}
