import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'create-ng-service',
  templateUrl: './createNgService.template.html',
  styleUrls: ['../ngService.style.css']
})

export class CreateNgServiceComponent {
  ngService: any = {};
  constructor(private dialogRef: MdDialogRef<any>) { }
}
