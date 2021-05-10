import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration/components/administration.component';
import { HomeComponent } from './home/components/home.component';
import { LoginComponent } from './login/components/login/login.component';
import { AdminRegulatoryReportingComponent } from './administration/admin-regulatory-reporting/components/admin-regulatory-reporting.component';
import {DashboardNotificationComponent} from './notification/dashboard-notification/dashboard-notification.component';
import {RegulatoryReportingFilingComponent} from '../../projects/eyc-regulatory-reporting/src/lib/regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { UserDetailsComponent } from './administration/user-details/components/user-details.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'administration', component: AdministrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'eyComply', component: LoginComponent},
  {path: 'admin-regulatory-reporting', component: AdminRegulatoryReportingComponent},
  {path: 'notification', component: DashboardNotificationComponent},
  {path: 'app-regulatory-filing', component: RegulatoryReportingFilingComponent},
  {path: 'user-details/:userId', component: UserDetailsComponent },
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
