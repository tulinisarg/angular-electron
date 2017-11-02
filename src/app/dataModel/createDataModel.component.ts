import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';
import { DataModelService } from './dataModel.service';
import { DataModelEditorService } from '../dataModelEditor/dataModelEditor.service';

@Component({
    selector: 'create-data-model',
    templateUrl: './createDataModel.template.html',
    styleUrls: ['/dataModel.style.css']
})

export class CreateDataModelComponent implements OnInit {
    typeBoolean = true;
    dm = 'New Data Model';
    dataModel: Object = {};
    dataModelList;
    dataModelObj;
    appName;
    appConfig;
    appList;
    @ViewChild('createDM') createDM;

    constructor(private dialogRef: MdDialogRef<any>, private dataMOdelService: DataModelService, @Inject(MD_DIALOG_DATA) private data: any, private dmEditorService: DataModelEditorService) { }

    ngOnInit() {
        if (this.data && this.data.appName) {
            this.appName = this.data.appName;
        }
        this.appConfig = this.dataMOdelService.getAppsList().then(appList => {
            this.appList = appList;
            if (this.appName) this.removeCurrentAppModels();
        });
    }

    dmType() {
        this.dm = this.typeBoolean ? 'New Data Model' : 'Existing Data Model';
    }

    currentIndex(index) {
        this.dataModelList = this.dataModelObj[index].dataModels;
    }

    getDataModelsByAppName(appName) {
        this.dataMOdelService.getDataModelsByAppName(appName).then(dataModels => {
            this.dataModelList = dataModels;
        }).catch(err => {
            console.log(err);
        })
    }

    removeCurrentAppModels() {
        if (this.appList) {
            for (let i = 0; i < this.appList.length; i++) {
                if (this.appName == this.appList[i]) {
                    this.appList.splice(i, 1);
                }
            }
        }
    }
}
