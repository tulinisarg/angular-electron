import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { PubSubService } from '../services/pubSub.service';
import { AppTabService } from "../services/appTab.service";

@Component({
  selector: 'ad-app-routing-wrapper',
  template: `
    <ad-app-routing fxLayout="column" fxFill #appRoutingChild></ad-app-routing>
  `,
})
export class AdAppRoutingWrapperComponent implements OnInit {
  @Input('tabConfig') tabConfig;
  @Input('currentlyActive') currentlyActive;
  @ViewChild('appRoutingChild') appRoutingChild;

  actionBarSub;
  tabId;

  /**
   * Action Buttons
   */
  saveRoutes = 'saveRoutes';

  constructor(private pubsub: PubSubService, private tabService: AppTabService) {
    this.tabId = this.tabService.generateTabId();
  }

  ngOnInit() {
    this.actionBarSub = this.pubsub.$sub(this.tabId, (eventObject) => {
      if (eventObject == this.saveRoutes) {
        this.appRoutingChild.save();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let isTabActive = changes['currentlyActive'];
    if (isTabActive && this.currentlyActive) {
      this.tabService.updateActionMenu([{ id: 'routeSaveButton', buttonName: 'save', event: this.tabId, eventAction: this.saveRoutes, title: 'Save' }]);
    }
  }

  ngOnDestroy() {
    this.actionBarSub.unsubscribe();
  }
}
