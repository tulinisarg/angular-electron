import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'create-environment-dialog',
  templateUrl: './createEnvironment.template.html',
  styleUrls: ['./createEnvironment.style.css']
})

export class CreateEnvironmentComponent {
  environment: any = {};
  constructor(private dialogRef: MdDialogRef<any>) { }
}
