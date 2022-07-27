import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifPaginationModule, MotifFormsModule, MotifModule, MotifButtonModule, MotifToastModule, MotifModalModule, MotifTableModule, MotifCardModule, MotifIconModule } from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from './components/grid.component';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
// import { LicenseManager } from "ag-grid-enterprise";
// import {AG_License_KEY} from "./../../assets/configDetails";
// LicenseManager.setLicenseKey(AG_License_KEY);
import 'ag-grid-enterprise';
import { CellRendererTemplateComponent } from './cell-renderer-template/cell-renderer-template.component';
import { StatusBarComponent } from './status-bar/status-bar.component';



@NgModule({
  declarations: [GridComponent, AgGridComponent, CellRendererTemplateComponent, StatusBarComponent],
  imports: [
    AgGridModule.withComponents([CellRendererTemplateComponent]),
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
  entryComponents: [CellRendererTemplateComponent],
  exports: [GridComponent, AgGridComponent, CellRendererTemplateComponent]
})
export class GridModule { }
