export type StringOrNull = string | null;

export interface DataSummary {
  startDate: StringOrNull;
  EndDate: StringOrNull;
  periodType: StringOrNull;
  dueDate: StringOrNull;
  dataFrequency: string;
  dataIntakeType: string;
  filterTypes: string[];
}

export interface ApiSeriesItemDTO { lable: string, value: number };

export interface CarChartSeriesItemDTO { name: string, value: number };
