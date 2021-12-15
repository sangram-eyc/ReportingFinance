export interface DonutLegend {
    apiKey: string,   // API Response key 
    legendTitle: string  // Legend title on donut chart
}
export class GlobalConstants {
    // File Status ( Total 5)
    public static noIssue: DonutLegend = { apiKey: "noIssues", legendTitle: "No issues" };
    public static mediumLowPriority: DonutLegend = { apiKey: "Medium/Low priority issues", legendTitle: "Medium / low priority issues" };
    public static highPriorityIssues: DonutLegend = { apiKey: "high", legendTitle: "High priority issues" };
    public static missingFilesPastDue: DonutLegend = { apiKey: "missingFiles", legendTitle: "Missing files, past due" };
    public static filesNotReceived: DonutLegend = { apiKey: "fileNotRecieved", legendTitle: "Files not received" };
}
