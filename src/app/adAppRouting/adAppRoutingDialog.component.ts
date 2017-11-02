import { AdAppRoutingComponent } from './adAppRouting.component';
import { Component, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ad-app-routing-dialog',
  templateUrl: './adAppRoutingDialog.template.html'
})

export class AdAppRoutingDialogComponent {
  static message = '';
  static okBtnText = 'Ok';
  static close = true;
  closeButtonVisibility = true;
  messageContent;
  okBtn;
  constructor(public dialogRef?: MdDialogRef<AdAppRoutingDialogComponent>) {
    this.messageContent = AdAppRoutingDialogComponent.message;
    this.closeButtonVisibility = AdAppRoutingDialogComponent.close;
    this.okBtn = AdAppRoutingDialogComponent.okBtnText;
  }
}
