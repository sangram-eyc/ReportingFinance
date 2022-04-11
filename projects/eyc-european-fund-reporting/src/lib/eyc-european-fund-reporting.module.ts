import { ModuleWithProviders, NgModule } from '@angular/core';
import { EuropeanFundReportingComponent } from './european-fund-reporting/components/european-fund-reporting.component';
import { EuropeanFundReportingSettingsService } from './services/european-fund-reporting-settings.service';



@NgModule({
  declarations: [EuropeanFundReportingComponent],
  imports: [
  ],
  exports: [EuropeanFundReportingComponent]
})
export class EycEuropeanFundReportingModule {
  
  public static forRoot(environment: any): ModuleWithProviders {

    return {
      ngModule: EycEuropeanFundReportingModule,
      providers: [
        EuropeanFundReportingSettingsService,
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment
        }
      ]
    };
  }
 }
