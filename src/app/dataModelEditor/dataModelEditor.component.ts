import { AppTabService } from 'app/services/appTab.service';
import { DialogService } from './../services/dialog.service';
import { Utility } from 'app/util/util';
import { AppConfigService } from './../services/appConfig.service';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DataModelEditorService } from './dataModelEditor.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DataModelField, DataModel } from '@jatahworx/bhive-core';
import { PubSubService } from '../services/pubSub.service';
import { AdAppRoutingDialogComponent } from 'app/adAppRouting/adAppRoutingDialog.component';

@Component({
  selector: 'data-model-editor',
  templateUrl: './dataModelEditor.template.html',
  animations: [
    trigger(
      'enterAnimation', [
        state('enter', style({ transform: 'translateX(0%)' })),
        state('leave', style({ transform: 'translateX(100%)' })),
        transition('enter <=> leave', animate('100ms ease-out'))
      ]
    )
  ],
  styleUrls: ['./dataModelEditor.style.css']
})
export class DataModelEditorComponent implements OnInit {
  dataModelConfig;
  model;
  modelId;
  modelList;
  dataModels;
  fieldsArray: Array<DataModelField>;
  tempField = {};
  mouseOverIndex = -1;
  fieldTypes = [];
  appConfig;
  selected = -1;

  /**
  *for tabs service
  */
  @Input('tabConfig') tabConfig;
  @Input('currentlyActive') currentlyActive;
  @Output('deleteEvent') deleteEvent: EventEmitter<any> = new EventEmitter();

  appConfigSub;

  tabId;
  actionBarSub;

  saveModel = 'saveModel';
  deleteModel = 'deleteModel';

  constructor(private pubsub: PubSubService, private dmes: DataModelEditorService, private appConfigService: AppConfigService, private dialogService: DialogService, private tabService: AppTabService) {
    this.tabId = this.tabService.generateTabId();
  }

  ngOnInit() {
    this.dataModelConfig = this.tabConfig['dataModelConfig'];

    this.actionBarSub = this.pubsub.$sub(this.tabId, (eventObject) => {
      if (eventObject == this.saveModel) {
        this.save();
      } else if (eventObject == this.deleteModel) {
        this.delete();
      }
    });

    let util = new Utility();
    this.appConfigSub = this.appConfigService.gAppConfigObservable.subscribe(result => {
      this.appConfig = result;
      if (result && Object.keys(result).length !== 0 && result.constructor === Object) {
        if (result['dataModels'] && Object.keys(result['dataModels']).length !== 0 && result['dataModels'].constructor === Object) {
          this.modelId = this.dataModelConfig.dataModelId;
          this.model = result['dataModels'][this.modelId];
          this.dataModels = result['dataModels'];
          this.modelList = util.generateArrayOfKeyValuePairs(result['dataModels']);
          // this.removeCurrentModel();
          // this.createFeildsArray();
          // this.convertObjectToDataModel();
        }
      }

    })

    // if (this.appConfig && Object.keys(this.appConfig).length !== 0 && this.appConfig.constructor === Object) {
    //   if (this.appConfig['dataModels'] && Object.keys(this.appConfig['dataModels']).length !== 0 && this.appConfig['dataModels'].constructor === Object) {
    //     this.modelId = this.dataModelConfig.dataModelId;
    //     this.model = this.appConfig['dataModels'][this.modelId];
    //     this.dataModels = this.appConfig['dataModels'];
    //     this.modelList = util.generateArrayOfKeyValuePairs(this.appConfig['dataModels']);
        this.removeCurrentModel();
        this.createFeildsArray();
        this.convertObjectToDataModel();
    //   }
    // }

    this.clearInputField();
  }

  ngOnChanges(changes: SimpleChanges) {
    let isTabActive = changes['currentlyActive'];
    if (isTabActive && this.currentlyActive) {
      this.tabService.updateActionMenu([
        { id: 'modelSaveButton', buttonName: 'save', event: this.tabId, eventAction: this.saveModel, title: 'Save' },
        { id: 'modelDeleteButton', buttonName: 'delete', event: this.tabId, eventAction: this.deleteModel, title: 'Delete' }
      ]);
    }
  }

  createFeildsArray() {
    for (let i = 0; i < Object.keys(DataModelField.FIELD_TYPES).length; i++) {
      let key = Object.keys(DataModelField.FIELD_TYPES)[i];
      if (!this.checkIfFeildAlreadyPresent(key)) {
        this.fieldTypes.push({
          key: key,
          value: DataModelField.FIELD_TYPES[key]
        })
      }
    }
  }

  checkIfFeildAlreadyPresent(key) {
    for (let i = 0; i < this.fieldTypes.length; i++) {
      if (this.fieldTypes[i].key == key) {
        return true;
      }
    }
    return false;
  }

  mouseOver(index) {
    this.mouseOverIndex = index;
  }

  mouseOut() {
    this.mouseOverIndex = -1;
  }

