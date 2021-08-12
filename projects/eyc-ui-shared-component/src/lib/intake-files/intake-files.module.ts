import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifModule, MotifButtonModule,  MotifIconModule, MotifAccordionModule } from '@ey-xd/ng-motif';
import { IntakeFilesComponent } from './components/intake-files.component';



@NgModule({
  declarations: [IntakeFilesComponent],
  imports: [
    CommonModule,
    MotifAccordionModule,
    MotifModule,
    MotifButtonModule,
    MotifIconModule
  ],
  exports: [IntakeFilesComponent]
})
export class IntakeFilesModule { }
