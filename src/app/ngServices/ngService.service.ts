import { Injectable } from '@angular/core';
import { Services, AppProvider } from '@jatahworx/bhive-core';


@Injectable()
export class NgServicesService {

  appService = new Services.AppService();

  getAllProviders(appName) {
    return new Promise((resolve, reject) => {
      this.appService.getAllProviders(appName).then(result => {
        resolve(result.data);
      }).catch(error => {
        reject(error);
      });
    });
  }

  createNgService(ngServiceDetails, appName) {
    const ngServiceObj = new AppProvider(ngServiceDetails.name);
    return new Promise((resolve, reject) => {
      this.appService.addProvider(ngServiceObj, appName).then(result => {
        console.log(result);
        console.log(ngServiceObj);
        resolve(ngServiceObj);
      }).catch(error => {
        console.error(error);
      })
    })
  }

  getNgServiceTs(appProviderName, appName) {
    // console.log(arguments);
    return new Promise((resolve, reject) => {
      this.appService.getAppProviderTs(appProviderName, appName).then(tsFile => {
        console.log(tsFile);
        resolve(tsFile.data);
      }).catch(error => {
        console.error(error);
      })
    })
  }

  updateNgServiceTs(appProviderName, tsFile, appName) {
    const ngServiceObj = new AppProvider(appProviderName);
    ngServiceObj.ts = tsFile;
    this.appService.putAppProviderTs(ngServiceObj, appName).then(result => {
      console.log(result);
    }).catch(error => {
      console.error(error);
    })
  }

  removeNgService(appProviderName, appName) {
    const ngServiceObj = new AppProvider(appProviderName);
    return new Promise((resolve, reject) => {
      this.appService.removeProvider(ngServiceObj, appName).then(result => {
        resolve(result);
      }).catch(error => {
        reject(error);
      })
    });
  }
}
