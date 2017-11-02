import { Utility } from '../../util/util';
import { style } from '@angular/animations';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, SimpleChanges } from '@angular/core';
@Component({
    selector: 'tree-component',
    templateUrl: './makeTree.template.html',
    styleUrls: ['./makeTree.style.css']
})
export class TreeComponent implements OnInit {

    @Input('tree') tree;
    @Input('path') path;
    @Input('deletePathObj') deletePathObj;
    @Input('insertPathObj') insertPathObj;
    @Output('selectedEventChange') selectedEventChange = new EventEmitter();
    @Input('selectedEvent') selectedEvent;
    selectedFolderIndex = -1;
    isSelected = false;

    ngOnInit() {
        if (this.tree) {
            if (this.path) {
                this.path = this.path + '~' + this.tree.name;
            } else {
                this.path = this.tree.name
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['deletePathObj']) {
            this.deleteNode();
        }
        if (changes['insertPathObj']) {
            this.insertNode();
        }

    }

    deleteNode() {
        if (this.tree && this.tree.children && this.deletePathObj && this.deletePathObj.index >= 0) {
            if (this.deletePathObj.path == this.path) {
                this.tree.children.splice(this.deletePathObj.index, 1);
            }
        }
    }

    insertNode() {
        if (this.tree && this.tree.children && this.insertPathObj) {
            if (this.insertPathObj.parentPath == this.path) {
                this.tree.children.push(this.insertPathObj);
            }
        }
    }

    openFolder(index) {
        if (this.tree && this.tree.children && this.tree.children.length > 0) {
            if (this.tree.children[index].type == 'folder' && !this.tree.children[index]['open'] && this.checkIfAnyChildIsFolder(this.tree.children[index].children)) {
                this.tree.children[index]['open'] = true;
            } else if (this.tree.children[index].type == 'folder' && this.tree.children[index]['open']) {
                this.tree.children[index]['open'] = false;
            }
        }
    }

    selectFolder(index, branch) {
        branch['relativePath'] = this.path + '~' + branch.name;
        this.selectedFolderIndex = index;
        this.selectedEventChange.emit(branch);

    }

    checkIfAnyChildIsFolder(branchChildren) {
        for (let i = 0; i < branchChildren.length; i++) {
            if (branchChildren[i].type == 'folder') {
                return true;
            }
        }
        return false;
    }

    clearSelection() {
        if (this.selectedEvent == this.path) {
            this.isSelected = this.selectedEvent;
        } else {
            this.selectedEvent = "";
        }
    }
}
