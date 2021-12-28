import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartCommonModule } from '../common/chart-common.module';
import { BarComponent } from './bar/bar.component';
import { BarVerticalComponent } from './bar-vertical/bar-vertical.component';
import { BarVerticalStackedComponent } from './bar-vertical-stacked/bar-vertical-stacked.component';
import { SeriesVerticalComponent } from './series-vertical.component';
import { BarLabelComponent } from './bar-label.component';




@NgModule({
  declarations: [
    BarComponent,
    BarVerticalComponent,
    SeriesVerticalComponent,
    BarLabelComponent,
    BarVerticalStackedComponent
    
  ],
  imports: [
    CommonModule,
    ChartCommonModule
  ],
  exports: [
    BarComponent,
    BarVerticalComponent,
    SeriesVerticalComponent,
    BarLabelComponent,
    BarVerticalStackedComponent   
  ]
})
export class BarChartModule { }
