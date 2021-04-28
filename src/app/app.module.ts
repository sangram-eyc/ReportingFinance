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



@NgModule({
  declarations: [
    AppComponent,
   
  ],
  imports: [
    BrowserModule,
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
    NotificationModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
