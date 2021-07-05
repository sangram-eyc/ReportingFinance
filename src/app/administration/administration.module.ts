import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifCardModule, MotifButtonModule } from '@ey-xd/ng-motif';
import { UsersModule } from './users/users.module';
import { AdministrationComponent } from './components/administration.component';
import { AdminRegulatoryReportingModule } from './admin-regulatory-reporting/admin-regulatory-reporting.module';
import { UserDetailsModule } from './user-details/user-details.module';
// import { EycUiSharedComponentModule } from 'projects/eyc-ui-shared-component/src/lib/eyc-ui-shared-component.module'


@NgModule({
  imports: [
    CommonModule,
    MotifCardModule,
    MotifButtonModule,
    AdminRegulatoryReportingModule,
    UsersModule,
    UserDetailsModule,
    // EycUiSharedComponentModule
  ],
  declarations: [
    AdministrationComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class AdministrationModule { }