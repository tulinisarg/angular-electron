import { Component, Input, ViewChild, AfterViewInit, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
const CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/xml-hint');
require('codemirror/mode/xml/xml');
require('codemirror/addon/display/autorefresh');
import { PubSubService } from '../services/pubSub.service';
import { XmlEditorService } from './xmlEditor.service';
import { AppTabService } from "app/services/appTab.service";


@Component({
  selector: 'xml-editor',
  templateUrl: './xmlEditor.template.html'
})

export class XmlEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('tabConfig') tabConfig;
  @Input('currentlyActive') currentlyActive;
  @ViewChild('textarea') textarea;
  editor;

  actionBarSub;
  tabId;
  
  saveXML = 'saveXML';;

  constructor(private pubsub: PubSubService, private xmlEditorService: XmlEditorService, private tabService: AppTabService) {
    this.tabId = this.tabService.generateTabId();
  }
  ngOnInit() {
    this.actionBarSub = this.pubsub.$sub(this.tabId, (eventObject) => {
      if (eventObject == this.saveXML) {
          this.updateCordovaConfig();
      }
    });
    this.getCordovaConfigXml();
  }

  ngOnChanges(changes: SimpleChanges) {
    let isTabActive = changes['currentlyActive'];
    if (isTabActive && this.currentlyActive) {
      this.tabService.updateActionMenu([{ id: 'xmlSaveButton', buttonName: 'save', event: this.tabId, eventAction: this.saveXML, title: 'Save' }]);
    }
  }

  ngAfterViewInit() {
    this.editor = new CodeMirror.fromTextArea(this.textarea.nativeElement, {
      lineNumbers: true,
      mode: "xml",
      styleActiveLine: true,
      autoRefresh: true,
      theme: "mdn-like",
    });
  }

  ngOnDestroy() {
    this.actionBarSub.unsubscribe();
  }

  updateCordovaConfig() {
    this.xmlEditorService.putCordovaConfigXml(this.tabConfig.appName, this.editor.getValue());
  }
  getCordovaConfigXml() {
    this.xmlEditorService.getCordovaConfigXml(this.tabConfig.appName).then(result => {
      this.editor.getDoc().setValue(result);
    });
  }
}