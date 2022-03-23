import { NgModule} from '@angular/core'
import { CommonModule } from '@angular/common';
import { EycExpenseReportingComponent } from './eyc-expense-reporting.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { ExpenseTasksComponent } from './expense-tasks/expense-tasks.component';
import { ExpenseTaskAssignmentComponent } from './expense-task-assignment/expense-task-assignment.component';
import { ExpenseTaskVisibilityComponent } from './expense-task-visibility/expense-task-visibility.component';
import { ExpenseMilestoneCalendarComponent } from './expense-milestone-calendar/expense-milestone-calendar.component';
import { MotifModule,MotifDropdownModule,MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule, MotifAvatarModule } from '@ey-xd/ng-motif';

@NgModule({
  declarations: [
    EycExpenseReportingComponent,
    ExpenseReportComponent,
    ExpenseTasksComponent,
    ExpenseTaskAssignmentComponent,
    ExpenseTaskVisibilityComponent,
    ExpenseMilestoneCalendarComponent
  ],
  imports: [
    CommonModule,
    MotifTooltipModule,
    MotifCardModule,
    MotifButtonModule,
    MotifFormsModule,
    MotifIconModule,
    MotifProrgressIndicatorsModule,
    MotifTableModule,
    MotifTabBarModule,
    MotifPaginationModule,
    MotifBreadcrumbModule,
    MotifChipModule,
    MotifModalModule,
    MotifToastModule,
    MotifDropdownModule,
    MotifModule,
  ],
  exports: [EycExpenseReportingComponent]
})
export class EycExpenseReportingModule { 
}
