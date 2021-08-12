import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilingCardComponent } from './shared/filing-card/filing-card.component';
import { MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule,MotifDropdownModule  } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { TableHeaderRendererComponent } from './shared/table-header-renderer/table-header-renderer.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import {EycRrSettingsService} from './services/eyc-tax-settings.service';
import { DotsCardComponent } from './shared/dots-card/dots-card.component';
import { ReportingTabsCardComponent } from './shared/reporting-tabs-card/components/reporting-tabs-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {EycRrApiService} from './services/eyc-tax-api.service';
import { RrVisualisationComponent } from './shared/rr-visualisation/rr-visualisation.component';
import {EycPbiService} from './services/eyc-pbi.service';
import {​​​​​​​​ FlexLayoutModule }​​​​​​​​ from'@angular/flex-layout';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';
import { TaxReportingComponent } from './tax-reporting/components/tax-reporting.component';





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
    FormsModule,
    MotifChipModule,
    MotifModalModule,
    MotifToastModule,
    MotifDropdownModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    EycUiSharedComponentModule
    
    
  ],
  declarations: [
    TaxReportingComponent,
    FilingCardComponent,
    TableHeaderRendererComponent,
    DotsCardComponent,
    ReportingTabsCardComponent,
    RrVisualisationComponent
  ],
  exports: [TaxReportingComponent]
})
export class EycTaxReportingModule {

  public static forRoot(environment: any): ModuleWithProviders {

    return {
      ngModule: EycTaxReportingModule,
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
