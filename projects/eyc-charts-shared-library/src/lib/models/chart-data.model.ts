export type StringOrNumberOrDate = string | number | Date;
export interface DataItem {
  name: StringOrNumberOrDate;
  value: number;
  extra?: any;
  min?: number;
  max?: number;
  label?: string;
}

export interface Series {
  name: StringOrNumberOrDate;
  series: DataItem[];
}

export interface AreaChartSeries {
  name: StringOrNumberOrDate;
  series: AreaChartDataItem[];
}
export interface AreaChartDataItem extends DataItem {
  d0: number;
  d1: number;
}

// Pie Chart
export interface PieChartDataItem {
  name: StringOrNumberOrDate;
  value: number;
  extra?: any;
  min?: number;
  max?: number;
  label?: string;
}
export interface PieChartDataItems extends PieChartDataItem {
  percent: number;
  total: number;
  value: number;
}

export interface PieChartSingleSeries extends Array<PieChartDataItem> { }