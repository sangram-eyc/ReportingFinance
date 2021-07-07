import { NgModule } from '@angular/core';
import { ModalModule } from './modal/modal.module';
import { MotifButtonModule } from '@ey-xd/ng-motif';
import { UploadModule } from './upload/upload.module';




@NgModule({
  declarations: [],
  imports: [
    ModalModule,
    MotifButtonModule,
    UploadModule
  ],
  exports: [
    ModalModule,
    UploadModule
  ]
})
export class EycUiSharedComponentModule { }
