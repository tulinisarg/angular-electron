import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'import-app-dialog',
  templateUrl: './importApp.template.html',
})

export class ImportAppComponent {
  appDetails: any = {};
  constructor(private dialogRef: MdDialogRef<any>) { }
}
