import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogComponent } from './components/audit-log.component';
import { MotifIconModule, MotifProrgressIndicatorsModule, MotifButtonModule } from '@ey-xd/ng-motif';


@NgModule({
  declarations: [
    AuditLogComponent
  ],
  imports: [
    CommonModule,
    MotifProrgressIndicatorsModule,
    MotifIconModule,
    MotifButtonModule
  ],
  exports: [AuditLogComponent]
})
export class AuditLogModule { }
