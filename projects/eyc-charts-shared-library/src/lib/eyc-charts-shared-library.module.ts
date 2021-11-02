import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { BarChartModule } from './bar-chart/bar-chart.module';
import { ChartCommonModule } from './common/chart-common.module';
import { DonutChartModule } from './donut-chart/donut-chart.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BarChartModule,
    ChartCommonModule,
    DonutChartModule
  ],
  exports: [
    BarChartModule,
    ChartCommonModule,
    DonutChartModule
  ]
})
export class EycChartsSharedLibraryModule { }
