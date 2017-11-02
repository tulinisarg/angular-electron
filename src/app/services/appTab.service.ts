import { Utility } from 'app/util/util';
import { Injectable } from '@angular/core';
import { PubSubService } from "./pubSub.service";
@Injectable()
export class AppTabService {
    private util: Utility;
    //    let actionMenu = [{ id: 'routeSaveButton', buttonName: 'save', event: this.actionBarEvent, eventAction: 'saveRoutes', title: 'Save' }];
    constructor(private pubsub: PubSubService) {
        this.util = new Utility();
    }

    generateTabId() {
        return this.util.generateUUID();
    }

    updateActionMenu(actionMenu: Array<Object>) {
        this.pubsub.$pub('tabListner', actionMenu);
    }
}
