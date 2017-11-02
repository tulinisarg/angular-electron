import { Component, trigger, state, style, animate, transition, OnInit } from '@angular/core';
import { AppOperationService } from '../services/appOperation.service';

@Component({
  selector: 'console-window',
  templateUrl: './consoleWindow.template.html',
  styleUrls: ['./consoleWindow.style.css'],
  animations: [
    trigger('toggleState', [
      state('true', style({
        height: '150px',
      })),
      state('false', style({
        height: 0,
      })),
      transition('0 => 1', animate('400ms ease-in')),
      transition('1 => 0', animate('400ms ease-out'))
    ]),
    trigger('toggleConsoleWindow', [
      state('true', style({
        width: '100%'        
      })),
      state('false', style({
        width: '56px'
      })),
      transition('0 => 1', animate('400ms ease-in')),
      transition('1 => 0', animate('400ms ease-out'))
    ])
  ]
})

export class ConsoleWindowComponent implements OnInit {

  clsWindow = false;
  cosoleDataArray = [];
  constructor(private appOperationService: AppOperationService) {
  }
  controlWindow() {
    this.clsWindow = this.clsWindow == true ? false : true;
  }

  ngOnInit() {
    this.appOperationService.consoleData.subscribe(result => {
      result.time = new Date()
      this.cosoleDataArray.unshift(result);
    })
  }

}