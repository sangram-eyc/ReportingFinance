import { NgModule } from '@angular/core';
import { DataIntakeLandingComponent } from './data-intake-landing/components/data-intake-landing.component';
import { ProcessingExceptionComponent } from './processing-exception/components/processing-exception.component';
import { CommonModule } from '@angular/common';
import { MotifAccordionModule, MotifModule, MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule,MotifDropdownModule  } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import {​​​​​​​​ FlexLayoutModule }​​​​​​​​ from'@angular/flex-layout';
import { ExceptionReportComponent } from './processing-exception/exception-report/components/exception-report.component';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';



@NgModule({
  declarations: [
    DataIntakeLandingComponent,
    ProcessingExceptionComponent, 
    ExceptionReportComponent
  ],
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
    MotifModule,
    MotifAccordionModule,
    EycUiSharedComponentModule
  ],
  exports: []
})
export class EycDataIntakeModule { }
