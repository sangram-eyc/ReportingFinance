import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration/components/administration.component';
import { HomeComponent } from './home/components/home.component';
import { LoginComponent } from './login/components/login/login.component';
import { AdminRegulatoryReportingComponent } from './administration/admin-regulatory-reporting/components/admin-regulatory-reporting.component';
import {DashboardNotificationComponent} from './notification/dashboard-notification/dashboard-notification.component';
import {RegulatoryReportingFilingComponent} from '../../projects/eyc-regulatory-reporting/src/lib/regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import {TaxReportingComponent} from '../../projects/eyc-tax-reporting/src/lib/tax-reporting/components/tax-reporting.component';
import { CycleDetailComponent } from '../../projects/eyc-tax-reporting/src/lib/tax-reporting/cycle-details/cycle-details.component';
import { CommentsPagecomponent } from '../../projects/eyc-tax-reporting/src/lib/tax-reporting/comments-page/comments-page.component'; 
import { DataIntakeLandingComponent } from '../../projects/eyc-data-intake/src/lib/data-intake-landing/components/data-intake-landing.component'
import { UserDetailsComponent } from './administration/user-details/components/user-details.component';
import { FundScopingComponent } from 'projects/eyc-regulatory-reporting/src/lib/fund-scoping/components/fund-scoping.component';
import { DataIntakeComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/components/data-intake.component';
import { ClientReviewComponent } from 'projects/eyc-regulatory-reporting/src/lib/client-review/components/client-review.component';
import { RrReportingComponent } from 'projects/eyc-regulatory-reporting/src/lib/rr-reporting/components/rr-reporting.component';
import { SubmissionComponent } from 'projects/eyc-regulatory-reporting/src/lib/submission/components/submission.component';
import { DataExplorerForReportingAndClientComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-explorer-for-reporting-and-client/components/data-explorer-for-reporting-and-client/data-explorer-for-reporting-and-client.component';
import {EycTeamDetailsComponent} from '../app/administration/admin-regulatory-reporting/eyc-team-details/eyc-team-details.component'
import { ProcessingExceptionComponent } from 'projects/eyc-data-intake/src/lib/processing-exception/components/processing-exception.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ViewExceptionReportsComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/view-exception-reports/components/view-exception-reports.component';
const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate : [AuthGuardService]},
  {path: 'administration', component: AdministrationComponent, canActivate : [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: 'eyComply', component: LoginComponent},
  {path: 'admin-rr-dashboard', component: AdminRegulatoryReportingComponent, canActivate : [AuthGuardService]},
  {path: 'notification', component: DashboardNotificationComponent, canActivate : [AuthGuardService]},
  {path: 'app-regulatory-filing', component: RegulatoryReportingFilingComponent, canActivate : [AuthGuardService]},
  {path: 'app-tax-reporting', component:TaxReportingComponent, canActivate : [AuthGuardService]},
  {path: 'cycle-details/:id/:name',component:CycleDetailComponent , canActivate : [AuthGuardService]},
  {path: 'comment-page/:id/:name/:prodCycleName',component:CommentsPagecomponent , canActivate : [AuthGuardService]},
  {path: 'data-intake-landing', component: DataIntakeLandingComponent, canActivate : [AuthGuardService]},
  {path: 'fund-scoping', component: FundScopingComponent, canActivate : [AuthGuardService]},
  {path: 'data-intake', component: DataIntakeComponent, canActivate : [AuthGuardService]},
  {path: 'client-review', component: ClientReviewComponent, canActivate : [AuthGuardService]},
  {path: 'regulatory-reporting', component: RrReportingComponent, canActivate : [AuthGuardService]},
  {path: 'submission', component: SubmissionComponent, canActivate : [AuthGuardService]},
  {path: 'user-details/:userId', component: UserDetailsComponent , canActivate : [AuthGuardService]},
  {path: 'team-details/:teamId', component: EycTeamDetailsComponent, canActivate : [AuthGuardService]},
  {path: 'data-explorer', component: DataExplorerForReportingAndClientComponent, canActivate : [AuthGuardService]},
  {path: 'processing-exceptions', component: ProcessingExceptionComponent, canActivate : [AuthGuardService]},
  {path: 'view-exception-reports', component: ViewExceptionReportsComponent, canActivate : [AuthGuardService]},
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports:[RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }