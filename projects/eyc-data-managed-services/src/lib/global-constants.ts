import { DonutLegend } from './data-intake/models/donut-legend.model'
export class FileFilterStatus {
    // File Status ( Total 5)
    public static noIssue: DonutLegend = { apiKey: "noIssues", legendTitle: "No issues" };
    public static mediumLowPriority: DonutLegend = { apiKey: "Medium/Low priority issues", legendTitle: "Medium / low priority issues" };
    public static highPriorityIssues: DonutLegend = { apiKey: "high", legendTitle: "High priority issues" };
    public static missingFilesPastDue: DonutLegend = { apiKey: "missingFiles", legendTitle: "Missing files, past due" };
    public static filesNotReceived: DonutLegend = { apiKey: "fileNotRecieved", legendTitle: "Files not received" };
}
export class DataFrequency {
    public static all: string = "All";
    public static daily: string = "Daily";
    public static monthly: string = "Monthly";
}

export class DataIntakeType {
    public static dataProvider: string = "dataProvider";
    public static dataDomain: string = "dataDomain";
}

export class FilterTypes {
    public static noIssues: string = "noIssues";
    public static high: string = "high";
    public static low: string = "low";
    public static medium: string = "medium";
    public static missingFiles: string = "missingFiles";
    public static fileNotRecieved: string = "fileNotRecieved";
}