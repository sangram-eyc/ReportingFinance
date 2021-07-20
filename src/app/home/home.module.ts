import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home.component';
import { EycUiSharedComponentModule } from 'projects/eyc-ui-shared-component/src/lib/eyc-ui-shared-component.module'


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