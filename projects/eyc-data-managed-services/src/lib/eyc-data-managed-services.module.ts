import { NgModule } from '@angular/core';
import { MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule,MotifDropdownModule  } from '@ey-xd/ng-motif';
import { EycDataManagementServicesComponent } from './eyc-data-managed-services.component';



@NgModule({
  declarations: [EycDataManagementServicesComponent],
  imports: [
    MotifTooltipModule ,MotifCardModule, MotifButtonModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifFormsModule, MotifTabBarModule, MotifPaginationModule, MotifBreadcrumbModule, MotifChipModule, MotifModalModule, MotifToastModule,MotifDropdownModule
  ],
  exports: [EycDataManagementServicesComponent]
})
export class EycDataManagementServicesModule { }
