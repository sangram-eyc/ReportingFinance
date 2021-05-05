import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegulatoryReportingFilingComponent } from './regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { FilingCardComponent } from '../../../../src/app/shared/filing-card/filing-card.component'; 
import { MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule} from '@ey-xd/ng-motif';



@NgModule({
  imports: [
    CommonModule,
    MotifCardModule,
    MotifButtonModule,
    MotifIconModule,
    MotifProrgressIndicatorsModule
  ],
  declarations: [
    RegulatoryReportingFilingComponent,
    FilingCardComponent
  ],
  exports: [RegulatoryReportingFilingComponent]
})
export class EycRegulatoryReportingModule { }
