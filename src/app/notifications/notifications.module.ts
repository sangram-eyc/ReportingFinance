import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MotifModule,
  MotifIconModule,
  MotifFormsModule,
  MotifTabBarModule,
  MotifTableModule,
  MotifModalModule, MotifChipModule, MotifToastModule
} from '@ey-xd/ng-motif';
import { NotificationsPanelComponent } from './notifications-panel/notifications-panel.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { ArchivedNotificationsComponent } from './archived-notifications/archived-notifications.component';
import {HttpClientModule} from "@angular/common/http";
import {
  EycRegulatoryReportingModule
} from "../../../projects/eyc-regulatory-reporting/src/lib/eyc-regulatory-reporting.module";
import {
  EycUiSharedComponentModule
} from "../../../projects/eyc-ui-shared-component/src/lib/eyc-ui-shared-component.module";
import {UserRolesModule} from "@default/administration/user-roles/user-roles.module";



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    MotifModule,
    MotifIconModule,
    MotifFormsModule,
    MotifModule,
    MotifTabBarModule,
    MotifFormsModule,
    MotifTableModule,
    MotifModalModule,
    MotifChipModule,
    FormsModule,
    ReactiveFormsModule,
    MotifToastModule,
    HttpClientModule,
    MotifIconModule,
    EycRegulatoryReportingModule,
    EycUiSharedComponentModule,
    UserRolesModule
  ],
  declarations: [NotificationsPanelComponent, NotificationItemComponent, ArchivedNotificationsComponent],
  exports: [
    NotificationsPanelComponent
  ]
})
export class NotificationsModule { }
