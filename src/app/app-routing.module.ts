import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration/components/administration.component';
import { HomeComponent } from './home/components/home.component';
import { LoginComponent } from './login/components/login/login.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'administration', component: AdministrationComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
