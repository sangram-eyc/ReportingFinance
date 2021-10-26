import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MotifTooltipModule, MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule, MotifDropdownModule } from '@ey-xd/ng-motif';
import { EycDataManagementServicesComponent } from './eyc-data-managed-services.component';
import { DataIntakeComponent } from './data-intake/component/data-intake.component';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';
// import { EycChartsSharedLibraryModule } from 'eyc-charts-shared-library';
import { HttpClientModule } from '@angular/common/http';
import { DataManagedService} from './data-intake/services/data-managed.service';
import { DataManagedSettingsService} from './data-intake/services/data-managed-settings.service'
import { EycDataApiService} from './data-intake/services/eyc-data-api.service'
import { FormsModule } from '@angular/forms';
import { DonutChartModule } from 'eyc-charts-shared-library';
@NgModule({
  declarations: [
    EycDataManagementServicesComponent,
    DataIntakeComponent],
  imports: [
    BrowserModule,
    CommonModule,
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
    // EycChartsSharedLibraryModule,
    HttpClientModule,
    FormsModule,
    DonutChartModule
  ],
  providers: [
    DataManagedService,
    EycDataApiService,
    DataManagedSettingsService
  ],
  exports: [EycDataManagementServicesComponent]
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
