import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxCardComponent } from './shared/tax-card/tax-card.component';
import { TableHeaderRendererComponent } from './shared/table-header-renderer/table-header-renderer.component';
import { MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule  } from '@ey-xd/ng-motif';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import {EycTaxSettingsService} from './services/eyc-tax-settings.service';
import {​​​​​​​​ FlexLayoutModule }​​​​​​​​ from'@angular/flex-layout';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';
import { TaxReportingComponent } from './tax-reporting/components/tax-reporting.component';
import { CycleDetailComponent } from './tax-reporting/cycle-details/cycle-details.component';
import { CommentsPagecomponent } from './tax-reporting/comments-page/comments-page.component';
import { TaxCommentModalComponent } from './shared/tax-comment-modal/tax-comment-modal.component';
import { TaskCommentComponent } from './tax-reporting/task-comment/task-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
    ReactiveFormsModule,
    FormsModule
    
    
  ],
  declarations: [
    TaxReportingComponent,
    CycleDetailComponent,
    TaxCardComponent,
    TableHeaderRendererComponent,
    CommentsPagecomponent,
    TaxCommentModalComponent,
    TaskCommentComponent
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
