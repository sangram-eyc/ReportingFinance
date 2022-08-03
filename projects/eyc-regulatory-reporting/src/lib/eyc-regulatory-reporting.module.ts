import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegulatoryReportingFilingComponent } from './regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { FilingCardComponent } from './shared/filing-card/filing-card.component';
import { MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule,MotifDropdownModule  } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { TableHeaderRendererComponent } from './shared/table-header-renderer/table-header-renderer.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {EycRrSettingsService} from './services/eyc-rr-settings.service';
import { DotsCardComponent } from './shared/dots-card/dots-card.component';
import { DataIntakeComponent } from './data-intake/components/data-intake.component';
import { FundScopingComponent } from './fund-scoping/components/fund-scoping.component';
import { ClientReviewComponent } from './client-review/components/client-review.component';
import { SubmissionComponent } from './submission/components/submission.component';
import { RrReportingComponent } from './rr-reporting/components/rr-reporting.component';
import { ViewExceptionReportsComponent } from './shared/view-exception-reports/components/view-exception-reports.component';
import { ReportingTabsCardComponent } from './shared/reporting-tabs-card/components/reporting-tabs-card.component';
import { DataExplorerForReportingAndClientComponent } from './data-explorer-for-reporting-and-client/components/data-explorer-for-reporting-and-client/data-explorer-for-reporting-and-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {EycRrApiService} from './services/eyc-rr-api.service';
import { RrVisualisationComponent } from './shared/rr-visualisation/rr-visualisation.component';
import {EycPbiService} from './services/eyc-pbi.service';
import {​​​​​​​​ FlexLayoutModule }​​​​​​​​ from'@angular/flex-layout';
import { GridComponent } from './grid/grid.component';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';
import { EycChartsSharedLibraryModule } from 'eyc-charts-shared-library';
import { DateSubmittedPipePipe } from './pipes/submission/date-submitted-pipe.pipe';
import { ViewFilingEntityExceptionComponent } from './shared/view-filing-entity-exception/components/view-filing-entity-exception.component';
import { EntityExceptionDetailsComponent } from './shared/entity-exception-details/components/entity-exception-details.component';
import { IntakeLandingComponent } from './data-intake/intake-landing/components/intake-landing.component';
import { IntakeFileReviewComponent } from './data-intake/intake-file-review/intake-file-review.component';
import { IntakeExceptionsComponent } from './data-intake/intake-exceptions/intake-exceptions.component';
import { IntakeExceptionsReportsComponent } from './data-intake/intake-exceptions-reports/intake-exceptions-reports.component';
import { IntakeDonutGridListComponent } from './data-intake/intake-donut-grid-list/intake-donut-grid-list.component';



 




@NgModule({
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    MotifTooltipModule,
    MotifCardModule,
    MotifButtonModule,
    MotifFormsModule,
    MotifIconModule,
    MotifProrgressIndicatorsModule,
    MotifTableModule,
    MotifTabBarModule,
    InlineSVGModule.forRoot(),
    HttpClientModule,
    MotifPaginationModule,
    MotifBreadcrumbModule,
    RouterModule,
    FormsModule,
    MotifChipModule,
    MotifModalModule,
    MotifToastModule,
    MotifDropdownModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    EycUiSharedComponentModule,
    EycChartsSharedLibraryModule
    
    
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
    DataExplorerForReportingAndClientComponent,
    RrVisualisationComponent,
    GridComponent,
    ViewExceptionReportsComponent,
    DateSubmittedPipePipe,
    ViewFilingEntityExceptionComponent,
    EntityExceptionDetailsComponent,
    IntakeLandingComponent,
    IntakeFileReviewComponent,
    IntakeExceptionsComponent,
    IntakeExceptionsReportsComponent,
    IntakeDonutGridListComponent
    
  ],
  /* providers: [EycRrApiService, EycPbiService], */
  exports: [RegulatoryReportingFilingComponent, GridComponent]
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
