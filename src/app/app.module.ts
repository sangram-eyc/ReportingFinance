import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule,} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MotifModule, MotifAvatarModule,MotifFormsModule,MotifProgressBarModule } from '@ey-xd/ng-motif';
import { AdministrationModule } from './administration/administration.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import {NotificationModule} from './notification/notification.module';
import { MotifCardModule } from '@ey-xd/ng-motif';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { EycRegulatoryReportingModule } from 'projects/eyc-regulatory-reporting/src/lib/eyc-regulatory-reporting.module';
import {EycTaxReportingModule} from 'projects/eyc-tax-reporting/src/lib/eyc-tax-reporting.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import {environment} from '../environments/eyc-regulatory-reporting/environment-rr-dev';
import {TokenInterceptor} from './interceptor/token-interceptor';
import { ErrorAlertComponent } from './dialogs/error-alert/error-alert.component';
import {ErrorInterceptorService} from './interceptor/error-interceptor.service';
import {MatDialogModule} from '@angular/material/dialog';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptor/loader.interceptor';
import {CancelHttpCallsInterceptor} from './interceptor/cancel-http-calls.interceptor';
import { APP_INITIALIZER } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { EycUiSharedComponentModule } from 'projects/eyc-ui-shared-component/src/lib/eyc-ui-shared-component.module';
import { EycDataIntakeModule } from 'projects/eyc-data-intake/src/lib/eyc-data-intake.module';
import {taxenvironment} from '../environments/eyc-tax-reporting/tax-environment';
 import {EycDataManagementServicesModule} from 'projects/eyc-data-managed-services/src/lib/eyc-data-managed-services.module';
import { datamanagedenvironment } from '@env/eyc-data-managed-services/data-managed-environment';

@NgModule({
  declarations: [
    AppComponent,
    ErrorAlertComponent,
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MotifProgressBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MotifModule,
    MotifFormsModule,
    MotifAvatarModule,
    AdministrationModule,
    HomeModule,
    LoginModule,
    MotifCardModule,
    NotificationModule,
    EycRegulatoryReportingModule,
    EycTaxReportingModule,
    OAuthModule.forRoot(),
    MatDialogModule,
    EycUiSharedComponentModule,
    EycDataIntakeModule,
    EycDataManagementServicesModule
   
  ],
  
  providers: [
    LoaderService,
  { provide:"apiEndpoint",  useValue: environment.apiEndpoint},
  { provide:"rrproduction",  useValue: environment.production},
  { provide:"mockDataEnable",  useValue: environment.mockDataEnable},
  { provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
  { provide:"taxProduction",  useValue: taxenvironment.production},
  { provide:"dataManagedProduction",  useValue: datamanagedenvironment.production},
  { provide:"dataManagedEndPoint",  useValue: datamanagedenvironment.apiEndpoint},
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CancelHttpCallsInterceptor,
    multi: true
  },
  {
    provide: APP_INITIALIZER,
    useFactory: resourceProviderFactory,
    deps: [SettingsService],
    multi: true
    },
   
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }

export function resourceProviderFactory(provider: SettingsService) {
  return () => provider.loadAuthDetails();
}