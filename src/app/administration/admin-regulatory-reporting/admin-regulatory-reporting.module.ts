import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegulatoryReportingComponent } from './components/admin-regulatory-reporting.component';
import { MotifTabBarModule  } from '@ey-xd/ng-motif';
import { MotifFormsModule,  MotifTableModule, MotifModule} from '@ey-xd/ng-motif';
import { UsersComponent } from './../users/components/users.component';




@NgModule({
  declarations: [
    AdminRegulatoryReportingComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    MotifModule,
    MotifTabBarModule,
    MotifFormsModule,
    MotifTableModule
  ]
})
export class AdminRegulatoryReportingModule { }

