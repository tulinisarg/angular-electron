import { Injectable } from '@angular/core';
import { Services, DataModel } from '@jatahworx/bhive-core';


@Injectable()
export class DataModelService {
  appService = new Services.AppService();

  // getAllDataModels() {
  //   return new Promise((resolve, reject) => {
  //     this.appService.getAllDataModels().then(dataModels => {
  //       resolve(dataModels.data);
  //     }).catch(result => {
  //       console.error(result);
  //     });
  //   });
  // }

  addDataModel(appName, dataModel) {
    return new Promise((resolve, reject) => {
      if (dataModel && dataModel.hasOwnProperty('name')) {
        const nwDataModel = new DataModel(dataModel.name, dataModel.description, dataModel.dataSource);
        this.appService.addDataModel(appName, nwDataModel).then(result => {
          if (result.httpStatus == 201) {
            resolve(nwDataModel);
          }
        }).catch(result => {
          console.error(result);
        });
      }
      if (dataModel && dataModel.hasOwnProperty('sourceAppName')) {
        // console.log(dataModel);
        this.appService.cloneDataModel(dataModel.sourceAppName, dataModel.sourceDataModel.dataModelId, appName).then(result => {
          if (result.httpStatus == 201) {
            // console.log(result.data);
            resolve(result.data);
          }
        }).catch(error => {
          console.error(error);
        });
      }
    });
  }


  getDataModelsByAppName(appName) {
    return new Promise((resolve, reject) => {
      this.appService.getDataModelsByAppName(appName).then(result => {
        if (result) {
          resolve(result.data)
        }
      }).catch(error => {
        console.error(error);
      })
    })
  }

  getAppsList() {
    return new Promise((resolve, reject) => {
      this.appService.getAppList().then(result => {
        if (result.data) {
          resolve(result.data);
        }
      }).catch(err => {
        console.log(err);
      });
    });
  }
}
