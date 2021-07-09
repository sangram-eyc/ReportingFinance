import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifModule, MotifButtonModule, MotifToastModule } from '@ey-xd/ng-motif';
import { DownloadComponent } from './components/download.component';



@NgModule({
  declarations: [DownloadComponent],
  imports: [
    CommonModule,
    MotifModule,
    MotifButtonModule,
    MotifToastModule
  ],
  exports: [DownloadComponent]
})
export class DownloadModule { }
