import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifButtonModule, MotifIconModule, MotifAvatarModule } from '@ey-xd/ng-motif';
import { CommentSideMenuComponent } from './components/comment-side-menu.component';




@NgModule({
  declarations: [CommentSideMenuComponent],
  imports: [
    CommonModule,
    MotifButtonModule,
    MotifIconModule,
    MotifAvatarModule
  ],
  exports: [CommentSideMenuComponent]
})
export class CommentSideMenuModule { }