  addField(field) {
    if (field && Object.keys(field).length >= 4) {
      let dataModelField = new DataModelField(field.name, field.fieldType.value, field.isArray);
      if (field && field.fieldType && field.fieldType.key == 'MODEL' && field.complexType) {
        dataModelField.setComplexType(field.complexType.val.name, field.complexType.key);
      }
      if (dataModelField && !this.checkIfFieldAlreadyInModel(dataModelField) && this.selected === -1) {
        if (!(field.fieldType.key == 'MODEL' && !field.complexType)) {
          this.convertObjectToDataModel();
          this.model.addField(dataModelField);
          this.clearSelection();
        } else {
          console.error("Invalid input");
        }
      } else if (dataModelField && this.selected >= 0) {
        this.model.updateField(dataModelField, this.selected);
        // if(!this.checkIfFieldAlreadyInModel(dataModelField)) {
        //   this.model.updateField(dataModelField, this.selected);
        // } else {
        //   console.error("Invalid input");
        //   this.dialogService.openSnackBar("Field iwth this name is already present");
        // }
      }
    }
  }

  deleteField(i) {
    this.convertObjectToDataModel();
    this.model.removeField(i);
    this.clearSelection();
    this.clearInputField();
  }

  clearInputField() {
    this.tempField = {};
    this.tempField['isArray'] = false;
    this.clearSelection();
  }

  getKeyOfFeildTypeByValue(value) {
    for (let i = 0; i < this.fieldTypes.length; i++) {
      if (this.fieldTypes[i].value === value) {
        return this.fieldTypes[i].key;
      }
    }
  }

  getFieldTypeObjectByValue(value) {
    for (let i = 0; i < this.fieldTypes.length; i++) {
      if (this.fieldTypes[i].value === value) {
        return this.fieldTypes[i];
      }
    }
  }

  assignToInputField(field, i) {
    const tempField = Object.assign({}, field);
    tempField.fieldType = this.getFieldTypeObjectByValue(field.fieldType);
    tempField.complexType = this.getModelById(field.complexTypeId);
    this.tempField = tempField;
    if (this.selected == i) {
      this.selected = -1;
      this.clearInputField();
    } else {
      this.selected = i;
    }
  }

  checkIfFieldAlreadyInModel(dataModelField) {
    for (let i = 0; i < this.model.fields.length; i++) {
      if (this.model.fields[i].name == dataModelField.name) {
        return true;
      }
    }
    return false;
  }

  save() {
    if (this.model.name && this.model.description && this.model.dataSource) {
      this.dmes.updateDataModel(this.appConfig.appName, this.model, this.dataModels);
      this.clearInputField();
    } else {
      this.dialogService.openSnackBar('Data Model Metadata is required');
    }
  }

  convertObjectToDataModel() {
    let tempModel = new DataModel(this.model.name, this.model.description, this.model.dataSource);
    if (this.model) {
      for (let i = 0; i < this.model.fields.length; i++) {
        if (this.model.fields && this.model.fields[i]) {
          let tempField = this.convertToDataModelField(this.model.fields[i]);
          if (tempField) {
            tempModel.addField(tempField);
          }
        }
      }
    }
    tempModel.dataModelId = this.model.dataModelId;
    this.model = tempModel;
  }

  convertToDataModelField(field) {
    if (field) {
      let dataModelField = new DataModelField(field.name, field.fieldType, field.isArray);
      if (this.getKeyOfFeildTypeByValue(field.fieldType) == 'MODEL') {
        dataModelField.setComplexType(field.complexTypeName, field.complexTypeId);
      }
      return dataModelField;
    }
    return undefined;
  }

  getDataModelNameById(id) {
    if (id && this.appConfig['dataModels'] && this.appConfig['dataModels'][id]) {
      return this.appConfig['dataModels'][id]['name'];
    }
    return '';
  }

  getModelById(id) {
    for (let i = 0; i < this.modelList.length; i++) {
      if (this.modelList[i].key == id) {
        return this.modelList[i];
      }
    }
  }

  checkValue(value) {
    if (value !== 'MODEL') {
      this.tempField['complexType'] = '';
    }
  }

  removeCurrentModel() {
    for (let i = 0; i < this.modelList.length; i++) {
      if (this.modelId == this.modelList[i].key) {
        this.modelList.splice(i, 1);
      }
    }
  }

  clearSelection() {
    this.selected = -1;
  }

  ngOnDestroy() {
    this.actionBarSub.unsubscribe();
    if (this.appConfigSub) this.appConfigSub.unsubscribe();
  }

  delete() {
    AdAppRoutingDialogComponent.message = 'Are you sure to delete this data model ?';
    this.dialogService.createDialog(AdAppRoutingDialogComponent).afterClosed().subscribe(result => {
      if (result) {
        this.dmes.removeDataModel(this.appConfig.appName, this.modelId, this.dataModels[this.modelId].name).then(result => {
          // this.pubsub.$pub('closeTab', { 'tabIndex': this.tabConfig['tabIndex'], 'modelId': this.modelId });
          this.deleteEvent.emit({ 'modelId': this.modelId })
        }, error => {
          console.error(error);
        })
      }
    });
  }
}
