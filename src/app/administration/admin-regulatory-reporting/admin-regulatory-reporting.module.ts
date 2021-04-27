import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegulatoryReportingComponent } from './components/admin-regulatory-reporting.component';
import { MotifTabBarModule  } from '@ey-xd/ng-motif';



@NgModule({
  declarations: [
    AdminRegulatoryReportingComponent
  ],
  imports: [
    CommonModule,
    MotifTabBarModule
  ]
})
export class AdminRegulatoryReportingModule { }
