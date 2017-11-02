// import { AdAppRoutingComponent } from './adAppRouting.component';
import { Component, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ad-image-delete-dialog',
  templateUrl: './imageDeleteDialog.template.html'
})

export class ImageDeleteDialogComponent {
  static message = '';
  static okBtnText = 'Ok';
  static close = true;
  closeButtonVisibility = true;
  messageContent;
  okBtn;
  constructor(public dialogRef?: MdDialogRef<ImageDeleteDialogComponent>) {
    this.messageContent = ImageDeleteDialogComponent.message;
    this.closeButtonVisibility = ImageDeleteDialogComponent.close;
    this.okBtn = ImageDeleteDialogComponent.okBtnText;
  }
}
