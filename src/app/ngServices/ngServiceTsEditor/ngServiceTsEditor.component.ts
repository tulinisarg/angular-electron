import { Component, Input, ViewChild, AfterViewInit, Output, OnInit, OnDestroy, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { NgServicesService } from '../ngService.service';
import { PubSubService } from '../../services/pubSub.service';
const CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/addon/hint/javascript-hint');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/display/autorefresh');
import { AdAppRoutingDialogComponent } from '../../adAppRouting/adAppRoutingDialog.component';
import { DialogService } from '../../services/dialog.service';
import { AppTabService } from '../../services/appTab.service';

@Component({
  selector: 'ng-service-ts-editor',
  templateUrl: './ngServiceTsEditor.template.html'
})

export class NgServiceTsEditorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input('tabConfig') tabConfig;
  @Input('currentlyActive') currentlyActive;
  @ViewChild('textarea') textarea;
  @Output('deleteEvent') deleteEvent: EventEmitter<any> = new EventEmitter();

  editor;
  tabSubscription;
  tabName;
  appName;

  actionBarSub;
  tabId;

  /**
 * Action Buttons
 */
  saveNGService = 'saveNGService';
  deleteNGService = 'deleteNGService';

  constructor(
    private ngServicesService: NgServicesService,
    private pubsub: PubSubService,
    private dialogService: DialogService,
    private tabService: AppTabService) {
     this.tabId = this.tabService.generateTabId();
  }

  ngOnInit() {
    this.tabName = this.tabConfig['tabName'];
    this.appName = this.tabConfig['appName'];

    console.log(this.tabConfig);

      this.actionBarSub = this.pubsub.$sub(this.tabId, (eventObject) => {
      if (eventObject == this.saveNGService) {
        this.updateServiceTs();
      } else if(eventObject == this.deleteNGService) {
        this.removeServiceTs();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const isTabActive = changes['currentlyActive'];
    if (isTabActive && this.currentlyActive) {
      this.tabService.updateActionMenu([
        { id: 'ngServiceTsSaveButton', buttonName: 'save', event: this.tabId, eventAction: this.saveNGService, title: 'Save' },
        { id: 'ngServiceTsDeleteButton', buttonName: 'delete', event: this.tabId, eventAction: this.deleteNGService, title: 'Delete' },
      ]);
    }
  }


  ngAfterViewInit() {
    this.editor = new CodeMirror.fromTextArea(this.textarea.nativeElement, {
      lineNumbers: true,
      mode: 'text/typescript',
      styleActiveLine: true,
      autoRefresh: true,
      theme: 'mdn-like',
    });
    this.getServiceTs();
  }

  getServiceTs() {
    this.ngServicesService.getNgServiceTs(this.tabName, this.appName).then(tsFile => {
      this.editor.getDoc().setValue(tsFile);
      setTimeout(() => {
          this.editor.refresh();
      }, 100);
    });
  }

  updateServiceTs() {
    this.ngServicesService.updateNgServiceTs(this.tabName, this.editor.getValue(), this.appName);
  }

  removeServiceTs() {
    AdAppRoutingDialogComponent.message = 'Are you sure to remove this service ?';
    this.dialogService.createDialog(AdAppRoutingDialogComponent).afterClosed().subscribe(result => {
      if (result) {
          this.ngServicesService.removeNgService(this.tabName, this.appName).then(() => {
              this.pubsub.$pub('closeTab', { 'tabIndex': this.tabConfig['tabIndex'], 'appProviderId': this.tabConfig['appProviderId'] });
          });
        }
    });
  }

 ngOnDestroy() {
     this.actionBarSub.unsubscribe();
  }

}
