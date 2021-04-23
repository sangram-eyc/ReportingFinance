import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifCardModule, MotifButtonModule, MotifFormsModule } from '@ey-xd/ng-motif';
import { AdministrationComponent } from './components/administration.component';


@NgModule({
  imports: [
    CommonModule,
    MotifCardModule,
    MotifButtonModule,
    MotifFormsModule
  ],
  declarations: [
    AdministrationComponent
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class AdministrationModule { }