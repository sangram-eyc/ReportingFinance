export type StringOrNumberOrDate = string | number | Date;
export interface DataItem {
    name: StringOrNumberOrDate;
    value: number;
    extra?: any;
    min?: number;
    max?: number;
    label?: string;
  }

  export interface AreaChartSeries {
    name: StringOrNumberOrDate;
    series: AreaChartDataItem[];
  }
  export interface AreaChartDataItem extends DataItem {
    d0: number;
    d1: number;
  }