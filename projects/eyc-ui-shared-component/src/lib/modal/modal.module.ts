import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './component/modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MotifButtonModule, MotifFormsModule, MotifIconModule   } from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoSanitizePipe } from "../pipes/noSanitize.pipe";
import { VisualisationModalComponent } from './visualisation-modal/visualisation-modal.component';
import { UploadModule } from '../upload/upload.module';
import { EycPowerbiModule } from '../eyc-powerbi/eyc-powerbi.module';


@NgModule({
  declarations: [
    ModalComponent,
    NoSanitizePipe,
    VisualisationModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MotifButtonModule,
    MotifFormsModule,
    ReactiveFormsModule,
    FormsModule,
    MotifIconModule ,
    UploadModule,
    EycPowerbiModule
  ],
  exports: [
    ModalComponent
  ]
})
export class ModalModule { }
