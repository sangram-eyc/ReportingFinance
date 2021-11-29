import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxCardComponent } from './shared/tax-card/tax-card.component';
import { DonutTaxChartComponent } from './shared/donut-tax-chart/donut-tax-chart.component';
import { TableHeaderRendererComponent } from './shared/table-header-renderer/table-header-renderer.component';
import { MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule, MotifAvatarModule  } from '@ey-xd/ng-motif';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import {EycTaxSettingsService} from './services/eyc-tax-settings.service';
import {FlexLayoutModule } from'@angular/flex-layout';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';
import { TaxReportingComponent } from './tax-reporting/components/tax-reporting.component';
import { CycleDetailComponent } from './tax-reporting/cycle-details/cycle-details.component';
import { CommentsPagecomponent } from './tax-reporting/comments-page/comments-page.component';
import { TaxCommentModalComponent } from './shared/tax-comment-modal/tax-comment-modal.component';
import { TaskCommentComponent } from './tax-reporting/task-comment/task-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { ReplyCommentComponent } from './tax-reporting/reply-comment/reply-comment.component';
import { AssignUsersModalComponent } from './tax-reporting/assign-users-modal/assign-users-modal.component';
import { EycChartsSharedLibraryModule } from 'eyc-charts-shared-library';
import { TaxHorizontalStackedBarChartComponent } from './shared/tax-horizontal-stacked-bar-chart/tax-horizontal-stacked-bar-chart.component';
import { InformationBarChartModalComponent } from './tax-reporting/information-bar-chart-modal/information-bar-chart-modal.component';
import { CommentsDetailsComponent } from './tax-reporting/comments-details/comments-details.component';
import { BulkDownloadModalComponent } from './tax-reporting/bulk-download-modal/bulk-download-modal.component';


@NgModule({
  imports: [
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
    MotifChipModule,
    MotifModalModule,
    MotifToastModule,
    FlexLayoutModule,
    EycUiSharedComponentModule,
    EycChartsSharedLibraryModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatButtonModule,
    MatRadioModule,
    MotifAvatarModule
  ],
  declarations: [
    TaxReportingComponent,
    CycleDetailComponent,
    TaxCardComponent,
    DonutTaxChartComponent,
    TableHeaderRendererComponent,
    CommentsPagecomponent,
    TaxCommentModalComponent,
    TaskCommentComponent,
    ReplyCommentComponent,
    AssignUsersModalComponent,
    TaxHorizontalStackedBarChartComponent,
    InformationBarChartModalComponent,
    CommentsDetailsComponent,
    BulkDownloadModalComponent
  ],
  exports: [TaxReportingComponent]
})
export class EycTaxReportingModule {

  public static forRoot(environment: any): ModuleWithProviders {

    return {
      ngModule: EycTaxReportingModule,
      providers: [
        EycTaxSettingsService,
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment
        }
      ]
    };
  }
 }
