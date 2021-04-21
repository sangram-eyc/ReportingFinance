import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule,} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MotifModule , MotifAvatarModule } from '@ey-xd/ng-motif';
import { HomeComponent } from './home/home.component';
import { AdministrationComponent } from './administration/administration.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdministrationComponent,
    
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
    MotifAvatarModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
