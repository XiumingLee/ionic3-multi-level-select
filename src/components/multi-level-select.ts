import { Component, Input, forwardRef, ViewEncapsulation } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// MODELS
import { LookUpItem, NamedIdentity } from '../models/models';

// COMPONENTS
import { MultiLevelSelectDialogComponent } from './multi-level-select-dialog';

@Component({
  selector: 'ryaa-multi-level-select',
  template: `
    <ion-toolbar (click)="open()">
      <ion-title [ngClass]="{ 'multi-level-select-placeholder': !selectedItem }">{{ selectedItem ? selectedItem?.name : selectPlaceholder }}</ion-title>
      <ion-buttons right [mode]="componentMode">
        <button *ngIf="selectedItem" ion-button icon-only (click)="reset($event)">
          <i class="fa fa-times" aria-hidden="true"></i>
        </button>
        <button ion-button icon-only>
          <i class="fa fa-caret-down" aria-hidden="true"></i>
        </button>
      </ion-buttons>
    </ion-toolbar>
  `,
  styles: [`
    ryaa-multi-level-select ion-toolbar {
      min-height: 34px;
    }
    ryaa-multi-level-select ion-toolbar .toolbar-background {
      background: #fcfcfc;
      border: 1px solid #f4f4f4;
    }
    ryaa-multi-level-select ion-toolbar ion-title.title-ios {
      padding-left: 0px;
      padding-right: 0px;
    }
    ryaa-multi-level-select ion-toolbar ion-title.multi-level-select-placeholder {
      opacity: .33;
    }
    ryaa-multi-level-select ion-toolbar ion-title .toolbar-title {
      font: 400 15px "Roboto", sans-serif;
      color: #373B40;
    }
    ryaa-multi-level-select ion-toolbar ion-title .toolbar-title.toolbar-title-ios {
      text-align: left;
      padding-left: 8px;
    }
    ryaa-multi-level-select ion-toolbar ion-buttons button i.fa.fa-times {
      color: #ff5a5a;
    }
    ryaa-multi-level-select ion-toolbar ion-buttons button i.fa.fa-caret-down {
      color: #999;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiLevelSelectComponent), // tslint:disable-line:no-forward-ref
      multi: true
    }
  ]
})
export class MultiLevelSelectComponent implements ControlValueAccessor {

  public selectedItem: NamedIdentity;
  @Input() public selectPlaceholder: 'Please Select';  // 选择框内容
  @Input() public selectDialogTitle: 'Please Select';  // 选择弹窗标题内容
  @Input() public componentMode: 'md';  // 平台模式

  @Input() public lookups: LookUpItem[];
  @Input() public allowParent: boolean;

  constructor(public modalCtrl: ModalController, public params: NavParams) {
    this.selectedItem = null;
  }

  public writeValue(value: NamedIdentity) {
    this.selectedItem = value;
  }

  public propagateChange = (_: any) => { }; // tslint:disable-line:no-empty

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() { } // tslint:disable-line:no-empty

  public open() {
    const multiLevelSelectDialogComponent = this.modalCtrl.create(MultiLevelSelectDialogComponent, {
      selectedItemId: this.selectedItem ? this.selectedItem.id : null,
      lookups: this.lookups,
      allowParent: this.allowParent,
      selectDialogTitle: this.selectDialogTitle,
      componentMode: this.componentMode
    });
    multiLevelSelectDialogComponent.onDidDismiss((selectedItem: NamedIdentity) => {
      if (selectedItem) {
        this.selectedItem = selectedItem;
        this.propagateChange(this.selectedItem);
      }
    });
    multiLevelSelectDialogComponent.present();
  }

  public reset($event) {
    $event.stopPropagation();
    this.selectedItem = null;
    this.propagateChange(this.selectedItem);
  }

}
