import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartCommonModule } from '../common/chart-common.module';
import { BarComponent } from './bar/bar.component';
import { BarVerticalComponent } from './bar-vertical/bar-vertical.component';
import { SeriesVerticalComponent } from './series-vertical.component';
import { BarLabelComponent } from './bar-label.component';




@NgModule({
  declarations: [
    BarComponent,
    BarVerticalComponent,
    SeriesVerticalComponent,
    BarLabelComponent
    
  ],
  imports: [
    CommonModule,
    ChartCommonModule
  ],
  exports: [
    BarComponent,
    BarVerticalComponent,
    SeriesVerticalComponent,
    BarLabelComponent   
  ]
})
export class BarChartModule { }
