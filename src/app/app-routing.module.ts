import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration/components/administration.component';
import { HomeComponent } from './home/components/home.component';
import { LoginComponent } from './login/components/login/login.component';
import { AdminRegulatoryReportingComponent } from './administration/admin-regulatory-reporting/components/admin-regulatory-reporting.component';
import {DashboardNotificationComponent} from './notification/dashboard-notification/dashboard-notification.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'administration', component: AdministrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'admin-regulatory-reporting', component: AdminRegulatoryReportingComponent},
  {path: 'notification', component: DashboardNotificationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
