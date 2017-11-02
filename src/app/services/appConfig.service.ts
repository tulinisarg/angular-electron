import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppConfigService {
    private gAppConfig;
    private configSubject: BehaviorSubject<any>;
    gAppConfigObservable: Observable<any>;


    constructor() {
        this.gAppConfig = {};
        this.configSubject = <BehaviorSubject<any>>new BehaviorSubject({});
        this.gAppConfigObservable = this.configSubject.asObservable();
    }

    /**
     * This call is first made in appModeler component for assigning the
     * config of the current App that is being edited. Subsequent changes
     * that should be reflected in the global app config must be updated
     * manually throughout the logic of the application.
     * @param config global app config
     */
    assignGAppConfig(config) {
        this.gAppConfig = Object.assign({}, config);
        this.configSubject.next(this.gAppConfig);
    }

    /**
     * For updating the configType in gAppConfig
     * @param configType configName of the config to be changed
     * @param configOfConfigType configuration to be inserted inside the configType
     */
    updateConfigTypeOfGAppConfig(configTypeKey, configTypeValue) {
        if (configTypeKey && this.gAppConfig.hasOwnProperty(configTypeKey) && configTypeValue) {
            this.gAppConfig[configTypeKey] = configTypeValue;
            this.configSubject.next(this.gAppConfig);
        } else {
            console.error("Invalid configTypeKey or configTypeValue");
        }
    }

    /**
     * This function has been created because once the user
     * enters App editing interface the are some immutable properties
     * one of them is appName, for getting appName any
     * component of Bhive-ad shouldn't subscribe to the global 
     * observable but get it directly via this getGAppStudioId() 
     * function call.
     */

    getGAppName() {
        if (this.gAppConfig && this.gAppConfig.appName) {
            return this.gAppConfig.appName;
        }
        return '';
    }
}