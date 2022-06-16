import { Inject, Injectable } from '@angular/core';
import { DataManagedSettingsService } from './data-managed-settings.service';
import { EycDataApiService } from './eyc-data-api.service';
import { HttpParams } from '@angular/common/http';
import { DataSummary } from '../models/data-summary.model'
import { formatDate } from '@angular/common';
import {DataGrid, ExceptionDataGrid,ExceptionDetailsDataGrid,GroupByDataProviderCardGrid} from '../models/data-grid.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataManagedService {
  public exceptionDetails: any;
  public exceptionReportField:string;
  public exceptionFileName:string;
  public tableName: string;
  public auditDate: string;
  public auditHashID: string;
  public auditRuleType: any;
  public calSelectedMonth: string;
  public presentDate:Date;
  constructor(
    private dataManagedSettingsService: DataManagedSettingsService,
    private eycDataApiService: EycDataApiService
  ) { }

  set setAuditRuleType(val: string) {
    this.auditRuleType = val;
  }
  get getAuditRuleType(): string {
    return this.auditRuleType;
  }
  set setTableName(val: string) {
    this.tableName = val;
  }
  get getTableName(): string {
    return this.tableName;
  }
  set setAuditDate(val: string) {
    this.auditDate = val;
  }
  get getAuditDate(): string {
    return this.auditDate;
  }
  set setAuditHashID(val: string) {
    this.auditHashID = val;
  }
  get getAuditHashID(): string {
    return this.auditHashID;
  }
  set setExceptionDetails(val: any) {
    this.exceptionDetails = val;
  }
  get getExceptionDetails(): any {
    return this.exceptionDetails;
  }
  set setExceptionFileName(val: string) {
    this.exceptionFileName = val;
  }
  get getExceptionFileName(): string {
    return this.exceptionFileName;
  }

  set setExceptionReportField(val:string){
    this.exceptionReportField=val;
  }

  get getExceptionReportField(): string {
    return  this.exceptionReportField;
  }

  businessDate(businessWeekDay: Date): Date {
    const weekDay = businessWeekDay.getDay();
    switch (weekDay) {
      case 0: businessWeekDay.setDate(businessWeekDay.getDate() - 2); break;
      case 1: businessWeekDay.setDate(businessWeekDay.getDate() - 3); break;
      default: businessWeekDay.setDate(businessWeekDay.getDate() - 1); break;
    }
    return businessWeekDay;
  }

  monthLastDate(lastDate: Date): Date {
    return new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0);
  }

  prevMonthLastDate(lastDate: Date): Date {
    return new Date(lastDate.getFullYear(), lastDate.getMonth(), 0);
  }

  apiDateFormat(dateParam: Date): string {
    return `${formatDate(dateParam, 'yyyy-MM-dd', 'en')}`;
  }

  ymdToApiDateFormat(dateParam: string): string {
    return `${formatDate(new Date(dateParam).toLocaleDateString(), 'yyyy-MM-dd', 'en')}`;
  }

  monthlyFormat(dateParam: Date): string {
    return formatDate(dateParam, 'MMMM yyyy', 'en');
  }

  montlyDateSub(presentDate: Date): Date {
    const updatedDate = new Date(presentDate.getFullYear(), presentDate.getMonth(), 0);
    return updatedDate;
  }

  montlyDateAdd(presentDate: Date): Date  {
    const updatedDate = new Date(presentDate.getFullYear(), presentDate.getMonth() + 2, 0);
    return updatedDate;;
  }
  
  httpQueryParams(DataSummary: DataSummary): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', DataSummary.startDate);
    params = params.append('endDate', DataSummary.endDate);
    params = params.append('periodType', DataSummary.periodType);
    params = params.append('dueDate', DataSummary.dueDate);
    params = params.append('dataFrequency', DataSummary.dataFrequency);
    params = params.append('dataIntakeType', DataSummary.dataIntakeType);
    if (DataSummary.filterTypes.length > 0) {
      DataSummary.filterTypes.map((types) => {
        params = params.append('filterTypes', types);
      });
    }
    return params;
  }

  httpQueryParamsGrid(dataGrid: DataGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', dataGrid.startDate);
    params = params.append('endDate', dataGrid.endDate);
    params = params.append('periodType', dataGrid.periodType);
    params = params.append('dueDate', dataGrid.dueDate);
    params = params.append('dataFrequency', dataGrid.dataFrequency);
    params = params.append('dataIntakeType', dataGrid.dataIntakeType);
    params=params.append('summaryType',dataGrid.summaryType).append('reportType',dataGrid.reportType)
    .append('clientName',dataGrid.clientName).append('queryPhrase',dataGrid.queryPhrase);
    
    if (dataGrid.filterTypes.length > 0) {
      dataGrid.filterTypes.map((types) => {
        params = params.append('filterTypes', types);
      });
    }
    return params;
  }

  httpQueryParamsExceptionGrid(dataGrid: ExceptionDataGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', dataGrid.startDate);
    params = params.append('endDate', dataGrid.endDate);
    params = params.append('periodType', dataGrid.periodType);
    params = params.append('dueDate', dataGrid.dueDate);
    params = params.append('dataFrequency', dataGrid.dataFrequency);
    params = params.append('auditFileGuidName', dataGrid.auditFileGuidName);
    params=params.append('fileId',dataGrid.fileId)
    .append('fileName',dataGrid.fileName)
    .append('clientName',dataGrid.clientName)
    return params;
  }

  
  httpQueryParamsExceptionDetailsDataGrid(dataGrid: ExceptionDetailsDataGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();
    // Begin assigning parameters
    params = params.append('tableName', dataGrid.tableName);
    params = params.append('auditDate', dataGrid.auditDate);
    return params;
  }

  httpQueryParamsProviderCardGrid(dataGrid: GroupByDataProviderCardGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', dataGrid.startDate);
    params = params.append('endDate', dataGrid.endDate);
    params = params.append('periodType', dataGrid.periodType);
    params = params.append('dueDate', dataGrid.dueDate);
    params = params.append('dataFrequency', dataGrid.dataFrequency);
    params = params.append('dataIntakeType', dataGrid.dataIntakeType);
    if (dataGrid.filterTypes.length > 0) {
      dataGrid.filterTypes.map((types) => {
        params = params.append('filterTypes', types);
      });
    }
    params = params.append('auditFileGuidName', dataGrid.auditFileGuidName);
    params=params.append('fileId',dataGrid.fileId)
    .append('fileName',dataGrid.fileName)
    .append('clientName',dataGrid.clientName)
    .append('reportId',dataGrid.reportId)
    .append('reportName',dataGrid.reportName)
    .append('isViewClicked', dataGrid.isViewClicked ? 'true' : 'false');
    return params;
  }

  getFileSummaryList(params: DataSummary) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_list}`, this.httpQueryParams(params));
  } 

  getReviewAllList(params: DataSummary) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_review_all}`, this.httpQueryParams(params));
  } 
  getEmbedURL() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.PBI_EMBED_URL}`);
  }  
  getEmbedTokenURL() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.PBI_AUTH_TOKEN_URL}`);
  }                                                 
  getDataProviderList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider}`);
  }

  getDailyDataProviderList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider_daily}`);
  }

  getMonthlyDataProviderList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider_monthly}`);
  }

  getDailyDataDomainList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_domain_daily}`);
  }

  getMonthlyDataDomainList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_domain_monthly}`);
  }

  getDailyGeneralLedgerList(currentPage = 0, noOfRecords = 0) {
    let currentPageValue = `&currentPage=${currentPage}`;
    let noOfRecordsValue = `&numRecords=${noOfRecords}`;
    // After API integration will remove above line and uncomment below line
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_general_ledger_daily}${currentPageValue}${noOfRecordsValue}`);
  }

  getExceptionReportstable() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.exception_reports_table}`);
  }

  getReviewFilesData() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_review_data}`);
  }
  
  getReviewFileTableData(params: DataGrid) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.file_review_table_data}`,this.httpQueryParamsGrid(params));
  }

  getExceptionTableData(params:ExceptionDataGrid) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.exception_table_data}`,this.httpQueryParamsExceptionGrid(params));
  }
  getExceptionDetailsTableData(params:ExceptionDetailsDataGrid, bodyParam: any) {
    const tableName = `?tableName=${params.tableName}`;
    const auditDate = `&auditDate=${params.auditDate}`;
    return this.eycDataApiService.invokePostBodyAPI(`${this.dataManagedSettingsService.dataManagedServices.exception_details_table_data}${tableName}${auditDate}`, bodyParam);
  }
  getReviewByGroupProviderOrDomainGrid(params:GroupByDataProviderCardGrid){
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.review_by_group_provider_domain}`,this.httpQueryParamsProviderCardGrid(params));
  }
  getApiBaseUrl(){
    return this.dataManagedSettingsService.dataManagedServices.base_Url;
  }

  getApiCatalog(){
return of({
  "data":[{
  "domain": "product",
  "operations": [
     {
        "operation": "getSecurities",
        "methodType": "POST",
        "description": "get securities based on filter values. SecuritiesFilter is required.",
        "request": {
           "name": "securitiesFilter",
           
"parameters": [
           {
               "name": "first",
               "description": "The cursor to continue, this is mandatory field.",
               "parameterType": "GraphQL Variable",
               "dataType": "Int",
               "nullable": false
           },
           {
               "name": "offset",
               "description": "Number of records to continue after cursor.",
               "parameterType": "GraphQL Variable",
               "dataType": "Int",
               "nullable": true
           },
           {
               "name": "asOfDate",
               "description": "As of Date, optional, if not provided latest batch date will be used.",
               "parameterType": "GraphQL Variable",
               "dataType": "Date",
               "nullable": true
           },
           {
               "name": "adminName",
               "description": "Optional Admin Name, if not provided all admin names will be captured.",
               "parameterType": "GraphQL Variable",
               "dataType": "String",
               "nullable": true
           },
           {
               "name": "X-API-KEY",
               "description": "API KEY",
               "parameterType": "Header",
               "dataType": "String",
               "nullable": false
           },
           {
               "name": "X-CLIENT-ID",
               "description": "CLIENT ID",
               "parameterType": "Header",
               "dataType": "String",
               "nullable": false
           }
       ]
 
           },
        "response": {
           "name": "SecuritiesResponse",
          
"response": [
            {
                "name": "rowCount",
                "type": "Int"
            },
            {
                "name": "pageInfo",
                "type": [
                    {
                        "name": "hasPreviousPage",
                        "type": "Boolean"
                    },
                    {
                        "name": "hasNextPage",
                        "type": "Boolean"
                    }
                ]
            },
            {
                "name": "securities",
                "type": [
                    {
                        "name": "ratings",
                        "type": [
                            {
                                "name": "moodysRating",
                                "type": "String"
                            },
                            {
                                "name": "standardAndPoorsRating",
                                "type": "String"
                            },
                            {
                                "name": "fitchRating",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "securityClassification",
                        "type": [
                            {
                                "name": "securityTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "securityDescription",
                                "type": "String"
                            },
                            {
                                "name": "contractMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "investmentTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "issueUnitOfMeasure",
                                "type": "String"
                            },
                            {
                                "name": "issuePricingMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "alternativeIssueIdentifier",
                                "type": "String"
                            },
                            {
                                "name": "assetGroup",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "systemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueName",
                        "type": "String"
                    },
                    {
                        "name": "issueDate",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySyn",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssue",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssueDomicile",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrency",
                        "type": "String"
                    },
                    {
                        "name": "currencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityCurrency",
                        "type": "String"
                    },
                    {
                        "name": "tickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "poolNumber",
                        "type": "String"
                    },
                    {
                        "name": "couponRate",
                        "type": "String"
                    },
                    {
                        "name": "couponType",
                        "type": "String"
                    },
                    {
                        "name": "paymentFrequencyCodeFixedIncome",
                        "type": "String"
                    },
                    {
                        "name": "dayCountBasis",
                        "type": "String"
                    },
                    {
                        "name": "maturityDate",
                        "type": "String"
                    },
                    {
                        "name": "sharesOutstanding",
                        "type": "String"
                    },
                    {
                        "name": "dividendFrequency",
                        "type": "String"
                    },
                    {
                        "name": "strikePrice",
                        "type": "String"
                    },
                    {
                        "name": "underlyingSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "firstCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "dayOfMonthOverride",
                        "type": "String"
                    },
                    {
                        "name": "couponDayOfMonth",
                        "type": "String"
                    },
                    {
                        "name": "nextCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "businessDayConvention",
                        "type": "String"
                    },
                    {
                        "name": "maturityPrice",
                        "type": "String"
                    },
                    {
                        "name": "bondCallaableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "bondPutableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "amountIssued",
                        "type": "String"
                    },
                    {
                        "name": "demandFeatureIndicator",
                        "type": "String"
                    },
                    {
                        "name": "conversionStartDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionEndDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionRatio",
                        "type": "String"
                    },
                    {
                        "name": "convertibleSecurityIndicator",
                        "type": "String"
                    },
                    {
                        "name": "delayDays",
                        "type": "String"
                    },
                    {
                        "name": "cusip",
                        "type": "String"
                    },
                    {
                        "name": "isin",
                        "type": "String"
                    },
                    {
                        "name": "stockExchangeDailyOfficialList",
                        "type": "String"
                    },
                    {
                        "name": "factor",
                        "type": "String"
                    },
                    {
                        "name": "factorDate",
                        "type": "String"
                    },
                    {
                        "name": "couponFrequency",
                        "type": "String"
                    },
                    {
                        "name": "resetDate",
                        "type": "String"
                    },
                    {
                        "name": "redemptionDate",
                        "type": "String"
                    },
                    {
                        "name": "amortizationMethod",
                        "type": "String"
                    },
                    {
                        "name": "issuePrice",
                        "type": "String"
                    },
                    {
                        "name": "productExchangeCode",
                        "type": "String"
                    },
                    {
                        "name": "callPutIndicator",
                        "type": "String"
                    },
                    {
                        "name": "stateCode",
                        "type": "String"
                    },
                    {
                        "name": "stateName",
                        "type": "String"
                    },
                    {
                        "name": "rule144aIndicator",
                        "type": "String"
                    },
                    {
                        "name": "alternativeMinimumTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "thirdPartyAdministratorClientIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "federalTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "redCode",
                        "type": "String"
                    },
                    {
                        "name": "payReceiveIndicatorSecurity",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionIssueIdentifiers",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySynonym",
                        "type": "String"
                    },
                    {
                        "name": "issueDescription",
                        "type": "String"
                    },
                    {
                        "name": "couponTypeDescription",
                        "type": "String"
                    },
                    {
                        "name": "optionsMaturityDate",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityYield",
                        "type": "String"
                    },
                    {
                        "name": "issuePriceQuote",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueTypeDescription",
                        "type": "String"
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getIssuers",
        "methodType": "POST",
        "description": "get issuers based on filter values. IssuersFilter is required.",
        "request": {
           "name": "issuersFilter",
           
"parameters": [
            {
                "name": "first",
                "description": "The cursor to continue, this is mandatory field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
            },
            {
                "name": "offset",
                "description": "Number of records to continue after cursor.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
            },
            {
                "name": "asOfDate",
                "description": "As of Date, optional, if not provided latest batch date will be used.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": true
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "IssuersResponse",
          
"response": [
            {
                "name": "rowCount",
                "type": "Int"
            },
            {
                "name": "pageInfo",
                "type": [
                    {
                        "name": "hasPreviousPage",
                        "type": "Boolean"
                    },
                    {
                        "name": "hasNextPage",
                        "type": "Boolean"
                    }
                ]
            },
            {
                "name": "issuers",
                "type": [
                    {
                        "name": "primaryIssuerIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "ultimateParentIssuer",
                        "type": "String"
                    },
                    {
                        "name": "ultimateIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "countryOfDomicile",
                        "type": "String"
                    },
                    {
                        "name": "countryOfRisk",
                        "type": "String"
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "classification",
                        "type": [
                            {
                                "name": "issuerIndustryGroup",
                                "type": "String"
                            },
                            {
                                "name": "issuerGlobalIndustryClassificationSystemIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustrySubgroup",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSector",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSectorName",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemIndustryGroup",
                                "type": "String"
                            }
                        ]
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getIssuer",
        "methodType": "POST",
        "description": "gets specific issuer(s) based on issuer filter. IssuerFilter is required.",
        "request": {
           "name": "issuerFilter",
          
"parameters": [
            {
                "name": "asOfDate",
                "description": "As of Date, optional, if not provided latest batch date will be used.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": true
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "primaryIssuerIdentifier",
                "description": "primaryIssuerIdentifier is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "IssuerDetails",
           
"response": [
            {
                "name": "issuers",
                "type": [
                    {
                        "name": "primaryIssuerIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "ultimateParentIssuer",
                        "type": "String"
                    },
                    {
                        "name": "ultimateIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "countryOfDomicile",
                        "type": "String"
                    },
                    {
                        "name": "countryOfRisk",
                        "type": "String"
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "classification",
                        "type": [
                            {
                                "name": "issuerIndustryGroup",
                                "type": "String"
                            },
                            {
                                "name": "issuerGlobalIndustryClassificationSystemIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustrySubgroup",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSector",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSectorName",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemIndustryGroup",
                                "type": "String"
                            }
                        ]
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getSecurity",
        "methodType": "POST",
        "description": "gets specific securities based on security filter. SecurityFilter is required.",
        "request": {
           "name": "securityFilter",
           
"parameters": [
            {
                "name": "asOfDate",
                "description": "As of Date, optional, if not provided latest batch date will be used.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": true
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "primarySecurityIdentifier",
                "description": "primarySecurityIdentifier is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "primarySecurityIdentifierType",
                "description": "primarySecurityIdentifierType is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "SecurityDetails",
          
"response": [
            {
                "name": "securities",
                "type": [
                    {
                        "name": "ratings",
                        "type": [
                            {
                                "name": "moodysRating",
                                "type": "String"
                            },
                            {
                                "name": "standardAndPoorsRating",
                                "type": "String"
                            },
                            {
                                "name": "fitchRating",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "securityClassification",
                        "type": [
                            {
                                "name": "securityTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "securityDescription",
                                "type": "String"
                            },
                            {
                                "name": "contractMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "investmentTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "issueUnitOfMeasure",
                                "type": "String"
                            },
                            {
                                "name": "issuePricingMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "alternativeIssueIdentifier",
                                "type": "String"
                            },
                            {
                                "name": "assetGroup",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "systemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueName",
                        "type": "String"
                    },
                    {
                        "name": "issueDate",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySyn",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssue",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssueDomicile",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrency",
                        "type": "String"
                    },
                    {
                        "name": "currencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityCurrency",
                        "type": "String"
                    },
                    {
                        "name": "tickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "poolNumber",
                        "type": "String"
                    },
                    {
                        "name": "couponRate",
                        "type": "String"
                    },
                    {
                        "name": "couponType",
                        "type": "String"
                    },
                    {
                        "name": "paymentFrequencyCodeFixedIncome",
                        "type": "String"
                    },
                    {
                        "name": "dayCountBasis",
                        "type": "String"
                    },
                    {
                        "name": "maturityDate",
                        "type": "String"
                    },
                    {
                        "name": "sharesOutstanding",
                        "type": "String"
                    },
                    {
                        "name": "dividendFrequency",
                        "type": "String"
                    },
                    {
                        "name": "strikePrice",
                        "type": "String"
                    },
                    {
                        "name": "underlyingSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "firstCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "dayOfMonthOverride",
                        "type": "String"
                    },
                    {
                        "name": "couponDayOfMonth",
                        "type": "String"
                    },
                    {
                        "name": "nextCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "businessDayConvention",
                        "type": "String"
                    },
                    {
                        "name": "maturityPrice",
                        "type": "String"
                    },
                    {
                        "name": "bondCallaableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "bondPutableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "amountIssued",
                        "type": "String"
                    },
                    {
                        "name": "demandFeatureIndicator",
                        "type": "String"
                    },
                    {
                        "name": "conversionStartDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionEndDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionRatio",
                        "type": "String"
                    },
                    {
                        "name": "convertibleSecurityIndicator",
                        "type": "String"
                    },
                    {
                        "name": "delayDays",
                        "type": "String"
                    },
                    {
                        "name": "cusip",
                        "type": "String"
                    },
                    {
                        "name": "isin",
                        "type": "String"
                    },
                    {
                        "name": "stockExchangeDailyOfficialList",
                        "type": "String"
                    },
                    {
                        "name": "factor",
                        "type": "String"
                    },
                    {
                        "name": "factorDate",
                        "type": "String"
                    },
                    {
                        "name": "couponFrequency",
                        "type": "String"
                    },
                    {
                        "name": "resetDate",
                        "type": "String"
                    },
                    {
                        "name": "redemptionDate",
                        "type": "String"
                    },
                    {
                        "name": "amortizationMethod",
                        "type": "String"
                    },
                    {
                        "name": "issuePrice",
                        "type": "String"
                    },
                    {
                        "name": "productExchangeCode",
                        "type": "String"
                    },
                    {
                        "name": "callPutIndicator",
                        "type": "String"
                    },
                    {
                        "name": "stateCode",
                        "type": "String"
                    },
                    {
                        "name": "stateName",
                        "type": "String"
                    },
                    {
                        "name": "rule144aIndicator",
                        "type": "String"
                    },
                    {
                        "name": "alternativeMinimumTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "thirdPartyAdministratorClientIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "federalTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "redCode",
                        "type": "String"
                    },
                    {
                        "name": "payReceiveIndicatorSecurity",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionIssueIdentifiers",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySynonym",
                        "type": "String"
                    },
                    {
                        "name": "issueDescription",
                        "type": "String"
                    },
                    {
                        "name": "couponTypeDescription",
                        "type": "String"
                    },
                    {
                        "name": "optionsMaturityDate",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityYield",
                        "type": "String"
                    },
                    {
                        "name": "issuePriceQuote",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueTypeDescription",
                        "type": "String"
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getCorporateActionDetails",
        "methodType": "POST",
        "description": "gets corporate action details for specific primary issuer identifier",
        "request": {
           "name": "corporateActionsFilter",
          
"parameters": [
            {
                "name": "first",
                "description": "The cursor to continue, this is mandatory field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
            },
            {
                "name": "offset",
                "description": "Number of records to continue after cursor.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
            },
            {
                "name": "primaryIssuerIdentifier",
                "description": "primaryIssuerIdentifier is optional field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "correspondingPrimaryIssueIdentifier",
                "description": "Corresponding Primary Issue Identifier is optional field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "from",
                "description": "From date is a mandatory field",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
            },
            {
                "name": "to",
                "description": "To date is a mandatory field",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "CorporateActionsDetailsResponse",
          
"response": [
            {
                "name": "rowCount",
                "type": "Int"
            },
            {
                "name": "pageInfo",
                "type": [
                    {
                        "name": "hasPreviousPage",
                        "type": "Boolean"
                    },
                    {
                        "name": "hasNextPage",
                        "type": "Boolean"
                    }
                ]
            },
            {
                "name": "corporateActions",
                "type": [
                    {
                        "name": "fundIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "fundName",
                        "type": "String"
                    },
                    {
                        "name": "systemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "investmentTypeCode",
                        "type": "String"
                    },
                    {
                        "name": "tickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "securityDescription",
                        "type": "String"
                    },
                    {
                        "name": "transactionAccountingDate",
                        "type": "String"
                    },
                    {
                        "name": "transactionMonthEndAccountingDate",
                        "type": "String"
                    },
                    {
                        "name": "blockOrderIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "cancelIndicator",
                        "type": "String"
                    },
                    {
                        "name": "transactionAccountingBasis",
                        "type": "String"
                    },
                    {
                        "name": "positionLongShortIndicator",
                        "type": "String"
                    },
                    {
                        "name": "positionQuantity",
                        "type": "String"
                    },
                    {
                        "name": "lotIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "lotLevelPositionIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionType",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionUnits",
                        "type": "String"
                    },
                    {
                        "name": "dividendExDate",
                        "type": "String"
                    },
                    {
                        "name": "foreignExchangeSpotRate",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionShares",
                        "type": "String"
                    },
                    {
                        "name": "correspondingSystemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "correspondingTickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "correspondingPrimaryIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "corporationActionFinalPositionQuantity",
                        "type": "String"
                    },
                    {
                        "name": "correspondingPostCorpActionEventPrice",
                        "type": "String"
                    },
                    {
                        "name": "postCorpActionPrice",
                        "type": "String"
                    },
                    {
                        "name": "correspondingCostLocal",
                        "type": "String"
                    },
                    {
                        "name": "correspondingCostBase",
                        "type": "String"
                    },
                    {
                        "name": "correspondingIssueName",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionConversionFactor",
                        "type": "String"
                    },
                    {
                        "name": "toIssueName",
                        "type": "String"
                    },
                    {
                        "name": "dividendRate",
                        "type": "String"
                    },
                    {
                        "name": "announcementDate",
                        "type": "String"
                    },
                    {
                        "name": "dividendPayDate",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionCashConversionFactor",
                        "type": "String"
                    },
                    {
                        "name": "dateOfRecord",
                        "type": "String"
                    },
                    {
                        "name": "ratioFromCorpActionShares",
                        "type": "String"
                    },
                    {
                        "name": "ratioToCorpActionShares",
                        "type": "String"
                    },
                    {
                        "name": "mandatoryVoluntaryIndicator",
                        "type": "String"
                    },
                    {
                        "name": "receivableOrPayableAmountLocal",
                        "type": "String"
                    },
                    {
                        "name": "receivableOrPayableAmountBase",
                        "type": "String"
                    },
                    {
                        "name": "transactionCode",
                        "type": "String"
                    },
                    {
                        "name": "fractionalSharesIndicator",
                        "type": "String"
                    },
                    {
                        "name": "bookValueLocal",
                        "type": "String"
                    },
                    {
                        "name": "bookValueBase",
                        "type": "String"
                    },
                    {
                        "name": "transactionCancelStatus",
                        "type": "String"
                    },
                    {
                        "name": "corporateIdentifierClientSpecific",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionProcessingPriority",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionProcessingStatus",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionEventSequence",
                        "type": "String"
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    }
                ]
            }
        ]
        }
     }
  ]
},
{
  "domain": "product2",
  "operations": [
     {
        "operation": "getSecurities",
        "methodType": "POST",
        "description": "get securities based on filter values. SecuritiesFilter is required.",
        "request": {
           "name": "securitiesFilter",
           
"parameters": [
           {
               "name": "first",
               "description": "The cursor to continue, this is mandatory field.",
               "parameterType": "GraphQL Variable",
               "dataType": "Int",
               "nullable": false
           },
           {
               "name": "offset",
               "description": "Number of records to continue after cursor.",
               "parameterType": "GraphQL Variable",
               "dataType": "Int",
               "nullable": true
           },
           {
               "name": "asOfDate",
               "description": "As of Date, optional, if not provided latest batch date will be used.",
               "parameterType": "GraphQL Variable",
               "dataType": "Date",
               "nullable": true
           },
           {
               "name": "adminName",
               "description": "Optional Admin Name, if not provided all admin names will be captured.",
               "parameterType": "GraphQL Variable",
               "dataType": "String",
               "nullable": true
           },
           {
               "name": "X-API-KEY",
               "description": "API KEY",
               "parameterType": "Header",
               "dataType": "String",
               "nullable": false
           },
           {
               "name": "X-CLIENT-ID",
               "description": "CLIENT ID",
               "parameterType": "Header",
               "dataType": "String",
               "nullable": false
           }
       ]
 
           },
        "response": {
           "name": "SecuritiesResponse",
          
"response": [
            {
                "name": "rowCount",
                "type": "Int"
            },
            {
                "name": "pageInfo",
                "type": [
                    {
                        "name": "hasPreviousPage",
                        "type": "Boolean"
                    },
                    {
                        "name": "hasNextPage",
                        "type": "Boolean"
                    }
                ]
            },
            {
                "name": "securities",
                "type": [
                    {
                        "name": "ratings",
                        "type": [
                            {
                                "name": "moodysRating",
                                "type": "String"
                            },
                            {
                                "name": "standardAndPoorsRating",
                                "type": "String"
                            },
                            {
                                "name": "fitchRating",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "securityClassification",
                        "type": [
                            {
                                "name": "securityTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "securityDescription",
                                "type": "String"
                            },
                            {
                                "name": "contractMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "investmentTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "issueUnitOfMeasure",
                                "type": "String"
                            },
                            {
                                "name": "issuePricingMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "alternativeIssueIdentifier",
                                "type": "String"
                            },
                            {
                                "name": "assetGroup",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "systemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueName",
                        "type": "String"
                    },
                    {
                        "name": "issueDate",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySyn",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssue",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssueDomicile",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrency",
                        "type": "String"
                    },
                    {
                        "name": "currencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityCurrency",
                        "type": "String"
                    },
                    {
                        "name": "tickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "poolNumber",
                        "type": "String"
                    },
                    {
                        "name": "couponRate",
                        "type": "String"
                    },
                    {
                        "name": "couponType",
                        "type": "String"
                    },
                    {
                        "name": "paymentFrequencyCodeFixedIncome",
                        "type": "String"
                    },
                    {
                        "name": "dayCountBasis",
                        "type": "String"
                    },
                    {
                        "name": "maturityDate",
                        "type": "String"
                    },
                    {
                        "name": "sharesOutstanding",
                        "type": "String"
                    },
                    {
                        "name": "dividendFrequency",
                        "type": "String"
                    },
                    {
                        "name": "strikePrice",
                        "type": "String"
                    },
                    {
                        "name": "underlyingSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "firstCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "dayOfMonthOverride",
                        "type": "String"
                    },
                    {
                        "name": "couponDayOfMonth",
                        "type": "String"
                    },
                    {
                        "name": "nextCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "businessDayConvention",
                        "type": "String"
                    },
                    {
                        "name": "maturityPrice",
                        "type": "String"
                    },
                    {
                        "name": "bondCallaableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "bondPutableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "amountIssued",
                        "type": "String"
                    },
                    {
                        "name": "demandFeatureIndicator",
                        "type": "String"
                    },
                    {
                        "name": "conversionStartDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionEndDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionRatio",
                        "type": "String"
                    },
                    {
                        "name": "convertibleSecurityIndicator",
                        "type": "String"
                    },
                    {
                        "name": "delayDays",
                        "type": "String"
                    },
                    {
                        "name": "cusip",
                        "type": "String"
                    },
                    {
                        "name": "isin",
                        "type": "String"
                    },
                    {
                        "name": "stockExchangeDailyOfficialList",
                        "type": "String"
                    },
                    {
                        "name": "factor",
                        "type": "String"
                    },
                    {
                        "name": "factorDate",
                        "type": "String"
                    },
                    {
                        "name": "couponFrequency",
                        "type": "String"
                    },
                    {
                        "name": "resetDate",
                        "type": "String"
                    },
                    {
                        "name": "redemptionDate",
                        "type": "String"
                    },
                    {
                        "name": "amortizationMethod",
                        "type": "String"
                    },
                    {
                        "name": "issuePrice",
                        "type": "String"
                    },
                    {
                        "name": "productExchangeCode",
                        "type": "String"
                    },
                    {
                        "name": "callPutIndicator",
                        "type": "String"
                    },
                    {
                        "name": "stateCode",
                        "type": "String"
                    },
                    {
                        "name": "stateName",
                        "type": "String"
                    },
                    {
                        "name": "rule144aIndicator",
                        "type": "String"
                    },
                    {
                        "name": "alternativeMinimumTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "thirdPartyAdministratorClientIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "federalTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "redCode",
                        "type": "String"
                    },
                    {
                        "name": "payReceiveIndicatorSecurity",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionIssueIdentifiers",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySynonym",
                        "type": "String"
                    },
                    {
                        "name": "issueDescription",
                        "type": "String"
                    },
                    {
                        "name": "couponTypeDescription",
                        "type": "String"
                    },
                    {
                        "name": "optionsMaturityDate",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityYield",
                        "type": "String"
                    },
                    {
                        "name": "issuePriceQuote",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueTypeDescription",
                        "type": "String"
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getIssuers",
        "methodType": "POST",
        "description": "get issuers based on filter values. IssuersFilter is required.",
        "request": {
           "name": "issuersFilter",
           
"parameters": [
            {
                "name": "first",
                "description": "The cursor to continue, this is mandatory field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
            },
            {
                "name": "offset",
                "description": "Number of records to continue after cursor.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
            },
            {
                "name": "asOfDate",
                "description": "As of Date, optional, if not provided latest batch date will be used.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": true
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "IssuersResponse",
          
"response": [
            {
                "name": "rowCount",
                "type": "Int"
            },
            {
                "name": "pageInfo",
                "type": [
                    {
                        "name": "hasPreviousPage",
                        "type": "Boolean"
                    },
                    {
                        "name": "hasNextPage",
                        "type": "Boolean"
                    }
                ]
            },
            {
                "name": "issuers",
                "type": [
                    {
                        "name": "primaryIssuerIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "ultimateParentIssuer",
                        "type": "String"
                    },
                    {
                        "name": "ultimateIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "countryOfDomicile",
                        "type": "String"
                    },
                    {
                        "name": "countryOfRisk",
                        "type": "String"
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "classification",
                        "type": [
                            {
                                "name": "issuerIndustryGroup",
                                "type": "String"
                            },
                            {
                                "name": "issuerGlobalIndustryClassificationSystemIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustrySubgroup",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSector",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSectorName",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemIndustryGroup",
                                "type": "String"
                            }
                        ]
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getIssuer",
        "methodType": "POST",
        "description": "gets specific issuer(s) based on issuer filter. IssuerFilter is required.",
        "request": {
           "name": "issuerFilter",
          
"parameters": [
            {
                "name": "asOfDate",
                "description": "As of Date, optional, if not provided latest batch date will be used.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": true
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "primaryIssuerIdentifier",
                "description": "primaryIssuerIdentifier is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "IssuerDetails",
           
"response": [
            {
                "name": "issuers",
                "type": [
                    {
                        "name": "primaryIssuerIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "ultimateParentIssuer",
                        "type": "String"
                    },
                    {
                        "name": "ultimateIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "countryOfDomicile",
                        "type": "String"
                    },
                    {
                        "name": "countryOfRisk",
                        "type": "String"
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "classification",
                        "type": [
                            {
                                "name": "issuerIndustryGroup",
                                "type": "String"
                            },
                            {
                                "name": "issuerGlobalIndustryClassificationSystemIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustry",
                                "type": "String"
                            },
                            {
                                "name": "issuerIndustrySubgroup",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSector",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemSectorName",
                                "type": "String"
                            },
                            {
                                "name": "globalIndustryClassificationSystemIndustryGroup",
                                "type": "String"
                            }
                        ]
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getSecurity",
        "methodType": "POST",
        "description": "gets specific securities based on security filter. SecurityFilter is required.",
        "request": {
           "name": "securityFilter",
           
"parameters": [
            {
                "name": "asOfDate",
                "description": "As of Date, optional, if not provided latest batch date will be used.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": true
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "primarySecurityIdentifier",
                "description": "primarySecurityIdentifier is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "primarySecurityIdentifierType",
                "description": "primarySecurityIdentifierType is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "SecurityDetails",
          
"response": [
            {
                "name": "securities",
                "type": [
                    {
                        "name": "ratings",
                        "type": [
                            {
                                "name": "moodysRating",
                                "type": "String"
                            },
                            {
                                "name": "standardAndPoorsRating",
                                "type": "String"
                            },
                            {
                                "name": "fitchRating",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "securityClassification",
                        "type": [
                            {
                                "name": "securityTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "securityDescription",
                                "type": "String"
                            },
                            {
                                "name": "contractMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "investmentTypeCode",
                                "type": "String"
                            },
                            {
                                "name": "issueUnitOfMeasure",
                                "type": "String"
                            },
                            {
                                "name": "issuePricingMultiplier",
                                "type": "String"
                            },
                            {
                                "name": "alternativeIssueIdentifier",
                                "type": "String"
                            },
                            {
                                "name": "assetGroup",
                                "type": "String"
                            }
                        ]
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "issuerName",
                        "type": "String"
                    },
                    {
                        "name": "systemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssueIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueName",
                        "type": "String"
                    },
                    {
                        "name": "issueDate",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySyn",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssue",
                        "type": "String"
                    },
                    {
                        "name": "countryOfIssueDomicile",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrency",
                        "type": "String"
                    },
                    {
                        "name": "currencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityCurrency",
                        "type": "String"
                    },
                    {
                        "name": "tickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "poolNumber",
                        "type": "String"
                    },
                    {
                        "name": "couponRate",
                        "type": "String"
                    },
                    {
                        "name": "couponType",
                        "type": "String"
                    },
                    {
                        "name": "paymentFrequencyCodeFixedIncome",
                        "type": "String"
                    },
                    {
                        "name": "dayCountBasis",
                        "type": "String"
                    },
                    {
                        "name": "maturityDate",
                        "type": "String"
                    },
                    {
                        "name": "sharesOutstanding",
                        "type": "String"
                    },
                    {
                        "name": "dividendFrequency",
                        "type": "String"
                    },
                    {
                        "name": "strikePrice",
                        "type": "String"
                    },
                    {
                        "name": "underlyingSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "firstCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "dayOfMonthOverride",
                        "type": "String"
                    },
                    {
                        "name": "couponDayOfMonth",
                        "type": "String"
                    },
                    {
                        "name": "nextCouponDate",
                        "type": "String"
                    },
                    {
                        "name": "businessDayConvention",
                        "type": "String"
                    },
                    {
                        "name": "maturityPrice",
                        "type": "String"
                    },
                    {
                        "name": "bondCallaableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "bondPutableIndicator",
                        "type": "String"
                    },
                    {
                        "name": "amountIssued",
                        "type": "String"
                    },
                    {
                        "name": "demandFeatureIndicator",
                        "type": "String"
                    },
                    {
                        "name": "conversionStartDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionEndDate",
                        "type": "String"
                    },
                    {
                        "name": "conversionRatio",
                        "type": "String"
                    },
                    {
                        "name": "convertibleSecurityIndicator",
                        "type": "String"
                    },
                    {
                        "name": "delayDays",
                        "type": "String"
                    },
                    {
                        "name": "cusip",
                        "type": "String"
                    },
                    {
                        "name": "isin",
                        "type": "String"
                    },
                    {
                        "name": "stockExchangeDailyOfficialList",
                        "type": "String"
                    },
                    {
                        "name": "factor",
                        "type": "String"
                    },
                    {
                        "name": "factorDate",
                        "type": "String"
                    },
                    {
                        "name": "couponFrequency",
                        "type": "String"
                    },
                    {
                        "name": "resetDate",
                        "type": "String"
                    },
                    {
                        "name": "redemptionDate",
                        "type": "String"
                    },
                    {
                        "name": "amortizationMethod",
                        "type": "String"
                    },
                    {
                        "name": "issuePrice",
                        "type": "String"
                    },
                    {
                        "name": "productExchangeCode",
                        "type": "String"
                    },
                    {
                        "name": "callPutIndicator",
                        "type": "String"
                    },
                    {
                        "name": "stateCode",
                        "type": "String"
                    },
                    {
                        "name": "stateName",
                        "type": "String"
                    },
                    {
                        "name": "rule144aIndicator",
                        "type": "String"
                    },
                    {
                        "name": "alternativeMinimumTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "thirdPartyAdministratorClientIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "federalTaxIndicator",
                        "type": "String"
                    },
                    {
                        "name": "redCode",
                        "type": "String"
                    },
                    {
                        "name": "payReceiveIndicatorSecurity",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionIssueIdentifiers",
                        "type": "String"
                    },
                    {
                        "name": "clientSecuritySynonym",
                        "type": "String"
                    },
                    {
                        "name": "issueDescription",
                        "type": "String"
                    },
                    {
                        "name": "couponTypeDescription",
                        "type": "String"
                    },
                    {
                        "name": "optionsMaturityDate",
                        "type": "String"
                    },
                    {
                        "name": "issueCurrencyName",
                        "type": "String"
                    },
                    {
                        "name": "securityYield",
                        "type": "String"
                    },
                    {
                        "name": "issuePriceQuote",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "internalSecurityIdentifierType",
                        "type": "String"
                    },
                    {
                        "name": "issueTypeDescription",
                        "type": "String"
                    }
                ]
            }
        ]
        }
     },
     {
        "operation": "getCorporateActionDetails",
        "methodType": "POST",
        "description": "gets corporate action details for specific primary issuer identifier",
        "request": {
           "name": "corporateActionsFilter",
          
"parameters": [
            {
                "name": "first",
                "description": "The cursor to continue, this is mandatory field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
            },
            {
                "name": "offset",
                "description": "Number of records to continue after cursor.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
            },
            {
                "name": "primaryIssuerIdentifier",
                "description": "primaryIssuerIdentifier is optional field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "correspondingPrimaryIssueIdentifier",
                "description": "Corresponding Primary Issue Identifier is optional field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "from",
                "description": "From date is a mandatory field",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
            },
            {
                "name": "to",
                "description": "To date is a mandatory field",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
            },
            {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
            },
            {
                "name": "X-API-KEY",
                "description": "API KEY",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            },
            {
                "name": "X-CLIENT-ID",
                "description": "CLIENT ID",
                "parameterType": "Header",
                "dataType": "String",
                "nullable": false
            }
        ]
        },
        "response": {
           "name": "CorporateActionsDetailsResponse",
          
"response": [
            {
                "name": "rowCount",
                "type": "Int"
            },
            {
                "name": "pageInfo",
                "type": [
                    {
                        "name": "hasPreviousPage",
                        "type": "Boolean"
                    },
                    {
                        "name": "hasNextPage",
                        "type": "Boolean"
                    }
                ]
            },
            {
                "name": "corporateActions",
                "type": [
                    {
                        "name": "fundIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "fundName",
                        "type": "String"
                    },
                    {
                        "name": "systemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "investmentTypeCode",
                        "type": "String"
                    },
                    {
                        "name": "tickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "primaryIssuerIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "securityDescription",
                        "type": "String"
                    },
                    {
                        "name": "transactionAccountingDate",
                        "type": "String"
                    },
                    {
                        "name": "transactionMonthEndAccountingDate",
                        "type": "String"
                    },
                    {
                        "name": "blockOrderIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "cancelIndicator",
                        "type": "String"
                    },
                    {
                        "name": "transactionAccountingBasis",
                        "type": "String"
                    },
                    {
                        "name": "positionLongShortIndicator",
                        "type": "String"
                    },
                    {
                        "name": "positionQuantity",
                        "type": "String"
                    },
                    {
                        "name": "lotIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "lotLevelPositionIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionType",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionUnits",
                        "type": "String"
                    },
                    {
                        "name": "dividendExDate",
                        "type": "String"
                    },
                    {
                        "name": "foreignExchangeSpotRate",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionShares",
                        "type": "String"
                    },
                    {
                        "name": "correspondingSystemIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "correspondingTickerSymbol",
                        "type": "String"
                    },
                    {
                        "name": "correspondingPrimaryIssueIdentifier",
                        "type": "String"
                    },
                    {
                        "name": "corporationActionFinalPositionQuantity",
                        "type": "String"
                    },
                    {
                        "name": "correspondingPostCorpActionEventPrice",
                        "type": "String"
                    },
                    {
                        "name": "postCorpActionPrice",
                        "type": "String"
                    },
                    {
                        "name": "correspondingCostLocal",
                        "type": "String"
                    },
                    {
                        "name": "correspondingCostBase",
                        "type": "String"
                    },
                    {
                        "name": "correspondingIssueName",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionConversionFactor",
                        "type": "String"
                    },
                    {
                        "name": "toIssueName",
                        "type": "String"
                    },
                    {
                        "name": "dividendRate",
                        "type": "String"
                    },
                    {
                        "name": "announcementDate",
                        "type": "String"
                    },
                    {
                        "name": "dividendPayDate",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionCashConversionFactor",
                        "type": "String"
                    },
                    {
                        "name": "dateOfRecord",
                        "type": "String"
                    },
                    {
                        "name": "ratioFromCorpActionShares",
                        "type": "String"
                    },
                    {
                        "name": "ratioToCorpActionShares",
                        "type": "String"
                    },
                    {
                        "name": "mandatoryVoluntaryIndicator",
                        "type": "String"
                    },
                    {
                        "name": "receivableOrPayableAmountLocal",
                        "type": "String"
                    },
                    {
                        "name": "receivableOrPayableAmountBase",
                        "type": "String"
                    },
                    {
                        "name": "transactionCode",
                        "type": "String"
                    },
                    {
                        "name": "fractionalSharesIndicator",
                        "type": "String"
                    },
                    {
                        "name": "bookValueLocal",
                        "type": "String"
                    },
                    {
                        "name": "bookValueBase",
                        "type": "String"
                    },
                    {
                        "name": "transactionCancelStatus",
                        "type": "String"
                    },
                    {
                        "name": "corporateIdentifierClientSpecific",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionProcessingPriority",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionProcessingStatus",
                        "type": "String"
                    },
                    {
                        "name": "corporateActionEventSequence",
                        "type": "String"
                    },
                    {
                        "name": "adminName",
                        "type": "String"
                    }
                ]
            }
        ]
        }
     }
  ]
}
]
}
);
    // return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.api_catalog}`);
  }
}
