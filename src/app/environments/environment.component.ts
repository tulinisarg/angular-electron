import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Utility } from 'app/util/util';
import { AppConfigService } from '../services/appConfig.service';
import { MdSnackBar } from '@angular/material';
import { PubSubService } from '../services/pubSub.service';
import { EnvironmentService } from './environment.service';
import { Environment } from '@jatahworx/bhive-core';
import { AdAppRoutingDialogComponent } from '../adAppRouting/adAppRoutingDialog.component';
import { DialogService } from 'app/services/dialog.service';
import { AppTabService } from "app/services/appTab.service";

@Component({
    selector: 'environment',
    styleUrls: ['./environment.style.css'],
    templateUrl: './environment.template.html'
})

export class EnvironmentComponent implements OnInit {
    defaultEnvironment;
    updatePropertyIndex = -1;
    utility;
    environmentObject;
    environment;
    environmentData = {};
    isNameDisabled = true;
    editEnvironment = [];
    disableBtn;
    tabSubscription;
    actionBarPub;
    findIndex;
    @Input('tabConfig') tabConfig;
    @Input('currentlyActive') currentlyActive;
    @Output('deleteEvent') deleteEvent: EventEmitter<any> = new EventEmitter();

    tabId;
    actionBarSub;

    saveEnvironments = 'saveEnvironment';
    deleteEnvironments = 'deleteEnvironment';

    constructor(
        private pubsub: PubSubService,
        private appConfigService: AppConfigService,
        private environmentService: EnvironmentService,
        private snackBar: MdSnackBar,
        private dialogService: DialogService,
        private tabService: AppTabService) {
        this.tabId = this.tabService.generateTabId();

    }

    ngOnInit() {
        this.appConfigService.gAppConfigObservable.subscribe(gAppCongfig => {
            this.utility = new Utility();
            this.environmentObject = this.utility.generateArrayOfKeys(gAppCongfig['environment']);
            this.environmentObject = this.utility.generateArrayOfKeys(gAppCongfig['environment']);

        })
        this.disableBtn = true;
        this.getSelectedEnvironments();
        this.actionBarSub = this.pubsub.$sub(this.tabId, (eventObject) => {
            if (eventObject == 'saveEnvironment') {
                this.saveEnvironment();
            } else if (eventObject == 'deleteEnvironment') {
                this.deleteEnvironment();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let isTabActive = changes['currentlyActive'];
        if (isTabActive && this.currentlyActive) {
            this.tabService.updateActionMenu([
                { id: 'environmentSaveButton', buttonName: 'save', event: this.tabId, eventAction: this.saveEnvironments, title: 'Save' },
                { id: 'environmentDeleteButton', buttonName: 'delete', event: this.tabId, eventAction: this.deleteEnvironments, title: 'Delete' }
            ]);
        }
    }

    getSelectedEnvironments() {
        this.defaultEnvironment = Environment.__getDefaultProperties();
        this.defaultEnvironment = Object.keys(this.defaultEnvironment);
        for (let i = 0; i < this.environmentObject.length; i++) {
            if (this.environmentObject[i].name == this.tabConfig.tabName) {
                this.environment = this.environmentObject[i];
            }
        }
        for (let key in this.environment.properties) {
            if (key == this.defaultEnvironment[this.getIndex()]) {
                this.editEnvironment.push({ envkey: key, envvalue: this.environment.properties[key], editable: false });
            } else {
                this.editEnvironment.push({ envkey: key, envvalue: this.environment.properties[key], editable: true });
            }
        }
    }
    getIndex() {
        if (this.findIndex == undefined) {
            this.findIndex = 0;
            return this.findIndex;
        } else {
            this.findIndex++;
            return this.findIndex;
        }
    }
    addNewproperty() {
        for (let i = 0; i < this.editEnvironment.length; i++) {
            if (this.editEnvironment[i].envkey == this.environmentData['name']) {
                this.snackBar.open('Duplicate name is not allowed', 'close', { duration: 2000 });
                return false;
            }
        }

        this.environmentData['value'] = this.castToBoolean(this.environmentData['value']);
        this.editEnvironment.push({ envkey: this.environmentData['name'], envvalue: this.environmentData['value'], editable: true });
        this.environmentData = {};
    }
    deleteproperty(index) {
        this.editEnvironment.splice(index, 1);
        this.environmentData = {};
        this.isNameDisabled = true;
        this.disableBtn = true;
    }
    setBackground(list, i) {
        this.isNameDisabled = list.editable;
        if (this.updatePropertyIndex == i) {
            this.updatePropertyIndex = undefined;
            this.disableBtn = true;
            this.isNameDisabled = true;
            this.environmentData = {};

        } else {
            this.environmentData['name'] = list.envkey;
            this.environmentData['value'] = list.envvalue;
            this.updatePropertyIndex = i;
            this.disableBtn = false;
        }
    }
    clearproperty() {
        this.environmentData = {};
        this.isNameDisabled = true;
        this.disableBtn = true;
        this.updatePropertyIndex = undefined;
    }
    updateproperty() {
        for (let i = 0; i < this.editEnvironment.length; i++) {
            if (this.editEnvironment[i].envkey == this.environmentData['name'] && this.updatePropertyIndex == i) {
            } else if (this.editEnvironment[i].envkey == this.environmentData['name'] && this.updatePropertyIndex != i) {
                this.snackBar.open('Duplicate name is not allowed', 'close', { duration: 2000 });
                return false;
            }
        }
        this.environmentData['value'] = this.castToBoolean(this.environmentData['value']);
        this.editEnvironment[this.updatePropertyIndex].envkey = this.environmentData['name'];
        this.editEnvironment[this.updatePropertyIndex].envvalue = this.environmentData['value'];
        this.disableBtn = true;
        this.updatePropertyIndex = undefined;
        this.isNameDisabled = true;
        this.environmentData = {};
    }

    saveEnvironment() {
        let properties = {};
        for (let i = 0; i < this.editEnvironment.length; i++) {
            properties[this.editEnvironment[i]['envkey']] = this.editEnvironment[i]['envvalue'];
        }
        this.environment.properties = properties;
        this.environmentService.updateEnvironment(this.tabConfig.appName, this.environment, 'save').then(newEnvironment => {
        });
    }
    deleteEnvironment() {
        AdAppRoutingDialogComponent.message = 'Are you sure to remove this environment ?';
        this.dialogService.createDialog(AdAppRoutingDialogComponent).afterClosed().subscribe(result => {
            if (result) {
                this.environmentService.removeEnvironment(this.tabConfig.appName, this.tabConfig.tabName).then(() => {
                    this.deleteEvent.emit({ 'envKey': this.tabConfig.tabName });
                });
            }
        });
    }

    //cast to boolean if value is true or false of type string  
    castToBoolean(value) {
        if (value === 'true' || value === 'false') {
            return Boolean(value);
        }
        return value;
    }
}
