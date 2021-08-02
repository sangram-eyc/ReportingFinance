import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegulatoryReportingComponent } from './components/admin-regulatory-reporting.component';
import { MotifChipModule, MotifIconModule, MotifModalModule, MotifTabBarModule, MotifToastModule  } from '@ey-xd/ng-motif';
import { MotifFormsModule,  MotifTableModule, MotifModule} from '@ey-xd/ng-motif';
import { UsersComponent } from './../users/components/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EycRegulatoryReportingModule } from 'projects/eyc-regulatory-reporting/src/lib/eyc-regulatory-reporting.module';
import { EycUiSharedComponentModule } from 'projects/eyc-ui-shared-component/src/lib/eyc-ui-shared-component.module';
import { EycTeamDetailsComponent } from './eyc-team-details/eyc-team-details.component';





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
    EycRegulatoryReportingModule,
    EycUiSharedComponentModule
  ]
})
export class AdminRegulatoryReportingModule { }

