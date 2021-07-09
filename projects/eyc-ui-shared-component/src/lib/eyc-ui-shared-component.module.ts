import { NgModule } from '@angular/core';
import { ModalModule } from './modal/modal.module';
import { MotifButtonModule } from '@ey-xd/ng-motif';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
// import { UploadComponent } from './upload/components/upload.component';




@NgModule({
  declarations: [],
  imports: [
    ModalModule,
    MotifButtonModule,
    UploadModule,
    DownloadModule
  ],
  exports: [
    ModalModule,
    UploadModule,
    DownloadModule
  ]
})
export class EycUiSharedComponentModule { }
