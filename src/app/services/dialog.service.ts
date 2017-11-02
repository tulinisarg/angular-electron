import { Injectable } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';


@Injectable()
export class DialogService {
  constructor(private dialog: MdDialog, private snackBar: MdSnackBar) { }

  createDialog(dialogComponent, data?) {
    return this.dialog.open(dialogComponent, data);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close', { duration: 10000 });
  }
}
