import { Injectable } from '@angular/core';
import { CoreEmitter } from '@jatahworx/bhive-core';
import { DialogService } from './dialog.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppOperationService {
    __coreEmitter = new CoreEmitter();
    consoleSubject: BehaviorSubject<any>;
    consoleData: Observable<any>;
    progressBarSubject: BehaviorSubject<any>;
    progressBarData: Observable<any>;
    constructor(private dialogService: DialogService) {
        this.consoleSubject = <BehaviorSubject<any>>new BehaviorSubject({});
        this.consoleData = this.consoleSubject.asObservable();
        this.progressBarSubject = <BehaviorSubject<any>>new BehaviorSubject({});
        this.progressBarData = this.progressBarSubject.asObservable();
    }

    subscribeToAppOperation(eventName) {
        this.__coreEmitter.on(eventName, result => {
            if (eventName === 'APP_OPERATION_EVENT_SUCCESS' || eventName === 'APP_OPERATION_EVENT_ERROR') {
                const message = (result && result.hasOwnProperty('data')) ? result.data : result.error;
                this.dialogService.openSnackBar(message);
                this.updateConsoleWindow(result);
            } else if (eventName === 'IMPORT_APP' || eventName === 'EXPORT_APP') {
                this.progressBarSubject.next(result);
            }
        });
    }

    updateConsoleWindow(result) {
        this.consoleSubject.next(result);
    }
}
