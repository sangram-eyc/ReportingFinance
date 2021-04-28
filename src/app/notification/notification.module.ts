import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MotifModule, MotifIconModule,MotifFormsModule } from '@ey-xd/ng-motif';
import { DashboardNotificationComponent } from './dashboard-notification/dashboard-notification.component';



@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    MotifModule,
    MotifIconModule,
    MotifFormsModule
  ],
  declarations: [DashboardNotificationComponent],
})
export class NotificationModule { }
