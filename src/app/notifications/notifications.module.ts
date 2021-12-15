import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MotifModule, MotifIconModule, MotifFormsModule } from '@ey-xd/ng-motif';
import { NotificationsPanelComponent } from './notifications-panel/notifications-panel.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    MotifModule,
    MotifIconModule,
    MotifFormsModule
  ],
  declarations: [NotificationsPanelComponent, NotificationItemComponent],
  exports: [
    NotificationsPanelComponent
  ]
})
export class NotificationsModule { }
