import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'delete-app-dialog',
  templateUrl: './deleteApp.template.html',
  styleUrls: ['./apps.style.css']
})

export class DeleteAppComponent {
  constructor(private dialogRef: MdDialogRef<any>) { }
}
