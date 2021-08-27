import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home.component';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component'


@NgModule({
  imports: [
    CommonModule,
    EycUiSharedComponentModule
  ],
  declarations: [
    HomeComponent
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class HomeModule { }