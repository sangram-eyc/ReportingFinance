import { NgModule } from '@angular/core';
import { AdministrationComponent } from './administration/components/administration.component';
import { CommonModule } from '@angular/common';
import { MotifCardModule, MotifButtonModule } from '@ey-xd/ng-motif';
import { AdminRegulatoryReportingModule } from './admin-regulatory-reporting/admin-regulatory-reporting.module';
import { UsersModule } from './users/users.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';

@NgModule({
  declarations: [
    AdministrationComponent
  ],
  imports: [
    CommonModule,
    MotifCardModule,
    MotifButtonModule,
    AdminRegulatoryReportingModule,
    UsersModule,
    UserDetailsModule,
    EycUiSharedComponentModule
  ],
  exports: [AdministrationComponent]
})
export class EycAdminModule { }
