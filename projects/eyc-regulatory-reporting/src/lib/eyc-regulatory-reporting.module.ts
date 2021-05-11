import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegulatoryReportingFilingComponent } from './regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { FilingCardComponent } from './shared/filing-card/filing-card.component';
import { MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule } from '@ey-xd/ng-motif';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AgGridModule } from 'ag-grid-angular';
import { TableHeaderRendererComponent } from './shared/table-header-renderer/table-header-renderer.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import {EycRrSettingsService} from './services/eyc-rr-settings.service';



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
    SlickCarouselModule,
    InlineSVGModule.forRoot(),
    HttpClientModule
  ],
  declarations: [
    RegulatoryReportingFilingComponent,
    FilingCardComponent,
    TableHeaderRendererComponent
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
