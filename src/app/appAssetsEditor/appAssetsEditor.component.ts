import { AppTabService } from './../services/appTab.service';
import { AppConfigService } from 'app/services/appConfig.service';
import { Component, ViewChild, Input, SimpleChanges } from '@angular/core';
import { PubSubService } from "app/services/pubSub.service";
import { Services } from '@jatahworx/bhive-core';
import { ImageDeleteDialogComponent } from "./imageSlider/imageDeleteDialog.component";
import { DialogService } from '../services/dialog.service';

@Component({
    selector: 'bh-assets-editor',
    templateUrl: './appAssetsEditor.template.html',
    styleUrls: ['./appAssetsEditor.style.css']
})
export class AppAssetsEditorComponent {
    @Input('tabConfig') tabConfig;
    @Input('currentlyActive') currentlyActive;
    @ViewChild('droppabelRegion') droppabelRegion;
    draggingOver = false;
    AppService;
    appName;
    tree;
    imageObjArr = [];
    currentRelativePath = "";
    deletePathObj;
    insertPathObj;
    selectedEvent;

    constructor(private pubsub: PubSubService, private appConfigService: AppConfigService, private dialogService: DialogService) {
        this.AppService = new Services.AppService();
        this.appName = this.appConfigService.getGAppName();
    }

    ngOnInit() {
        this.getAppAssets();
    }

    ngOnChanges(changes: SimpleChanges) {
        let isTabActive = changes['currentlyActive'];
        if (isTabActive && this.currentlyActive) {
            this.pubsub.$pub('tabListner', []);
        }
    }

    selectedOption(selectedObjectFromTree) {
        this.currentRelativePath = selectedObjectFromTree.relativePath;
        this.imageObjArr = [];
        this.createImageArrayFromSelectedFolder(selectedObjectFromTree);
        this.selectedEvent = selectedObjectFromTree.relativePath.substr(0, selectedObjectFromTree.relativePath.lastIndexOf('~'));
    }

    getAppAssets() {
        if (this.appName) {
            this.AppService.getAppAssets(this.appName).then(result => {
                if (result && result.data) {
                    this.tree = this.addOpenFlagToFolders(result.data);
                }
            }, error => {
                console.error(error);
            })
        }
    }

    addOpenFlagToFolders(tree) {
        if (tree && tree.type == 'folder') {
            tree['open'] = false;
        }
        if (tree && tree.children && tree.children.length > 0) {
            for (let i = 0; i < tree.children.length; i++) {
                tree.children[i] = this.addOpenFlagToFolders(tree.children[i]);
            }
        }
        return tree;
    }

    createImageArrayFromSelectedFolder(inputTree) {
        if (inputTree && inputTree.children) {
            for (let i = 0; i < inputTree.children.length; i++) {
                if (inputTree.children[i].type) {
                    if (inputTree.children[i].type == 'file') {
                        this.imageObjArr.push({
                            name: inputTree.children[i].name,
                            path: 'file://' + inputTree.children[i].path,
                            type: 'file'
                        });
                    } else {
                        this.imageObjArr.push(inputTree.children[i]);
                    }
                }
            }
        }
    }

    dropped(event) {
        if (event && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            let lengthOfFiles = event.dataTransfer.files.length;
            let i = 0;
            while (lengthOfFiles) {
                let imageName = event.dataTransfer.files[i].name;
                let imagePath = event.dataTransfer.files[i].path;
                let mimeType = event.dataTransfer.files[i].type.substr(0, event.dataTransfer.files[i].type.lastIndexOf('/'));

                if (!this.checkIfImageAlreadyPresetInArray(imageName) && event.dataTransfer.files[i] && event.dataTransfer.files[i].type && mimeType == 'image') {
                    this.AppService.putAsset(this.appName, imagePath, this.currentRelativePath, imageName).then(result => {
                        let tempPathObj = {
                            name: imageName,
                            path: result.destPath,
                            type: 'file',
                            parentPath: this.currentRelativePath
                        };
                        this.insertPathObj = Object.assign({}, tempPathObj);
                        tempPathObj.path = 'file://' + tempPathObj.path;
                        this.imageObjArr.push(tempPathObj);
                    }, error => {
                        console.error(error);
                    })
                } else if (!event.dataTransfer.files[i].type || mimeType != 'image') {
                    let message = event.dataTransfer.files[i].name + " is not of the correct format.";
                    console.error(message);
                    this.dialogService.openSnackBar(message);
                } else {
                    let message = event.dataTransfer.files[i].name + " is already present.";
                    console.error(message);
                    this.dialogService.openSnackBar(message);
                }
                i++;
                lengthOfFiles--;
            }
        }
        this.draggingOver = false;
    }

    checkIfImageAlreadyPresetInArray(imageName) {
        for (let i = 0; i < this.imageObjArr.length; i++) {
            if (this.imageObjArr[i].name == imageName) {
                return true;
            }
        }
        return false;
    }

    deleteImage(index) {
        ImageDeleteDialogComponent.message = "Do you really want to delete this image?";
        this.dialogService.createDialog(ImageDeleteDialogComponent).afterClosed().subscribe(result => {
            if (result) {
                this.AppService.deleteAsset(this.appName, this.currentRelativePath + '~' + this.imageObjArr[index].name).then(result => {
                    this.deletePathObj = {
                        index: index,
                        path: this.currentRelativePath
                    }
                    this.imageObjArr.splice(index, 1);
                }, error => {
                    console.error(error);
                })
            }
        }, error => {
            console.error(error);
        })
    }

    deleteFromTree(pathArray, index) {
        for (let i = 1; i < pathArray.length; i++) {
            for (let j = 0; j < this.tree.children.length; j++) {
                if (this.tree.children[j].name == pathArray[i]) {

                }
            }
        }
    }

    ngOnDestroy() {
        this.imageObjArr = [];
    }
}