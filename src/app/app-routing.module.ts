import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration/components/administration.component';
import { HomeComponent } from './home/components/home.component';
import { LoginComponent } from './login/components/login/login.component';
import { AdminRegulatoryReportingComponent } from './administration/admin-regulatory-reporting/components/admin-regulatory-reporting.component';
import {DashboardNotificationComponent} from './notification/dashboard-notification/dashboard-notification.component';
import {RegulatoryReportingFilingComponent} from '../../projects/eyc-regulatory-reporting/src/lib/regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { UserDetailsComponent } from './administration/user-details/components/user-details.component';
import { FundScopingComponent } from 'projects/eyc-regulatory-reporting/src/lib/fund-scoping/components/fund-scoping.component';
import { DataIntakeComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/components/data-intake.component';
import { ClientReviewComponent } from 'projects/eyc-regulatory-reporting/src/lib/client-review/components/client-review.component';
import { RrReportingComponent } from 'projects/eyc-regulatory-reporting/src/lib/rr-reporting/components/rr-reporting.component';
import { SubmissionComponent } from 'projects/eyc-regulatory-reporting/src/lib/submission/components/submission.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'administration', component: AdministrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'eyComply', component: LoginComponent},
  {path: 'admin-regulatory-reporting', component: AdminRegulatoryReportingComponent},
  {path: 'notification', component: DashboardNotificationComponent},
  {path: 'app-regulatory-filing', component: RegulatoryReportingFilingComponent},
  {path: 'fund-scoping', component: FundScopingComponent},
  {path: 'data-intake', component: DataIntakeComponent},
  {path: 'client-review', component: ClientReviewComponent},
  {path: 'regulatory-reporting', component: RrReportingComponent},
  {path: 'submission', component: SubmissionComponent},
  {path: 'user-details/:userId', component: UserDetailsComponent },
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
