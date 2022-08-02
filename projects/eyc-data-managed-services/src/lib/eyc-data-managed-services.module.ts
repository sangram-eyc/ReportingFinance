import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MotifTooltipModule, MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule, MotifDropdownModule, MotifAccordionModule, MotifModule, MotifProgressBarModule } from '@ey-xd/ng-motif';
import { EycDataManagementServicesComponent } from './eyc-data-managed-services.component';
import { DataIntakeComponent } from './data-intake/component/data-intake.component';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';
import { EycChartsSharedLibraryModule } from 'eyc-charts-shared-library';
import { HttpClientModule } from '@angular/common/http';
import { DataManagedService } from './data-intake/services/data-managed.service';
import { DataManagedSettingsService } from './data-intake/services/data-managed-settings.service';
import { EycDataApiService } from './data-intake/services/eyc-data-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExceptionsReportsComponent } from './data-intake/component/exceptions-reports/exceptions-reports.component';

import { FileReviewComponent } from './data-intake/component/file-review/file-review.component';
import { DonutGridListComponent } from './data-intake/component/donut-grid-list/donut-grid-list.component';
import { ExceptionsComponent } from './data-intake/component/exceptions/exceptions.component';
import { ApiCatalogComponent } from './data-intake/component/api-catalog/api-catalog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { SearchFilterPipe } from './pipes/search-filter.pipe';




@NgModule({
  declarations: [
    EycDataManagementServicesComponent,
    DataIntakeComponent,
    ExceptionsReportsComponent,
    FileReviewComponent,
    ExceptionsComponent,
    DonutGridListComponent,
    ApiCatalogComponent,
    SearchFilterPipe],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    MotifTooltipModule,
    MotifCardModule,
    MotifButtonModule,
    MotifIconModule,
    MotifProrgressIndicatorsModule,
    MotifTableModule,
    MotifFormsModule,
    MotifTabBarModule,
    MotifPaginationModule,
    MotifBreadcrumbModule,
    MotifChipModule,
    MotifModalModule,
    MotifToastModule,
    MotifDropdownModule,
    EycUiSharedComponentModule,
    EycChartsSharedLibraryModule,
    HttpClientModule,
    FormsModule,
    MotifTooltipModule,
    ReactiveFormsModule,
    MotifAccordionModule,
    MotifModule, 
    MotifProgressBarModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    PrettyJsonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ],
  providers: [
    DataManagedService,
    EycDataApiService,
    DataManagedSettingsService,
    MotifModalModule,
    SearchFilterPipe
  ],
  exports: [EycDataManagementServicesComponent, ExceptionsReportsComponent, FileReviewComponent, DonutGridListComponent, ApiCatalogComponent]
})
export class EycDataManagementServicesModule {
  public static forRoot(environment: any): ModuleWithProviders {
    return {
      ngModule: EycDataManagementServicesModule,
      providers: [
        DataManagedSettingsService,
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment
        }
      ]
    };
  }

}
