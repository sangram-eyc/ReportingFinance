import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifCardModule, MotifButtonModule, MotifFormsModule } from '@ey-xd/ng-motif';
import { AdministrationComponent } from './components/administration.component';
import { AdminRegulatoryReportingModule } from './admin-regulatory-reporting/admin-regulatory-reporting.module';


@NgModule({
  imports: [
    CommonModule,
    MotifCardModule,
    MotifButtonModule,
    MotifFormsModule,
    AdminRegulatoryReportingModule
  ],
  declarations: [
    AdministrationComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class AdministrationModule { }