import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule,} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MotifModule, MotifAvatarModule,MotifFormsModule } from '@ey-xd/ng-motif';
import { AdministrationModule } from './administration/administration.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import {NotificationModule} from './notification/notification.module';
import { MotifCardModule } from '@ey-xd/ng-motif';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { EycRegulatoryReportingModule } from 'projects/eyc-regulatory-reporting/src/lib/eyc-regulatory-reporting.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import {environment} from '../environments/eyc-regulatory-reporting/environment-rr-dev';
import {TokenInterceptor} from './interceptor/token-interceptor';
import { ErrorAlertComponent } from './dialogs/error-alert/error-alert.component';
import {ErrorInterceptorService} from './interceptor/error-interceptor.service';
import {MatDialogModule} from '@angular/material/dialog';


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
    MatProgressSpinnerModule,
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
    OAuthModule.forRoot(),
    MatDialogModule
   
  ],
  providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
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
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
