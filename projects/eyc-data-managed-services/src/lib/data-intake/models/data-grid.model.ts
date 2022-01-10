import {DataSummary} from "./data-summary.model"

export type StringOrNull = string | null;

export interface DataGrid extends DataSummary {
    summaryType:StringOrNull;
    reportType:StringOrNull;
    clientName:StringOrNull;
    queryPhrase:StringOrNull;
}
