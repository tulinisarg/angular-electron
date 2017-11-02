/* Paul to make changes here */
import { Component, AfterViewInit, OnInit, ViewChild, Input, OnDestroy, trigger, state, style, transition, animate, ViewEncapsulation } from '@angular/core';
import { Toolkits, Attribute, Component as BHComponent } from '@jatahworx/bhive-core';
import * as $ from 'jquery';
import 'jquery-ui-bundle';
import { NgForm } from '@angular/forms';
import { BKeeperService } from './bKeeper.service';
import { PubSubService } from '../services/pubSub.service';
import { Utility } from 'app/util/util';
import { AppConfigService } from '../services/appConfig.service';
import { PagesService } from '../pages/pages.service';
import { AdAppRoutingDialogComponent } from '../adAppRouting/adAppRoutingDialog.component';
import { DialogService } from '../services/dialog.service';
import { AdAppRoutingComponent } from '../adAppRouting/adAppRouting.component';
const CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/addon/display/autorefresh');
@Component({
  selector: 'app-b-keeper',
  templateUrl: './bKeeper.template.html',
  styleUrls: ['./bKeeper.css'],
  animations: [
    trigger('toggleState', [
      state('false',
        style({ minHeight: '40px' })
      ),
      state('true',
        style({ height: '0', minHeight: '0', overflow: 'hidden' })
      ),
      transition('* => *', animate('.25s ease-in'))
    ])
  ],
  providers: [Utility],
  encapsulation: ViewEncapsulation.None
})
export class BKeeperComponent implements AfterViewInit, OnInit {
  layoutArr: Array<any> = [];
  globalPalleteRef: Object = {};
  globalEditorRef: Object = {};
  currAttrProps = [];
  attrToggle: boolean = false;
  newAttr: Object = {};
  selectedElementKey;
  hideProp: boolean = true;
  hideHtmlEditor: boolean = true;
  htmlEditor;
  indexToUpdate;
  @ViewChild('textarea') textarea;
  @ViewChild('attrForm') attrForm;
  @Input('tabConfig') tabConfig;
  appPageId;
  tabSubscription;
  actionBarSub;
  actionBarPub;
  htmlDropZoneId;
  htmlDropZone;
  palletTitles;
  appName;
  selectedHTMLElementKey;

  //changes
  prevElement;

  constructor(
    private bKeeperService: BKeeperService,
    private pubsub: PubSubService,
    private utility: Utility,
    private pagesService: PagesService,
    private appConfigService: AppConfigService,
    private dialogService: DialogService
  ) {

  }
  ngOnInit() {
    this.appPageId = this.tabConfig['appPageId'];
    this.appName = this.tabConfig['appName'];

    this.createGlobalPalleteRef(Toolkits.NGMaterialToolkit.components);
    this.generateUUID();
    this.palletTitles = BHComponent.COMPONENT_TYPE_TITLES;
  }
  generateUUID() {
    this.htmlDropZoneId = this.utility.generateUUID();
    this.htmlDropZone = '#' + this.htmlDropZoneId;
  }

  ngAfterViewInit() {
    // this.initializeKeeper();
    this.getAppPageDesign(this.appName, this.tabConfig.appPageName);
    this.htmlEditor = new CodeMirror.fromTextArea(this.textarea.nativeElement, {
      lineNumbers: true,
      mode: 'text/html',
      styleActiveLine: true,
      autoRefresh: true,
      theme: 'mdn-like',
    });

    let __this = this;
    this.htmlEditor.on("blur", function () {
      /*Updating selectedComponet's globalEditorRef html attr*/
      if (__this.selectedHTMLElementKey !== '') {
        __this.globalEditorRef[__this.selectedHTMLElementKey]['htmlAttributes'][__this.indexToUpdate]._value = __this.htmlEditor.getDoc().getValue();
        if (__this.hideHtmlEditor) {
          __this.selectedHTMLElementKey = '';
        }
      }
    });
  }

  showComponentAttributes(guid) {
    this.currAttrProps = this.globalEditorRef[guid].htmlAttributes;
  }

  showHTMLEditor(guid) {
    if (this.globalEditorRef[guid]['htmlAttributes']) {
      let refHtmlAttrs = this.globalEditorRef[guid]['htmlAttributes'];
      for (var i = 0; i < refHtmlAttrs.length; i++) {
        if (refHtmlAttrs[i]._key === 'html') {
          this.indexToUpdate = i;
          this.htmlEditor.getDoc().setValue(refHtmlAttrs[i]._value);
        }
      }
    }
  }

