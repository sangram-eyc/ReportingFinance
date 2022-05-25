import {DataSummary} from "./data-summary.model"

export type StringOrNull = string | null;

export interface DataGrid extends DataSummary {
    summaryType:StringOrNull;
    reportType:StringOrNull;
    clientName:StringOrNull;
    queryPhrase:StringOrNull;
}

export interface ExceptionDataGrid{
    startDate:StringOrNull;
    endDate:StringOrNull;
    periodType:StringOrNull;
    dueDate:StringOrNull;
    dataFrequency:StringOrNull;
    auditFileGuidName:StringOrNull;
    fileId:StringOrNull;
    fileName:StringOrNull;
    clientName:StringOrNull;
}

export interface ExceptionDetailsDataGrid{
    tableName:StringOrNull;
    auditDate:StringOrNull;
    auditHashID:StringOrNull;
}

export interface GroupByDataProviderCardGrid extends DataSummary{
    auditFileGuidName:StringOrNull;
    clientName:StringOrNull;
    fileId:StringOrNull;
    fileName:StringOrNull;
    reportId:StringOrNull;
    reportName:StringOrNull;
    isViewClicked: Boolean;    
}
