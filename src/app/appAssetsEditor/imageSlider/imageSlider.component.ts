import { ImageDeleteDialogComponent } from './imageDeleteDialog.component';
import { DialogService } from './../../services/dialog.service';
import { transition, trigger, state, animate, style, keyframes } from '@angular/animations';
import { Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChanges, IterableDiffers } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'ad-image-slider',
    templateUrl: './imageSlider.template.html',
    styleUrls: ['./imageSlider.style.css'],
    animations: [
        trigger('thumbnail', [
            state('inactive', style({
                backgroundColor: '#fafafa',
                transform: 'scale(0.8)'
            })),
            state('active', style({
                backgroundColor: 'lightgray',
                transform: 'scale(1)'
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ]),
        trigger('flyInOut', [
            transition(':enter', [
                animate(300, keyframes([
                    style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
                    style({ opacity: 1, transform: 'translateX(15px)', offset: 0.3 }),
                    style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
                ]))
            ]),
            transition(':leave', [
                animate(300, keyframes([
                    style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
                    style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
                    style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
                ]))
            ])
        ])
    ]
})
export class ImageSliderComponent implements OnInit, OnChanges {
    @Input('imageObjArr') imageObjArr = [];
    clickedImageSrc = "";
    title = "";
    currentSelectedIndex = -1;
    mouseOverIndex = -1;
    iterableDiffer;
    @Output() imageDeleteIndex = new EventEmitter()

    constructor(private _sanitizer: DomSanitizer, private dialogService: DialogService, private _iterableDiffers: IterableDiffers) {
        this.iterableDiffer = this._iterableDiffers.find([]).create(null);
    }

    ngOnInit() {}

    ngOnChanges() {
        this.clickedImageSrc = "";
        this.currentSelectedIndex = -1;
    }

    ngDoCheck() {
        let changes = this.iterableDiffer.diff(this.imageObjArr);
        if (changes) {
            this.assignImageSrc();
        }
    }

    imageClicked(index) {
        this.currentSelectedIndex = index;
        this.assignImageSrc();
    }

    carousalLeftClicked() {
        do {
            this.currentSelectedIndex--;
        } while (this.imageObjArr[this.currentSelectedIndex] && this.imageObjArr[this.currentSelectedIndex].type == 'folder')
        if (this.currentSelectedIndex < 0) this.currentSelectedIndex = this.imageObjArr.length - 1;
        this.assignImageSrc();
    }

    carousalRightClicked() {
        do {
            this.currentSelectedIndex++;
        } while (this.imageObjArr[this.currentSelectedIndex] && this.imageObjArr[this.currentSelectedIndex].type == 'folder')
        if (this.currentSelectedIndex > this.imageObjArr.length - 1) this.currentSelectedIndex = 0;
        this.assignImageSrc();
    }

    assignImageSrc() {
        if (this.currentSelectedIndex > -1 && this.currentSelectedIndex < this.imageObjArr.length && this.imageObjArr[this.currentSelectedIndex] && this.imageObjArr[this.currentSelectedIndex].type != 'folder') {
            this.clickedImageSrc = this.imageObjArr[this.currentSelectedIndex].path;
            this.title = this.imageObjArr[this.currentSelectedIndex].name;
        } else {
            this.clickedImageSrc = "";
            this.title = "";
        }
    }

    deleteClicked(index) {
        this.imageDeleteIndex.emit(index);
    }

    assignMouseOverIndex(index) {
        this.mouseOverIndex = index;
    }

    clearMouseOverIndex() {
        this.mouseOverIndex = -1;
    }

    ngOnDestroy() {
        this.imageObjArr = [];
    }
}