import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EycPowerbiEmbedComponent } from './eyc-powerbi-embed/eyc-powerbi-embed.component';
import { PowerBiPaginatedReportEmbedComponent } from './power-bi-paginated-report-embed/power-bi-paginated-report-embed.component';



@NgModule({
  declarations: [EycPowerbiEmbedComponent, PowerBiPaginatedReportEmbedComponent],
  imports: [
    CommonModule
  ],
  exports: [
    EycPowerbiEmbedComponent,
    PowerBiPaginatedReportEmbedComponent
  ]
})
export class EycPowerbiModule { }
