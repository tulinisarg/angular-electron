import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'create-page-dialog',
  templateUrl: './createPage.template.html',
  styleUrls: ['./createPage.style.css']
})

export class CreatePageComponent {
  pageDetails: any = {};
  constructor(private dialogRef: MdDialogRef<any>) { }
}
