import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRolesComponent } from './components/user-roles.component';
import { MotifAccordionModule, MotifButtonModule, MotifFormsModule, MotifToastModule } from '@ey-xd/ng-motif';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [UserRolesComponent],
  imports: [
    CommonModule,
    MotifAccordionModule,
    MotifFormsModule,
    FormsModule,
    MotifButtonModule,
    MotifToastModule
  ],
  exports: [UserRolesComponent]
})
export class UserRolesModule { }
