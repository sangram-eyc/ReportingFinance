import { DonutLegend } from '../data-intake/models/donut-legend.model';

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

export const DATA_INTAKE_TYPE_DISPLAY_TEXT = {
    DATA_PROVIDER:{
        Singular:'Data Provider',
        Plural:'Data Providers'
    },
    DATA_DOMAIN:{
        Singular:'Data Domain',
        Plural:'Data Domains' 
    }
    
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

export const customComparator = (valueA, valueB) => {
    const statusCol = [FILTER_TYPE.MISSING_FILES, FILTER_TYPE.HIGH, FILTER_TYPE.MEDIUM, FILTER_TYPE.LOW,FILTER_TYPE.NO_ISSUES,FILTER_TYPE.FILE_NOT_RECIEVED];
	if (valueA == null) {
		return false;
	}
	else if (valueB == null) {
		return false;
	} else {
        if (valueA == valueB) return 0;
        return (statusCol.indexOf(valueA) > statusCol.indexOf(valueB)) ? 1 : -1;
	}
};

export const PowerBiReportDailyList=[
    {reportName:'DMS_TRP_General Ledger Trialbalance Class_Daily',
    reportId:'5e6bddb4-3b59-4bfd-8d10-4394a6111e21',reportDisplayName:'General Ledger Trial Balance Class'},
    {reportName:'DMS_TRP_Transaction Activity Details_Daily',
    reportId:'4b31f8f6-a414-49ae-9aa3-1d8b87900256',reportDisplayName:'Transaction Activity Details'},
    {reportName:'DMS_TRP_General Ledger Trialbalance_Daily',
    reportId:'d4863c1c-32b6-4408-9aa7-d2193193c051',reportDisplayName:'General Ledger Trial Balance'},
    {reportName:'DMS_TRP_Positions Portfolio Level_Daily',
    reportId:'7f573823-54bb-4dc1-b224-468ab8833166',reportDisplayName:'Positions Portfolio Level'},
    {reportName:'DMS_TRP_Transaction disposal lot_Daily',
    reportId:'c780ef40-5d4f-4ac0-911d-d86ba2026583',reportDisplayName:'Transaction Disposal Lot'},
    {reportName:'DMS_TRP_Positions Lot Level_Daily',
    reportId:'706df839-8446-4728-8405-9a6949cbcd30',reportDisplayName:'Positions Lot Level'},

    {reportName:'CDM Account',reportId:'5830f7ea-c81d-49a7-a347-d9cb2d1ca562',reportDisplayName:'Account'},
    {reportName:'DMS_TRP_Product Securities',reportId:'0c773311-e2e3-4ef9-9f7d-5b76c407715c',reportDisplayName:'Product Securities'},
    {reportName:'DMS_TRP_Product Issuers',reportId:'556d2e02-50be-4d48-9d3f-5ffad041e069',reportDisplayName:'Product Issuers'},
    {reportName:'DMS_TRP_Product Corporate Actions',reportId:'5765ccf3-7ff1-40cc-805f-cdae79cb32af',reportDisplayName:'Product Corporate Actions'},
    {reportName:'DMS_TRP_Transaction Realized Gain and Loss',reportId:'4bd73534-408c-4e3c-874c-edd48ac0b27e',reportDisplayName:'Transaction Realized Gain and Loss'},

]

export const PowerBiReportMonthlyList=[
    {reportName:'DMS_TRP_General Ledger Trialbalance Class_Monthly',
    reportId:'8f6a1341-1494-4f20-b3c4-c8734640558f',reportDisplayName:'General Ledger Trial Balance Class'},
    {reportName:'DMS_TRP_Transaction Activity Details_Monthly',
    reportId:'f5ce71fe-f9d1-46d4-83ea-04bb32247c20',reportDisplayName:'Transaction Activity Details'},
    {reportName:'DMS_TRP_General Ledger Trialbalance_Monthly',
    reportId:'2a9bb3cd-6cb9-4c51-87b1-0d2a8dbd96c8',reportDisplayName:'General Ledger Trial Balance'},
    {reportName:'DMS_TRP_Positions Portfolio Level_Monthly',
    reportId:'c8c337f0-9a00-4ad7-bce2-0ac6ab4755be',reportDisplayName:'Positions Portfolio Level'},
    {reportName:'DMS_TRP_Transaction disposal lot_Monthly',
    reportId:'e5484dbe-f190-43f7-81e2-9f6976cac81d',reportDisplayName:'Transaction Disposal Lot'},
    {reportName:'DMS_TRP_Positions Lot level_Monthly',
    reportId:'c8b4b4e1-56f9-4d31-9acd-89acb2197114',reportDisplayName:'Positions Lot Level'},
    // {reportName:'Monthly Book Report Package', reportId:'2186d45e-b7f3-40a0-85ce-0af0f040cd96', reportDisplayName:'Monthly Book Report Package'}
,
{reportName:'CDM Account',reportId:'5830f7ea-c81d-49a7-a347-d9cb2d1ca562',reportDisplayName:'Account'},
    {reportName:'DMS_TRP_Product Securities',reportId:'0c773311-e2e3-4ef9-9f7d-5b76c407715c',reportDisplayName:'Product Securities'},
    {reportName:'DMS_TRP_Product Issuers',reportId:'556d2e02-50be-4d48-9d3f-5ffad041e069',reportDisplayName:'Product Issuers'},
    {reportName:'DMS_TRP_Product Corporate Actions',reportId:'5765ccf3-7ff1-40cc-805f-cdae79cb32af',reportDisplayName:'Product Corporate Actions'},
    {reportName:'DMS_TRP_Transaction Realized Gain and Loss',reportId:'4bd73534-408c-4e3c-874c-edd48ac0b27e',reportDisplayName:'Transaction Realized Gain and Loss'},
];

export const PowerBiReportDailyListProd=[
    {reportName:'DMS_TRP_General Ledger Trialbalance Class_Daily',
    reportId:'8e88c772-15de-4a6b-8caa-774f22b3b5ae',reportDisplayName:'General Ledger Trial Balance Class'},
    {reportName:'DMS_TRP_Transaction Activity Details_Daily',
    reportId:'c7ec2f60-8d98-4704-8085-e99a10df853f',reportDisplayName:'Transaction Activity Details'},
    {reportName:'DMS_TRP_General Ledger Trialbalance_Daily',
    reportId:'7dfdd064-1d03-4401-b5be-9106e8b83215',reportDisplayName:'General Ledger Trial Balance'},
    {reportName:'DMS_TRP_Positions Portfolio Level_Daily',
    reportId:'b281b4eb-f8b9-4eac-8bdc-bfeea6e80b9a',reportDisplayName:'Positions Portfolio Level'},
    {reportName:'DMS_TRP_Transaction disposal lot_Daily',
    reportId:'f06102d5-9509-480a-ae94-5f44ef3b1173',reportDisplayName:'Transaction Disposal Lot'},
    {reportName:'DMS_TRP_Positions Lot Level_Daily',
    reportId:'5058ea25-7a8c-4ea8-a5bb-1b24c6ffd189',reportDisplayName:'Positions Lot Level'},

    {reportName:'DMS_TRP_CDM Account',reportId:'88d7ea4a-de3a-4ef0-be7a-07461464d6d1',reportDisplayName:'Account'},
    {reportName:'DMS_TRP_Product Securities',reportId:'534e30ce-9c28-4032-85e7-c3a5cc118817',reportDisplayName:'Product Securities'},
    {reportName:'DMS_TRP_Product Issuers',reportId:'af2cf0f3-e16f-4921-b402-408e0dbf3dd2',reportDisplayName:'Product Issuers'},
    {reportName:'DMS_TRP_Product Corporate Actions',reportId:'809a6a05-36e3-4f60-91cb-be68413bef15',reportDisplayName:'Product Corporate Actions'},
    {reportName:'DMS_TRP_Transaction Realized Gain and Loss',reportId:'cec7074c-dd4e-4b92-89db-c6ce390b4d98',reportDisplayName:'Transaction Realized Gain and Loss'},

];

export const PowerBiReportMonthlyListProd=[
    {reportName:'DMS_TRP_General Ledger Trialbalance Class_Monthly',
    reportId:'953c7bbc-59bc-4b23-9354-3853c7d239d0',reportDisplayName:'General Ledger Trial Balance Class'},
    {reportName:'DMS_TRP_Transaction Activity Details_Monthly',
    reportId:'7c61b3f0-54f6-4e49-bc09-afb21401a43e',reportDisplayName:'Transaction Activity Details'},
    {reportName:'DMS_TRP_General Ledger Trialbalance_Monthly',
    reportId:'00c8665c-3505-4651-a900-edcba67e6fd7',reportDisplayName:'General Ledger Trial Balance'},
    {reportName:'DMS_TRP_Positions Portfolio Level_Monthly',
    reportId:'565d5a15-31e5-4368-99d9-d30a1f71ef33',reportDisplayName:'Positions Portfolio Level'},
    {reportName:'DMS_TRP_Transaction disposal lot_Monthly',
    reportId:'bc3690ad-155f-4d11-922d-35744a622ef6',reportDisplayName:'Transaction Disposal Lot'},
    {reportName:'DMS_TRP_Positions Lot level_Monthly',
    reportId:'4a2cc2ca-7471-4bad-814e-aab8e8278b53',reportDisplayName:'Positions Lot Level'},
    // {reportName:'Monthly Book Report Package', reportId:'d1504a66-72de-4830-9a9d-e66b831f1ca1', reportDisplayName:'Monthly Book Report Package'}
,
{reportName:'DMS_TRP_CDM Account',reportId:'88d7ea4a-de3a-4ef0-be7a-07461464d6d1',reportDisplayName:'Account'},
{reportName:'DMS_TRP_Product Securities',reportId:'534e30ce-9c28-4032-85e7-c3a5cc118817',reportDisplayName:'Product Securities'},
{reportName:'DMS_TRP_Product Issuers',reportId:'af2cf0f3-e16f-4921-b402-408e0dbf3dd2',reportDisplayName:'Product Issuers'},
{reportName:'DMS_TRP_Product Corporate Actions',reportId:'809a6a05-36e3-4f60-91cb-be68413bef15',reportDisplayName:'Product Corporate Actions'},
{reportName:'DMS_TRP_Transaction Realized Gain and Loss',reportId:'cec7074c-dd4e-4b92-89db-c6ce390b4d98',reportDisplayName:'Transaction Realized Gain and Loss'}
];

export const PBI_CONFIG = {
    PBI_WORK_SPACE_ID: '4c4f5af3-ab5a-44c0-8fe9-533e75e8a324',
    PBI_POD:"DMS"
};


export const INPUT_VALIDATON_CONFIG = {
    SEARCH_INPUT_VALIDATION: /[A-Za-z0-9\-\_/ ]+/,
}