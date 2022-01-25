import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import { CommentDetailsPrComponent } from './components/comment-details-pr.component';
import {MatChipsModule} from '@angular/material/chips';
import { MotifCardModule, MotifIconModule, MotifTooltipModule } from '@ey-xd/ng-motif';

@NgModule({
  declarations: [CommentDetailsPrComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatChipsModule,
    MotifCardModule,
    MotifTooltipModule,
    MotifIconModule
  ],
  exports: [CommentDetailsPrComponent]
})
export class CommentDetailsPrModule { }
