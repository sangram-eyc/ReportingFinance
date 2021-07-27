import { NgModule } from '@angular/core';
import { ModalModule } from './modal/modal.module';
import { MotifButtonModule } from '@ey-xd/ng-motif';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
// import { UploadComponent } from './upload/components/upload.component';
import {EycPowerbiModule} from '../lib/eyc-powerbi/eyc-powerbi.module';
import { GridModule } from './grid/grid.module';




@NgModule({
  declarations: [],
  imports: [
    ModalModule,
    MotifButtonModule,
    UploadModule,
    DownloadModule,
    EycPowerbiModule,
    GridModule
  ],
  exports: [
    ModalModule,
    UploadModule,
    DownloadModule,
    EycPowerbiModule,
    GridModule
  ]
})
export class EycUiSharedComponentModule { }
