import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import { PanelRightCommentDetailsComponent } from './components/panel-right-comment-details.component';
import { CommentDetailsPrModule } from '../comment-details-pr/comment-details-pr.module';




@NgModule({
  declarations: [PanelRightCommentDetailsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    CommentDetailsPrModule
  ],
  exports: [PanelRightCommentDetailsComponent]
})
export class PanelRightCommentDetailsModule { }