  createAttr() {
    for (let i = 0; i < this.currAttrProps.length; i++) {
      if (this.currAttrProps[i]._key.toLowerCase() === this.newAttr['key'].toLowerCase()) {
        this.dialogService.openSnackBar('Attribute with same name already exist');
        this.clearAttrValues();
        return false;
      }
    }
    var attr = new Attribute(this.newAttr['key'], this.attrToggle ? this.newAttr['value'] : this.newAttr['key'], this.attrToggle ? 'kv' : 'a', 'c');
    this.globalEditorRef[this.selectedElementKey].htmlAttributes.push(attr);
    this.clearAttrValues();
  }

  deleteAttr(index) {
    this.currAttrProps.splice(index, 1);
  }

  clearAttrValues() {
    this.newAttr = {};
  }

  getAppPageDesign(appName, appPageName) {
    const htmlDropZone = this.htmlDropZone;
    this.bKeeperService.getAppPageDesign(appName, appPageName).then(pageDesign => {
      $(htmlDropZone).html(pageDesign['designerHtml']);
      this.initializeKeeper();
      this.globalEditorRef = Object.assign({}, pageDesign['designerReference']);
    });
  }

  createGlobalPalleteRef(Obj) {
    for (const key in Obj) {
      if (key) {
        const keyObj = new Obj[key]();
        this.layoutArr.push(keyObj);
        this.globalPalleteRef[keyObj.guid] = keyObj;
        this.globalPalleteRef[keyObj.guid]['_key'] = key;
      }
    }
  }

