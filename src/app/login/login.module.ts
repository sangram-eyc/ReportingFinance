import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { MotifButtonModule, MotifCardModule, MotifToastModule } from '@ey-xd/ng-motif';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MotifButtonModule,
    MotifCardModule,
    RouterModule,
    MotifToastModule
  ]
})
export class LoginModule { }
