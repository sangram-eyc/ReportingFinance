import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifFormsModule, MotifModule, MotifButtonModule, MotifToastModule, MotifModalModule, MotifTableModule } from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from './components/grid.component';
import { AgGridModule } from 'ag-grid-angular';




@NgModule({
  declarations: [GridComponent],
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    MotifButtonModule,
    MotifToastModule,
    MotifModalModule,
    MotifTableModule,
    MotifFormsModule
  ],
  exports: [GridComponent]
})
export class GridModule { }
