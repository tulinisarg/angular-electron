import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PubSubService } from '../services/pubSub.service';
import { AdAppRoutingDialogComponent } from 'app/adAppRouting/adAppRoutingDialog.component';
import { DialogService } from '../services/dialog.service';

@Component({
    selector: 'ad-action-bar',
    templateUrl: './adActionBar.template.html'
})
export class ADActionBarComponent implements OnInit, OnDestroy {
    tabListner;
    actionButtons = [];

    constructor(private pubsub: PubSubService, private router: Router, private dialogService: DialogService) {
    }

    ngOnInit() {
        this.tabListner = this.pubsub.$sub('tabListner', (eventObject) => {
            this.actionButtons = [];
            if (eventObject && eventObject.length > 0) {
                this.actionButtons = eventObject;
            }
        });
    }

    ngOnDestroy() {
        this.tabListner.unsubscribe();
    }

    broadcastActionEvent(event, eventObject) {
        this.pubsub.$pub(event, eventObject);
    }

    goBack() {
        AdAppRoutingDialogComponent.message = 'Unsaved changes will be lost.';
        AdAppRoutingDialogComponent.okBtnText = 'Continue';
        this.dialogService.createDialog(AdAppRoutingDialogComponent).afterClosed().subscribe((res) => {
            if (res) {
                 this.router.navigate(['/apps']);
            }
        });
    }

}
