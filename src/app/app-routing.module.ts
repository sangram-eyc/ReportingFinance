import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AdministrationComponent } from './administration/components/administration.component';
import { HomeComponent } from './home/components/home.component';
import { LoginComponent } from './login/components/login/login.component';
// import { AdminRegulatoryReportingComponent } from './administration/admin-regulatory-reporting/components/admin-regulatory-reporting.component';
import {DashboardNotificationComponent} from './notification/dashboard-notification/dashboard-notification.component';
import {RegulatoryReportingFilingComponent} from '../../projects/eyc-regulatory-reporting/src/lib/regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import {TaxReportingComponent} from '../../projects/eyc-tax-reporting/src/lib/tax-reporting/components/tax-reporting.component';
import { CycleDetailComponent } from '../../projects/eyc-tax-reporting/src/lib/tax-reporting/cycle-details/cycle-details.component';
import { CommentsPagecomponent } from '../../projects/eyc-tax-reporting/src/lib/tax-reporting/comments-page/comments-page.component';
import { DataIntakeLandingComponent } from '../../projects/eyc-data-intake/src/lib/data-intake-landing/components/data-intake-landing.component';
import { FundScopingComponent } from 'projects/eyc-regulatory-reporting/src/lib/fund-scoping/components/fund-scoping.component';
import { DataIntakeComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/components/data-intake.component';
import { ClientReviewComponent } from 'projects/eyc-regulatory-reporting/src/lib/client-review/components/client-review.component';
import { RrReportingComponent } from 'projects/eyc-regulatory-reporting/src/lib/rr-reporting/components/rr-reporting.component';
import { SubmissionComponent } from 'projects/eyc-regulatory-reporting/src/lib/submission/components/submission.component';
import { DataExplorerForReportingAndClientComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-explorer-for-reporting-and-client/components/data-explorer-for-reporting-and-client/data-explorer-for-reporting-and-client.component';
import { ProcessingExceptionComponent } from 'projects/eyc-data-intake/src/lib/processing-exception/components/processing-exception.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ViewExceptionReportsComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/view-exception-reports/components/view-exception-reports.component';
import {EycDataManagementServicesComponent} from 'projects/eyc-data-managed-services/src/lib/eyc-data-managed-services.component';
import { CommentsDetailsComponent } from '../../projects/eyc-tax-reporting/src/lib/tax-reporting/comments-details/comments-details.component';
import { ExceptionsReportsComponent } from 'projects/eyc-data-managed-services/src/lib/data-intake/component/exceptions-reports/exceptions-reports.component';
import {FileReviewComponent} from 'projects/eyc-data-managed-services/src/lib/data-intake/component/file-review/file-review.component';
import { DonutGridListComponent } from 'projects/eyc-data-managed-services/src/lib/data-intake/component/donut-grid-list/donut-grid-list.component';
import {
  ArchivedNotificationsComponent
} from '@default/notifications/archived-notifications/archived-notifications.component';
import { ExceptionsComponent } from 'projects/eyc-data-managed-services/src/lib/data-intake/component/exceptions/exceptions.component';
import { ViewFilingEntityExceptionComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/view-filing-entity-exception/components/view-filing-entity-exception.component';
import { EntityExceptionDetailsComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/entity-exception-details/components/entity-exception-details.component';

import {
  NotificationsPreferencesComponent
} from '@default/notifications/notifications-preferences/notifications-preferences.component';

import { ExpenseReportComponent } from 'projects/eyc-expense-reporting/src/lib/expense-report/expense-report.component';
import { ExpenseTaskAssignmentComponent } from 'projects/eyc-expense-reporting/src/lib/expense-task-assignment/expense-task-assignment.component';
import { ExpenseTaskVisibilityComponent } from 'projects/eyc-expense-reporting/src/lib/expense-task-visibility/expense-task-visibility.component';
import { ExpenseMilestoneCalendarComponent } from 'projects/eyc-expense-reporting/src/lib/expense-milestone-calendar/expense-milestone-calendar.component';
import { EycExpenseReportingComponent } from 'projects/eyc-expense-reporting/src/lib/eyc-expense-reporting.component';
import { AdministrationComponent } from 'projects/eyc-admin/src/lib/administration/components/administration.component';
import { AdminRegulatoryReportingComponent } from 'projects/eyc-admin/src/lib/admin-regulatory-reporting/components/admin-regulatory-reporting.component';
import { EycTeamDetailsComponent } from 'projects/eyc-admin/src/lib/admin-regulatory-reporting/eyc-team-details/eyc-team-details.component';
import { UserDetailsComponent } from 'projects/eyc-admin/src/lib/user-details/components/user-details.component';
import { UpdateFilingPropertiesComponent } from 'projects/eyc-admin/src/lib/static-data/update-filing-properties/components/update-filing-properties.component';
import { EuropeanFundReportingComponent } from '../../projects/eyc-european-fund-reporting/src/lib/european-fund-reporting/components/european-fund-reporting.component'

import { IntakeFileReviewComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/intake-file-review/intake-file-review.component';
import { IntakeExceptionsComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/intake-exceptions/intake-exceptions.component';
import { IntakeExceptionsReportsComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/intake-exceptions-reports/intake-exceptions-reports.component';
import { IntakeDonutGridListComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/intake-donut-grid-list/intake-donut-grid-list.component';
import { IntakeBusinessDayComponent } from 'projects/eyc-regulatory-reporting/src/lib/data-intake/intake-business-day/intake-business-day.component';




const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate : [AuthGuardService]},
  {path: 'eyc-admin', component: AdministrationComponent, canActivate : [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: 'eyComply', component: LoginComponent},
  {path: 'admin-dashboard', component: AdminRegulatoryReportingComponent, canActivate : [AuthGuardService]},
  {path: 'notification', component: DashboardNotificationComponent, canActivate : [AuthGuardService]},
  {path: 'app-regulatory-filing', component: RegulatoryReportingFilingComponent, canActivate : [AuthGuardService]},
  {path: 'app-tax-reporting/:isArchived', component:TaxReportingComponent, canActivate : [AuthGuardService]},
  {path: 'app-tax-reporting', component:TaxReportingComponent, canActivate : [AuthGuardService]},
  {path: 'app-expense-reporting', component:EycExpenseReportingComponent, canActivate : [AuthGuardService]},
  {path: 'expense-reports', component:ExpenseReportComponent, canActivate : [AuthGuardService]},
  {path: 'expense-tasks', component:ExpenseTaskAssignmentComponent, canActivate : [AuthGuardService]},
  {path: 'expense-task-assignment', component:TaxReportingComponent, canActivate : [AuthGuardService]},
  {path: 'expense-task-visibility', component:ExpenseTaskVisibilityComponent, canActivate : [AuthGuardService]},
  {path: 'expense-milestone-calendar', component:ExpenseMilestoneCalendarComponent, canActivate : [AuthGuardService]},
  {path: 'cycle-details/:id/:name',component:CycleDetailComponent , canActivate : [AuthGuardService]},
  {path: 'comment-page/:id/:name/:prodCycleName/:status/:openCommentsEY/:openCommentsClient/:type/:cycleId/:isArchived',component:CommentsPagecomponent , canActivate : [AuthGuardService]},
  {path: 'comments-details/:cycleId/:cycleName/:isArchived',component:CommentsDetailsComponent , canActivate : [AuthGuardService]},
  {path: 'data-intake-landing', component: DataIntakeLandingComponent, canActivate : [AuthGuardService]},
  {path: 'fund-scoping', component: FundScopingComponent, canActivate : [AuthGuardService]},
  {path: 'data-intake', component: DataIntakeComponent, canActivate : [AuthGuardService]},
  {path: 'client-review', component: ClientReviewComponent, canActivate : [AuthGuardService]},
  {path: 'regulatory-reporting', component: RrReportingComponent, canActivate : [AuthGuardService]},
  {path: 'submission', component: SubmissionComponent, canActivate: [AuthGuardService]},
  {path: 'user-details/:userId', component: UserDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'team-details/:teamId', component: EycTeamDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'update-filing', component: UpdateFilingPropertiesComponent, canActivate: [AuthGuardService]},
  {path: 'data-explorer', component: DataExplorerForReportingAndClientComponent, canActivate: [AuthGuardService]},
  {path: 'processing-exceptions', component: ProcessingExceptionComponent, canActivate: [AuthGuardService]},
  {path: 'view-exception-reports', component: ViewExceptionReportsComponent, canActivate: [AuthGuardService]},
  {
    path: 'view-filing-entity-exception',
    component: ViewFilingEntityExceptionComponent,
    canActivate: [AuthGuardService]
  },
  {path: 'data-intake/data-intake/:dataIntakeType', component: IntakeDonutGridListComponent, canActivate: [AuthGuardService] },
  {path: 'data-intake/files-review', component: IntakeFileReviewComponent,  canActivate: [AuthGuardService]},
  {path: 'data-intake/files-review/:paramDataIntakeType/:paramDataIntakeName', component: IntakeFileReviewComponent,  canActivate: [AuthGuardService]},
  {path: 'data-intake/files/exceptions/:paramFilename/:paramguidName/:paramfileNameAlias', component: IntakeExceptionsComponent,  canActivate: [AuthGuardService]},
  {path: 'data-intake/files/exception-details', component: IntakeExceptionsReportsComponent,  canActivate: [AuthGuardService]},
  {path: 'data-intake/business-day',component: IntakeBusinessDayComponent,  canActivate: [AuthGuardService]},
  {path: 'entity-exception-details', component: EntityExceptionDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'archived-notifications', component: ArchivedNotificationsComponent},
  {path: 'notifications-preferences', component: NotificationsPreferencesComponent, canActivate: [AuthGuardService]},
  {path: 'data-managed-services', component: EycDataManagementServicesComponent, canActivate: [AuthGuardService]},
  {path: 'data-managed-services/files-review', component: FileReviewComponent, canActivate: [AuthGuardService]},
  {
    path: 'data-managed-services/files-review/:paramDataIntakeType/:paramDataIntakeName',
    component: FileReviewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'data-managed-services/files/exceptions/:paramFilename/:paramguidName/:paramfileNameAlias',
    component: ExceptionsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'data-managed-services/files/exception-details',
    component: ExceptionsReportsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'data-managed-services/data-intake/:dataIntakeType',
    component: DonutGridListComponent,
    canActivate: [AuthGuardService]
  },
  {path: 'european-fund-reporting', component: EuropeanFundReportingComponent, canActivate: [AuthGuardService]},
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
