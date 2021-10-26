import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { BarChartModule } from './bar-chart/bar-chart.module';
import { ChartCommonModule } from './common/chart-common.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BarChartModule,
    ChartCommonModule
  ],
  exports: [
    BarChartModule,
    ChartCommonModule
  ]
})
export class EycChartsSharedLibraryModule { }
