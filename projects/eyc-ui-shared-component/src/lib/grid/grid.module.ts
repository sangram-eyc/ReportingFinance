import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifPaginationModule , MotifFormsModule, MotifModule, MotifButtonModule, MotifToastModule, MotifModalModule, MotifTableModule, MotifCardModule, MotifIconModule } from '@ey-xd/ng-motif';
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
    MotifFormsModule,
    MotifCardModule,
    MotifIconModule,
    FormsModule,
    MotifPaginationModule 
  ],
  exports: [GridComponent]
})
export class GridModule { }
