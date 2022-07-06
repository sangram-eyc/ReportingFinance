import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifPaginationModule, MotifFormsModule, MotifModule, MotifButtonModule, MotifToastModule, MotifModalModule, MotifTableModule, MotifCardModule, MotifIconModule } from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from './components/grid.component';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey("CompanyName=SHI International Corp._on_behalf_of_Ernst & Young U.S. LLP,LicensedApplication=EY Comply,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=11,LicensedProductionInstancesCount=1,AssetReference=AG-027377,ExpiryDate=23_May_2023_[v2]_MTY4NDc5NjQwMDAwMA==9014b013fefbb0b8e447956ac4272e81");
import 'ag-grid-enterprise';
import { CellRendererTemplateComponent } from './cell-renderer-template/cell-renderer-template.component';



@NgModule({
  declarations: [GridComponent, AgGridComponent, CellRendererTemplateComponent],
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
