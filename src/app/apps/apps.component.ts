import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateAppComponent } from './createApp.component';
import { MdDialogRef } from '@angular/material';
import { AppsService } from './apps.service';
import { DialogService } from '../services/dialog.service';
import { DeleteAppComponent } from './deleteApp.component';
import { MdSnackBar } from '@angular/material';
import { runtimeComponent } from './runtime.component';
import { Workspace } from '@jatahworx/bhive-core';
import { AppConfigService } from 'app/services/appConfig.service';
import { AppModlerService } from '../appModler/appModler.service';
import { workspaceService } from '@jatahworx/bhive-core';
import { workspaceDaoFs } from '@jatahworx/bhive-core';
import { ImportAppComponent } from './importApp/importApp.component';
import { AdRootService } from '../adRoot/adRoot.service';
import { AdRootComponent } from '../adRoot/adRoot.component'

@Component({
  selector: 'app-list',
  templateUrl: './apps.template.html',
  styleUrls: ['./apps.style.css']
})


export class AppsComponent implements OnInit {
  appList;
  dialogRef: MdDialogRef<any>;
  selectedIndex = 0;
  errorMsg;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appsService: AppsService,
    private dialogService: DialogService, private snackbar: MdSnackBar, private appConfigService: AppConfigService,
    private appmodlerservice: AppModlerService, private adRootService: AdRootService, private adrootcomponent: AdRootComponent) { }

  ngOnInit() {
    this.appList = this.activatedRoute.snapshot.data['appList'];
    /**
     * It's important to note that apps page should be the first page
     * to run this code and the user shouldn't be able to reload app
     * from any other page because then this piece of code wouldn't
     * run and then user will be able to drop image to the electron
     * screen
     */
    document.addEventListener('dragover', function (event) {
      event.preventDefault();
      return false;
    }, false);
    document.addEventListener('drop', function (event) {
      event.preventDefault();
      return false;
    }, false);
  }

  createApp() {
    this.dialogRef = this.dialogService.createDialog(CreateAppComponent);
    this.dialogRef.afterClosed().subscribe(pageObj => {
      this.appsService.createApp(pageObj).then(nwAppObj => {
        if (nwAppObj) {
          this.appList.push(nwAppObj);
        }
      });
    });
  }

  deleteApp(appName, index) {
    this.dialogRef = this.dialogService.createDialog(DeleteAppComponent);
    this.dialogRef.afterClosed().subscribe(deleteSelected => {
      if (deleteSelected) {
        this.appsService.removeApp(appName).then(response => {
          this.appList.splice(index, 1);
        });
      }
    });
  }

  editApp(appName) {
    this.router.navigate(['app', appName]);
  }
  fileEvent(fileInput: any) {
    let file = fileInput.target.files[0];
    let currentPath = file.path;
    this.dialogService.openSnackBar(currentPath);
    return currentPath;
  }

  switchWorkSpace(fileInput) {
    let currentPath = this.fileEvent(fileInput);
    let workspacePath = 'Bhive AD' + ' - ' + currentPath;
    this.appsService.updateWsObj(currentPath).then(res => {
      this.adRootService.wsPath = currentPath;
      this.adrootcomponent.setTitle(workspacePath);
      Workspace.setWsPath(currentPath);
      this.appsService.getAppList().then((data) => {
        this.appList = data;
      }).catch(error => {
        console.error(error);
      });
    });

  }

  createZip(appName, exportPath) {
    let currentPath = this.fileEvent(exportPath);
    this.appsService.createZip(appName, currentPath).then(result => {
      // console.log(result);
    });
  }

  unZip(importPath) {
    let currentPath = this.fileEvent(importPath);
    this.appsService.unZip(currentPath, false).then(nwAppList => {
      this.appList = nwAppList;
    }).catch(err => {
      if (err && err.hasOwnProperty('httpStatus') && err.httpStatus === 406 && err.hasOwnProperty('error')
        && err.error === 'App with same name already exists') {
        this.dialogRef = this.dialogService.createDialog(ImportAppComponent);
        this.dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.appsService.unZip(err.zipFilePath, true).then(nwAppList => {
              this.appList = nwAppList;
            });
          }
        });
      }
    });
  }
}

