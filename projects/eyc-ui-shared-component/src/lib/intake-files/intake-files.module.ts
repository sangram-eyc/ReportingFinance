import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifModule, MotifButtonModule,  MotifIconModule, MotifAccordionModule } from '@ey-xd/ng-motif';
import { IntakeFilesComponent } from './components/intake-files.component';
import { GridModule } from '../grid/grid.module';



@NgModule({
  declarations: [IntakeFilesComponent],
  imports: [
    CommonModule,
    MotifAccordionModule,
    MotifModule,
    MotifButtonModule,
    MotifIconModule,
    GridModule
  ],
  exports: [IntakeFilesComponent]
})
export class IntakeFilesModule { }
