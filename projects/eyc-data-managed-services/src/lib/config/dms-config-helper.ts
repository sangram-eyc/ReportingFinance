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

export const ROUTE_URL_CONST = {
    DMS_LANDING_URL:'/data-managed-services',
    DATA_INTAKE_TYPE_URL: '/data-managed-services/data-intake',
    FILE_REVIEW_URL: '/data-managed-services/files-review',
    FILE_EXCEPTION:'/data-managed-services/files/exceptions',
    FILE_EXCEPTION_DETAILS:'/data-managed-services/files/exception-details'
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
    {reportName:'DMS_TRP_general_ledger_trialbalance_class_Daily',
    reportId:'cda96482-c872-465a-a108-bd5b8fcbabbd',reportDisplayName:'General Ledger Trial Balance Class'},
    {reportName:'DMS_TRP_transaction_activity_details_Daily',
    reportId:'441905c3-42e1-49bc-8981-81670fe7064c',reportDisplayName:'Transaction Activity Details'},
    {reportName:'DMS_TRP_General_Ledger_Trialbalance_Daily',
    reportId:'3ff8a859-64b2-4a6c-8823-e7b6bfe713d0',reportDisplayName:'General Ledger Trial Balance'},
    {reportName:'DMS_TRP_Positions Portfolio Level_Daily',
    reportId:'1873db02-a9cc-4960-9226-a9a8a2a55ec9',reportDisplayName:'Positions Portfolio Level'},
    {reportName:'DMS_TRP_Transaction disposal lot_Daily',
    reportId:'6359c6a1-e2df-4daf-9f2f-82fbf0ab2262',reportDisplayName:'Transaction Disposal Lot'},
    {reportName:'DMS_TRP_Positions Lotlevel Daily',
    reportId:'27bba513-505e-4351-88b2-b99e8a2db947',reportDisplayName:'Positions Lot Level'},

    {reportName:'DMS_TRP_CDM Account',reportId:'bd7e9e34-7b61-414f-a66c-0a9a35b0d6e6',reportDisplayName:'Account'},
    {reportName:'DMS_TRP_Product Securities',reportId:'2c06444c-a2c2-4caf-86e2-f4098c58dcd6',reportDisplayName:'Product Securities'},
    {reportName:'DMS_TRP_Product Issuers',reportId:'e001e391-5d1f-4175-9e1c-7bc890b91b01',reportDisplayName:'Product Issuers'},
    {reportName:'DMS_TRP_Product Corporate Actions',reportId:'2c2449d0-08ec-40aa-95a2-aa9eb155a5ac',reportDisplayName:'Product Corporate Actions'},
    {reportName:'DMS_TRP_transaction_realized_gain_and_loss',reportId:'4cec334a-9955-4610-ba04-c88d95398f06',reportDisplayName:'Transaction Realized Gain and Loss'},

    {reportName:'', reportId:'304fc8b5-4ba4-4760-b0c3-a85af3b1c17b', reportDisplayName:'Monthly Book Report Package'}

]

export const PowerBiReportMonthlyList=[
    {reportName:'DMS_TRP_general_ledger_trialbalance_class_monthly',
    reportId:'e1c1baad-c2a5-4c26-bff9-f2ac9fa86b99',reportDisplayName:'General Ledger Trial Balance Class'},
    {reportName:'DMS_TRP_transaction_activity_details_monthly',
    reportId:'2d9408fa-5d0a-4999-8d98-afd542eb3c57',reportDisplayName:'Transaction Activity Details'},
    {reportName:'DMS_TRP_General_Ledger_Trialbalance_Monthly',
    reportId:'b97ce2b0-df71-4cc6-b4a7-af014bba8c0c',reportDisplayName:'General Ledger Trial Balance'},
    {reportName:'DMS_TRP_Positions Portfolio Level_Monthly',
    reportId:'5b5fee20-b330-48a1-8f9f-fd0a6a6303f1',reportDisplayName:'Positions Portfolio Level'},
    {reportName:'DMS_TRP_Transaction disposal lot_Monthly',
    reportId:'1d98d992-48b4-44e3-b64b-5fb639edc522',reportDisplayName:'Transaction Disposal Lot'},
    {reportName:'DMS_TRP_Positions Lotlevel Monthly',
    reportId:'84344179-d24c-4111-b64e-b3338cdda26b',reportDisplayName:'Positions Lot Level'},

    {reportName:'DMS_TRP_CDM Account',reportId:'bd7e9e34-7b61-414f-a66c-0a9a35b0d6e6',reportDisplayName:'Account'},
    {reportName:'DMS_TRP_Product Securities',reportId:'2c06444c-a2c2-4caf-86e2-f4098c58dcd6',reportDisplayName:'Product Securities'},
    {reportName:'DMS_TRP_Product Issuers',reportId:'e001e391-5d1f-4175-9e1c-7bc890b91b01',reportDisplayName:'Product Issuers'},
    {reportName:'DMS_TRP_Product Corporate Actions',reportId:'2c2449d0-08ec-40aa-95a2-aa9eb155a5ac',reportDisplayName:'Product Corporate Actions'},
    {reportName:'DMS_TRP_transaction_realized_gain_and_loss',reportId:'4cec334a-9955-4610-ba04-c88d95398f06',reportDisplayName:'Transaction Realized Gain and Loss'}
]



export const INPUT_VALIDATON_CONFIG = {
    SEARCH_INPUT_VALIDATION: /[A-Za-z0-9\-\_/ ]+/,
}