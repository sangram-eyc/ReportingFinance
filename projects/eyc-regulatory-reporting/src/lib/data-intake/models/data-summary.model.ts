export type StringOrNull = string | null;

export interface DataSummary {
  startDate: StringOrNull;
  endDate: StringOrNull;
  periodType: StringOrNull;
  dueDate: StringOrNull;
  regulationFormReportingPeriodDate: StringOrNull,
  displayName: StringOrNull,
  dataFrequency: string;
  dataIntakeType: string;
  filterTypes: string[];
}
