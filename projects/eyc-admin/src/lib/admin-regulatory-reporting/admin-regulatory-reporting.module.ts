import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegulatoryReportingComponent } from './components/admin-regulatory-reporting.component';
import { MotifChipModule, MotifIconModule, MotifModalModule, MotifTabBarModule, MotifToastModule  } from '@ey-xd/ng-motif';
import { MotifFormsModule,  MotifTableModule, MotifModule} from '@ey-xd/ng-motif';
import { UsersComponent } from './../users/components/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EycTeamDetailsComponent } from './eyc-team-details/eyc-team-details.component';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { StaticDataModule } from '../static-data/static-data.module.';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';




@NgModule({
  declarations: [
    AdminRegulatoryReportingComponent,
    UsersComponent,
    EycTeamDetailsComponent
  ],
  imports: [
    CommonModule,
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
    EycUiSharedComponentModule,
    UserRolesModule,
    StaticDataModule
  ]
})
export class AdminRegulatoryReportingModule { }

