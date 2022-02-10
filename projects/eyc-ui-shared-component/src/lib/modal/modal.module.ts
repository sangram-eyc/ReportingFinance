import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './component/modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MotifButtonModule, MotifFormsModule, MotifIconModule, MotifToastModule   } from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NoSanitizePipe } from "../pipes/noSanitize.pipe";
import { VisualisationModalComponent } from './visualisation-modal/visualisation-modal.component';
import { UploadModule } from '../upload/upload.module';
import { EycPowerbiModule } from '../eyc-powerbi/eyc-powerbi.module';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { RemoveSpacesDirective } from './dir/remove-spaces.directive';
import { ResolveModalComponent } from './resolve-modal/components/resolve-modal.component';


@NgModule({
  declarations: [
    ModalComponent,
    VisualisationModalComponent,
    ErrorModalComponent,
    RemoveSpacesDirective,
    ResolveModalComponent
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
    EycPowerbiModule,
    MotifToastModule
  ],
  exports: [
    ModalComponent,
    ErrorModalComponent,
    RemoveSpacesDirective,
    ResolveModalComponent
  ]
})
export class ModalModule { }
