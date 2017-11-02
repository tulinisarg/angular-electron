import { DialogService } from 'app/services/dialog.service';
import { AppsService } from './../apps/apps.service';
import { AppConfigService } from '../services/appConfig.service';
import { Component, Input, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { PubSubService } from '../services/pubSub.service';
import { AppTabService } from "../services/appTab.service";
import { AppPageDesign, Services } from '@jatahworx/bhive-core'
import { AdAppRoutingDialogComponent } from "app/adAppRouting/adAppRoutingDialog.component";

@Component({
  selector: 'page-designer',
  templateUrl: './pageDesigner.template.html',
  styleUrls: ['./pageDesigner.style.css']
})

export class PageDesignerComponent {
  @Input('tabConfig') tabConfig;
  @Input('currentlyActive') currentlyActive;

  @Output('deleteEvent') deleteEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('bKeeper') bKeeper;
  @ViewChild('tsEditor') tsEditor;

  designerHTML;
  currentSubTabIndex = 0;

  actionBarSub;
  tabId;

  /**
 * Action Buttons
 */
  saveComponent = 'saveComponent';
  deleteComponent = 'deleteComponent';

  /**
   * Core Class
   */
  appPageService: Services.AppPageService;

  constructor(private pubsub: PubSubService, private tabService: AppTabService,
    private appConfigService: AppConfigService, private dialogService: DialogService) {
    this.tabId = this.tabService.generateTabId();
    this.appPageService = new Services.AppPageService();

  }

  ngOnInit() {
    this.initializePubSub();
  }

  ngOnChanges(changes: SimpleChanges) {
    let isTabActive = changes['currentlyActive'];
    if (isTabActive && this.currentlyActive) {
      this.tabService.updateActionMenu([
        { id: 'pageDesignerSaveButton', buttonName: 'save', event: this.tabId, eventAction: this.saveComponent, title: 'Save' },
        { id: 'pageDesignerDeleteButton', buttonName: 'delete', event: this.tabId, eventAction: this.deleteComponent, title: 'Delete' },
      ]);
    }
  }

  initializePubSub() {
    this.actionBarSub = this.pubsub.$sub(this.tabId, (eventObject) => {
      if (eventObject == this.saveComponent) {
        let bkeeperSaveObj = this.bKeeper.getDesignSaveObj();
        if (!this.currentSubTabIndex) {
          this.designerHTML = bkeeperSaveObj.designerHTML;
        }
        let designerReference = bkeeperSaveObj.designerReference;
        let ts = this.tsEditor.editor.getValue();
        var pageDesign = new AppPageDesign(this.designerHTML, designerReference, ts);
        // saving template 
        this.appPageService.putAppPage(this.tabConfig.appName, this.tabConfig.appPageName, pageDesign, ts).then(result => {
          this.dialogService.openSnackBar(result.data);
        }, error => {
          this.dialogService.openSnackBar(error.data);
          console.error(error);
        });
      } else if (eventObject == this.deleteComponent) {
        this.displayDeleteDialog();
      }
    });
  }

  displayDeleteDialog() {
    AdAppRoutingDialogComponent.message = 'Are you sure to remove this page ?';
    this.dialogService.createDialog(AdAppRoutingDialogComponent).afterClosed().subscribe(result => {
      if (result) {
        this.appPageService.remove(this.tabConfig.appName, this.tabConfig.appPageName, this.tabConfig.appPageId).then(() => {
          this.deleteEvent.emit({ 'appPageId': this.tabConfig.appPageId });
        }, error => {
          this.dialogService.openSnackBar(error.data);
        });
      }
    });
  }

  /**
 * When tab is changed the desginerHTML is removed at that time
 * designerHTML is undefined. Therefore, here we are sving the 
 * designerHTML
 */
  tabChanged($event) {
    this.currentSubTabIndex = $event.index;
    this.designerHTML = this.bKeeper.getDesignSaveObj().designerHTML;
  }
}