  initializeKeeper() {
    const _this = this;
    const el = $('<img class="delete" src="assets/remove.svg" />');
    function clearAllHighlight() {
      $('.' + _this.htmlDropZoneId + ' .dropableZone').find('*').removeClass('ui-select-panel ui-hover-panel ui-hover-delete');
      $('.' + _this.htmlDropZoneId + ' .dropableZone').find('*').remove('img.delete');
      if (_this.prevElement) {
        $(_this.prevElement).addClass('ui-select-panel');
        $(_this.prevElement).append(el);
      }
    }
    clearAllHighlight();

    function clearSelectedHighlight(drop) {
      if (_this.prevElement) {
        $(_this.prevElement).removeClass('ui-select-panel');
        if (drop) {
          $(_this.prevElement).find('*').remove('img.delete');
        }
        _this.prevElement = null;
      }
    }
    function highlightSelectedElement(elem) {
      _this.hideProp = true;
      _this.hideHtmlEditor = true;
      _this.selectedElementKey = '';
      _this.currAttrProps = [];
      clearSelectedHighlight(false);
      const parent = $(elem).attr('b-editor-key') ? $(elem) : $(elem).parent();
      if ($(elem).hasClass('delete')) {
        _this.hideProp = true;
        _this.hideHtmlEditor = true;
        $(elem).parent().remove();
        const editorKey = $(parent).attr('b-editor-key');
        delete _this.globalEditorRef[editorKey];
      }
      if ($(parent).attr('b-editor-key') && $(elem).attr('class') != 'delete') {
        _this.selectedElementKey = $(parent).attr('b-editor-key');
        /*Show HTML editor for custom html*/
        if ($(parent).attr('b-props') && $(parent).attr('b-props') === 'html-editor') {
          /*Open HTML Editor*/

          _this.hideHtmlEditor = false;
          _this.selectedHTMLElementKey = _this.selectedElementKey;
          _this.showHTMLEditor($(parent).attr('b-editor-key'));
        }
        else {
          /*Open properties window*/
          _this.hideProp = false;
          _this.selectedElementKey = $(parent).attr('b-editor-key');
          _this.showComponentAttributes(_this.selectedElementKey);
        }

        $(parent).addClass('ui-select-panel');
        $(parent).find('*').remove('img.delete');
        if (!$(parent).has(el).length) {
          $(parent).append(el);
        }
        _this.prevElement = parent;
        const className = $(parent).attr('class');
        if (className.includes('row') || className.includes('column')) {
          $('.' + _this.htmlDropZoneId + ' .delete').css({ position: 'absolute', cursor: 'pointer' });
        } else {
          $('.' + _this.htmlDropZoneId + ' .delete').css({ position: 'relative', cursor: 'pointer' });
        }
        // stop delete icon from getting dragged out of the parent container. This
        // was done befault when parent is a droppable container. The delete icon
        // becomes draggable
        $('.' + _this.htmlDropZoneId + ' .delete').draggable({
          start: function (event) {
            event.stopPropagation();
            event.preventDefault();
          }
        });
      }
    }

    function getDesignerDOM(event, ui) {
      _this.hideProp = true;
      _this.hideHtmlEditor = true;
      clearSelectedHighlight(true);
      const viewKey = $(event.originalEvent.toElement).attr('b-palette-key');
      const domObj = $('.' + _this.htmlDropZoneId + ' .drop').children('.' + _this.htmlDropZoneId + ' .drag');
      if (viewKey) {
        const domToDisplay = _this.globalPalleteRef[viewKey].designerTemplate;
        const editorRef = new Toolkits.NGMaterialToolkit.components[_this.globalPalleteRef[viewKey]._key]();
        const editorDom = $(domToDisplay).attr('b-editor-key', editorRef.guid);
        domObj.replaceWith(editorDom);
        _this.globalEditorRef[editorRef.guid] = editorRef;
      } else {
        //domObj.replaceWith('<div class="drop"></div>');
        domObj.replaceWith('');
      }
    }
    function highlightOption(elem) {
      const className = $(elem).attr('class');
      const parent = $(elem).attr('b-editor-key') ? $(elem) : $(elem).parent();
      if (className == 'delete') {
        parent.addClass('ui-hover-delete');
      } else {
        parent.addClass('ui-hover-panel');
      }
    }
    function clearOptionHighlight(elem) {
      const className = $(elem).attr('class');
      const parent = $(elem).attr('b-editor-key') ? $(elem) : $(elem).parent();
      $(parent).removeClass('ui-hover-panel ui-hover-delete');
    }

    function dragDrop() {
      $('.' + _this.htmlDropZoneId + ' .drag').draggable({
        helper: 'clone',
        cursor: 'move',
        connectToSortable: '.' + _this.htmlDropZoneId + ' .dropableZone',
        appendTo: 'body',
        containment: 'window',
        scroll: false,
        cursorAt: { top: 0, left: 0 },
        // cancel: $('.' + _this.htmlDropZoneId + ' .delete')
      });

      $('.' + _this.htmlDropZoneId + ' .drop').sortable({
        accept: '.' + _this.htmlDropZoneId + ' .drag',
        sort: function (event, ui) {
          /* check if placeholder position is 0 add back placeholder */
          const pos = ui.placeholder.position();
          if (pos.left == 0 && pos.top == 0) {
            $(ui.item).before(ui.placeholder);
          }
        },
        receive: getDesignerDOM,
        update: function (event, ui) {
          // console.info(JSON.stringify(_this.globalEditorRef));
          // Nisarg - Enable selection on initial page creation / first element drop
          selectEvents();
        },
        stop: function (event, ui) {
          dragDrop();
        },
        cursor: 'move',
        helper: 'clone',
        // tolerance: 'pointer',
        placeholder: 'ui-sortable-placeholder',
        connectWith: '.' + _this.htmlDropZoneId + ' .drop',
        cursorAt: { top: 0, left: 0 }
      });
    }

    function selectEvents() {
      $('.' + _this.htmlDropZoneId + ' [b-editor-key]')
        .off('click')
        .mouseover(function (event) {
          // $(event.target).addClass('ui-hover-panel');
          highlightOption(event.target);
        })
        .mouseout(function (event) {
          // $(event.target).removeClass('ui-hover-panel');
          clearOptionHighlight(event.target);
        })
        .click(function (event) {
          event.stopPropagation();
          highlightSelectedElement(event.target);
        });
    }

    $(document).ready(function () {
      dragDrop();
      selectEvents();
    });
  }

  /**
  * Returns current drop zone HTML.
  * This method will be called by PageDesignerComponent(bKeeper's parent component)
  * for saving HTML.
  */
  getDesignSaveObj() {
    let designerHTML = $(this.htmlDropZone).html();
    return {
      designerHTML: designerHTML,
      designerReference: this.globalEditorRef
    };
  }
}