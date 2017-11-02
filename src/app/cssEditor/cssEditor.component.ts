import { AppTabService } from 'app/services/appTab.service';

import { Component, Input, ViewChild, AfterViewInit, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
const CodeMirror = require('codemirror/lib/codemirror');
import { PubSubService } from '../services/pubSub.service';
import { cssEditorService } from './cssEditor.service';
require('codemirror/addon/hint/css-hint');
require('codemirror/mode/css/css');
require('codemirror/addon/display/autorefresh');
@Component({
    selector: 'css-editor',
    templateUrl: './cssEditor.template.html',
    styleUrls: ['./cssEditor.style.css']
})
export class cssEditorComponent implements OnInit {
    @Input('tabConfig') tabConfig;
    @Input('currentlyActive') currentlyActive;
    @ViewChild('textarea') textarea;
    editor;

    tabId;
    actionBarSub;
    /**
     * Action Buttons
     */
    saveCSS = 'saveCSS';

    constructor(private pubsub: PubSubService, private cssEditorService: cssEditorService, private tabService: AppTabService) {
        this.tabId = this.tabService.generateTabId();
    }

    ngOnInit() {
        this.actionBarSub = this.pubsub.$sub(this.tabId, (eventObject) => {
            if (eventObject == this.saveCSS) {
                this.saveCssEditor();
            }
        });
        this.getAppCss();
    }

    ngOnChanges(changes: SimpleChanges) {
        let isTabActive = changes['currentlyActive'];
        if (isTabActive && this.currentlyActive) {
            this.tabService.updateActionMenu([{ id: 'cssSaveButton', buttonName: 'save', event: this.tabId, eventAction: this.saveCSS, title: 'Save' }]);
        }
    }


    ngAfterViewInit() {
        this.editor = new CodeMirror.fromTextArea(this.textarea.nativeElement, {
            lineNumbers: true,
            mode: 'text/css',
            styleActiveLine: true,
            fixedGutter: false,
            lineWrapping: true,
            theme: "mdn-like",
            autoRefresh: true
        });
    }

    saveCssEditor() {
        this.cssEditorService.putAppCss(this.tabConfig.appName, this.editor.getValue());
    }

    getAppCss() {
        this.cssEditorService.getAppCss(this.tabConfig.appName).then(result => {
            this.editor.getDoc().setValue(result);
        });
        setTimeout(() => {
            this.editor.refresh();
        }, 100);
    }

    ngOnDestroy() {
        this.actionBarSub.unsubscribe();
    }
}
