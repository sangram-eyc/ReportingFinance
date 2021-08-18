import { NgModule } from '@angular/core';
import { ModalModule } from './modal/modal.module';
import { MotifButtonModule } from '@ey-xd/ng-motif';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
// import { UploadComponent } from './upload/components/upload.component';
import {EycPowerbiModule} from '../lib/eyc-powerbi/eyc-powerbi.module';
import { GridModule } from './grid/grid.module';
import { IntakeFilesModule } from './intake-files/intake-files.module';
import { TableHeaderRendererComponent } from './table-header-renderer/table-header-renderer.component'
import { InlineSVGModule } from 'ng-inline-svg';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [TableHeaderRendererComponent],
  imports: [
    ModalModule,
    MotifButtonModule,
    UploadModule,
    DownloadModule,
    EycPowerbiModule,
    GridModule,
    IntakeFilesModule,
    InlineSVGModule.forRoot(),
    CommonModule
  ],
  exports: [
    ModalModule,
    UploadModule,
    DownloadModule,
    EycPowerbiModule,
    GridModule,
    IntakeFilesModule,
    TableHeaderRendererComponent
  ]
})
export class EycUiSharedComponentModule { }
