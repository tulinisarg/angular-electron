import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'create-app-dialog',
  templateUrl: './createApp.template.html',
  styleUrls: ['./apps.style.css']
})

export class CreateAppComponent {
  appDetails: any = {};
  constructor(private dialogRef: MdDialogRef<any>) {}
}
