import { DonutLegend } from '../data-intake/models/donut-legend.model'

export const NO_FILE_MISSING_PAST_DUE = "No files missing at the moment";
export const NO_HIGH_PRIORITY_ISSUES = "No files with high priority issues at the moment";
export const NO_MEDUIM_LOW_PRIORITY = "No files with medium / low priority issues at the moment";

export const DATA_FREQUENCY = {
    ALL: 'All',
    DAILY: 'Daily',
    MONTHLY: 'Monthly'
}

export const DATA_INTAKE_TYPE = {
    DATA_PROVIDER: 'dataProvider',
    DATA_DOMAIN: 'dataDomain'
}

export const FILTER_TYPE = {
    NO_ISSUES: 'noIssues',
    HIGH: 'high',
    LOW: 'low',
    MEDIUM: 'medium',
    MISSING_FILES: 'missingFiles',
    FILE_NOT_RECIEVED: 'fileNotReceived',
    MEDIUM_LOW: 'mediumLow'
}

export abstract class FileFilterStatus {
    public static noIssue: DonutLegend = { apiKey: "noIssues", legendTitle: "No issues" };
    public static mediumLowPriority: DonutLegend = { apiKey: "mediumLow", legendTitle: "Medium / low priority issues" };
    public static mediumPriority: DonutLegend = { apiKey: "medium", legendTitle: "Medium priority issues" };
    public static lowPriority: DonutLegend = { apiKey: "low", legendTitle: "Low priority issues" };
    public static highPriorityIssues: DonutLegend = { apiKey: "high", legendTitle: "High priority issues" };
    public static missingFilesPastDue: DonutLegend = { apiKey: "missingFiles", legendTitle: "Missing files, past due" };
    public static filesNotReceived: DonutLegend = { apiKey: "fileNotReceived", legendTitle: "Files not received" };
}

export const FILTER_TYPE_TITLE = {
    [`${FILTER_TYPE.NO_ISSUES}`]: FileFilterStatus.noIssue.legendTitle,
    [`${FILTER_TYPE.MEDIUM_LOW}`]: FileFilterStatus.mediumLowPriority.legendTitle,
    [`${FILTER_TYPE.MEDIUM}`]: FileFilterStatus.mediumPriority.legendTitle,
    [`${FILTER_TYPE.LOW}`]: FileFilterStatus.lowPriority.legendTitle,
    [`${FILTER_TYPE.HIGH}`]: FileFilterStatus.highPriorityIssues.legendTitle,
    [`${FILTER_TYPE.MISSING_FILES}`]: FileFilterStatus.missingFilesPastDue.legendTitle,
    [`${FILTER_TYPE.FILE_NOT_RECIEVED}`]: FileFilterStatus.filesNotReceived.legendTitle
}
