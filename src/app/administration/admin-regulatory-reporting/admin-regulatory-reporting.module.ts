import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegulatoryReportingComponent } from './components/admin-regulatory-reporting.component';
import { MotifIconModule, MotifModalModule, MotifTabBarModule, MotifToastModule  } from '@ey-xd/ng-motif';
import { MotifFormsModule,  MotifTableModule, MotifModule} from '@ey-xd/ng-motif';
import { UsersComponent } from './../users/components/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EycRegulatoryReportingModule } from 'projects/eyc-regulatory-reporting/src/lib/eyc-regulatory-reporting.module'





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
    MotifTableModule,
    MotifModalModule,
    FormsModule,
    ReactiveFormsModule,
    MotifToastModule,
    HttpClientModule,
    MotifIconModule,
    EycRegulatoryReportingModule
  ]
})
export class AdminRegulatoryReportingModule { }

