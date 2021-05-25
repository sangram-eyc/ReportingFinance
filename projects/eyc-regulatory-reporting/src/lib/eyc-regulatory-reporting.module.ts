import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegulatoryReportingFilingComponent } from './regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { FilingCardComponent } from './shared/filing-card/filing-card.component';
import { MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule } from '@ey-xd/ng-motif';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AgGridModule } from 'ag-grid-angular';
import { TableHeaderRendererComponent } from './shared/table-header-renderer/table-header-renderer.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import {EycRrSettingsService} from './services/eyc-rr-settings.service';
import { DotsCardComponent } from './shared/dots-card/dots-card.component';
import { DataIntakeComponent } from './data-intake/components/data-intake.component';
import { FundScopingComponent } from './fund-scoping/components/fund-scoping.component';
import { ClientReviewComponent } from './client-review/components/client-review.component';
import { SubmissionComponent } from './submission/components/submission.component';
import { RrReportingComponent } from './rr-reporting/components/rr-reporting.component';
import { ReportingTabsCardComponent } from './shared/reporting-tabs-card/components/reporting-tabs-card.component';
import { DataExplorerForReportingAndClientComponent } from './data-explorer-for-reporting-and-client/components/data-explorer-for-reporting-and-client/data-explorer-for-reporting-and-client.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    MotifCardModule,
    MotifButtonModule,
    MotifFormsModule,
    MotifIconModule,
    MotifProrgressIndicatorsModule,
    MotifTableModule,
    MotifTabBarModule,
    SlickCarouselModule,
    InlineSVGModule.forRoot(),
    HttpClientModule,
    MotifPaginationModule,
    MotifBreadcrumbModule,
    FormsModule,
    MotifChipModule,
    MotifModalModule,
    MotifToastModule
  ],
  declarations: [
    RegulatoryReportingFilingComponent,
    FilingCardComponent,
    TableHeaderRendererComponent,
    DotsCardComponent,
    DataIntakeComponent,
    FundScopingComponent,
    ClientReviewComponent,
    SubmissionComponent,
    RrReportingComponent,
    ReportingTabsCardComponent,
    DataExplorerForReportingAndClientComponent
  ],
  exports: [RegulatoryReportingFilingComponent]
})
export class EycRegulatoryReportingModule {

  public static forRoot(environment: any): ModuleWithProviders {

    return {
      ngModule: EycRegulatoryReportingModule,
      providers: [
        EycRrSettingsService,
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment
        }
      ]
    };
  }
 }
