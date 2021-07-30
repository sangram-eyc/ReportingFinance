import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifFormsModule, MotifModule, MotifButtonModule } from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from './components/upload.component';
import { NoSanitizePipe } from "../pipes/noSanitize.pipe";




@NgModule({
  declarations: [UploadComponent , NoSanitizePipe],
  imports: [
    CommonModule,
    MotifFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MotifModule,
    MotifButtonModule
  ],
  exports: [UploadComponent, NoSanitizePipe]
})
export class UploadModule { }
