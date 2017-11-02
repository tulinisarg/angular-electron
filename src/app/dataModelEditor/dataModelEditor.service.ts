import { Injectable } from '@angular/core';
import { Services, AppService } from '@jatahworx/bhive-core';
import { AppConfigService } from './../services/appConfig.service';

@Injectable()
export class DataModelEditorService {
    private __appService: Services = new Services.AppService();

    constructor(private appConfigService: AppConfigService) { }

    updateDataModel(appName, dataModel, dataModels) {
        return new Promise((resolve, reject) => {
            this.__appService.updateDataModel(appName, dataModel).then(result => {
                if (result && result.data) {
                    dataModels[dataModel.dataModelId] = dataModel;
                    this.appConfigService.updateConfigTypeOfGAppConfig('dataModels', dataModels);
                    return resolve(result.data);
                }
                return resolve([])
            }, reason => {
                // console.error(reason);
                return resolve([])
            })
        })
    }

    removeDataModel(appName, modelId, modelName) {
        return new Promise((resolve, reject) => {
            this.__appService.removeDataModel(appName, modelId, modelName).then(result => {
                return resolve(result);
            }, reason => {
                // console.error(reason);
                return reject(reason)
            })
        })
    }
}
