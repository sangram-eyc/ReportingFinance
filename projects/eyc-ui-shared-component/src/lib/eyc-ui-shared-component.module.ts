import { NgModule } from '@angular/core';
import { ModalModule } from './modal/modal.module';
import { MotifButtonModule, MotifIconModule, MotifTabBarModule } from '@ey-xd/ng-motif';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
// import { UploadComponent } from './upload/components/upload.component';
import {EycPowerbiModule} from '../lib/eyc-powerbi/eyc-powerbi.module';
import { GridModule } from './grid/grid.module';
import { IntakeFilesModule } from './intake-files/intake-files.module';
import { TableHeaderRendererComponent } from './table-header-renderer/table-header-renderer.component'
import { InlineSVGModule } from 'ng-inline-svg';
import { CommonModule } from '@angular/common';
import { CommentSideMenuModule } from './comment-side-menu/comment-side-menu.module';
import {PanelRightCommentDetailsModule} from './panel-right-comment-details/panel-right-comment-details.module'
import {CommentDetailsPrModule} from './comment-details-pr/comment-details-pr.module'
import { AuditLogModule } from './audit-log/audit-log.module';
import { SharedTabsComponent } from './tabs/component/shared-tabs.component';

@NgModule({
  declarations: [TableHeaderRendererComponent, SharedTabsComponent],
  imports: [
    ModalModule,
    MotifButtonModule,
    MotifTabBarModule,
    UploadModule,
    DownloadModule,
    EycPowerbiModule,
    GridModule,
    CommentSideMenuModule,
    IntakeFilesModule,
    InlineSVGModule.forRoot(),
    CommonModule,
    PanelRightCommentDetailsModule,
    CommentDetailsPrModule,
    AuditLogModule,
    MotifIconModule
  ],
  exports: [
    ModalModule,
    UploadModule,
    MotifTabBarModule,
    DownloadModule,
    EycPowerbiModule,
    GridModule,
    CommentSideMenuModule,
    IntakeFilesModule,
    TableHeaderRendererComponent,
    PanelRightCommentDetailsModule,
    CommentDetailsPrModule,
    AuditLogModule,
    SharedTabsComponent
  ]
})
export class EycUiSharedComponentModule { }
