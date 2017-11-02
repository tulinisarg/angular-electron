import { Component, Input, ViewChild, AfterViewInit, Output } from '@angular/core';
import { TsEditorService } from './tsEditor.service';
const CodeMirror = require('codemirror/lib/codemirror');
import { PubSubService } from '../services/pubSub.service';
import { PagesService } from '../pages/pages.service';
import { AppConfigService } from '../services/appConfig.service';
import { AdAppRoutingDialogComponent } from '../adAppRouting/adAppRoutingDialog.component';
import { DialogService } from 'app/services/dialog.service';
require('codemirror/addon/hint/javascript-hint');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/display/autorefresh');

@Component({
  selector: 'ts-editor',
  templateUrl: './tsEditor.template.html',
  styleUrls: ['./tsEditor.style.css']

})

export class TsEditorComponent implements AfterViewInit {

  @Input('tabConfig') tabConfig;
  @ViewChild('textarea') textarea;
  appPageId;
  appName;
  editor;

  constructor(
    private tsEditorService: TsEditorService,
    private pagesService: PagesService,
    private appConfigService: AppConfigService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.appPageId = this.tabConfig['appPageId'];
    this.appName = this.tabConfig['appName'];
  }

  ngAfterViewInit() {
    this.editor = new CodeMirror.fromTextArea(this.textarea.nativeElement, {
      lineNumbers: true,
      mode: "text/typescript",
      styleActiveLine: true,
      autoRefresh: true,
      theme: "mdn-like",
    });
    this.getPageTs();
  }


  getPageTs() {
    this.tsEditorService.getPageTs(this.tabConfig.appName, this.tabConfig.appPageName).then(pageDesign => {
      this.editor.getDoc().setValue(pageDesign);
    })
  }
}
