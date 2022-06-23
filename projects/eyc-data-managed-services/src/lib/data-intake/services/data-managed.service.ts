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
  "data":[
    {
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
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "securities",
                "type": [
                  {
                    "name": "ratings",
                    "type": [
                      {
                        "name": "moodysRating",
                        "type": "String"
                      },
                      {
                        "name": "standardAndPoorsRating",
                        "type": "String"
                      },
                      {
                        "name": "fitchRating",
                        "type": "String"
                      }
                    ]
                  },
                  {
                    "name": "securityClassification",
                    "type": [
                      {
                        "name": "securityTypeCode",
                        "type": "String"
                      },
                      {
                        "name": "securityDescription",
                        "type": "String"
                      },
                      {
                        "name": "contractMultiplier",
                        "type": "String"
                      },
                      {
                        "name": "investmentTypeCode",
                        "type": "String"
                      },
                      {
                        "name": "issueUnitOfMeasure",
                        "type": "String"
                      },
                      {
                        "name": "issuePricingMultiplier",
                        "type": "String"
                      },
                      {
                        "name": "alternativeIssueIdentifier",
                        "type": "String"
                      },
                      {
                        "name": "assetGroup",
                        "type": "String"
                      }
                    ]
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerName",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "issueDate",
                    "type": "String"
                  },
                  {
                    "name": "clientSecuritySyn",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssueDomicile",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "currencyName",
                    "type": "String"
                  },
                  {
                    "name": "securityCurrency",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "poolNumber",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "couponType",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "sharesOutstanding",
                    "type": "String"
                  },
                  {
                    "name": "dividendFrequency",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "underlyingSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "firstCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "dayOfMonthOverride",
                    "type": "String"
                  },
                  {
                    "name": "couponDayOfMonth",
                    "type": "String"
                  },
                  {
                    "name": "nextCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "businessDayConvention",
                    "type": "String"
                  },
                  {
                    "name": "maturityPrice",
                    "type": "String"
                  },
                  {
                    "name": "bondCallaableIndicator",
                    "type": "String"
                  },
                  {
                    "name": "bondPutableIndicator",
                    "type": "String"
                  },
                  {
                    "name": "amountIssued",
                    "type": "String"
                  },
                  {
                    "name": "demandFeatureIndicator",
                    "type": "String"
                  },
                  {
                    "name": "conversionStartDate",
                    "type": "String"
                  },
                  {
                    "name": "conversionEndDate",
                    "type": "String"
                  },
                  {
                    "name": "conversionRatio",
                    "type": "String"
                  },
                  {
                    "name": "convertibleSecurityIndicator",
                    "type": "String"
                  },
                  {
                    "name": "delayDays",
                    "type": "String"
                  },
                  {
                    "name": "cusip",
                    "type": "String"
                  },
                  {
                    "name": "isin",
                    "type": "String"
                  },
                  {
                    "name": "stockExchangeDailyOfficialList",
                    "type": "String"
                  },
                  {
                    "name": "factor",
                    "type": "String"
                  },
                  {
                    "name": "factorDate",
                    "type": "String"
                  },
                  {
                    "name": "couponFrequency",
                    "type": "String"
                  },
                  {
                    "name": "resetDate",
                    "type": "String"
                  },
                  {
                    "name": "redemptionDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizationMethod",
                    "type": "String"
                  },
                  {
                    "name": "issuePrice",
                    "type": "String"
                  },
                  {
                    "name": "productExchangeCode",
                    "type": "String"
                  },
                  {
                    "name": "callPutIndicator",
                    "type": "String"
                  },
                  {
                    "name": "stateCode",
                    "type": "String"
                  },
                  {
                    "name": "stateName",
                    "type": "String"
                  },
                  {
                    "name": "rule144aIndicator",
                    "type": "String"
                  },
                  {
                    "name": "alternativeMinimumTaxIndicator",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorClientIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "federalTaxIndicator",
                    "type": "String"
                  },
                  {
                    "name": "redCode",
                    "type": "String"
                  },
                  {
                    "name": "payReceiveIndicatorSecurity",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIssueIdentifiers",
                    "type": "String"
                  },
                  {
                    "name": "clientSecuritySynonym",
                    "type": "String"
                  },
                  {
                    "name": "issueDescription",
                    "type": "String"
                  },
                  {
                    "name": "couponTypeDescription",
                    "type": "String"
                  },
                  {
                    "name": "optionsMaturityDate",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrencyName",
                    "type": "String"
                  },
                  {
                    "name": "securityYield",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceQuote",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "issueTypeDescription",
                    "type": "String"
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
            "name": "IssuersResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "issuers",
                "type": [
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerName",
                    "type": "String"
                  },
                  {
                    "name": "ultimateParentIssuer",
                    "type": "String"
                  },
                  {
                    "name": "ultimateIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "countryOfDomicile",
                    "type": "String"
                  },
                  {
                    "name": "countryOfRisk",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "classification",
                    "type": [
                      {
                        "name": "issuerIndustryGroup",
                        "type": "String"
                      },
                      {
                        "name": "issuerGlobalIndustryClassificationSystemIndustry",
                        "type": "String"
                      },
                      {
                        "name": "issuerIndustry",
                        "type": "String"
                      },
                      {
                        "name": "issuerIndustrySubgroup",
                        "type": "String"
                      },
                      {
                        "name": "globalIndustryClassificationSystemSector",
                        "type": "String"
                      },
                      {
                        "name": "globalIndustryClassificationSystemSectorName",
                        "type": "String"
                      },
                      {
                        "name": "globalIndustryClassificationSystemIndustryGroup",
                        "type": "String"
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
            "parameters": [
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
                "name": "primaryIssuerIdentifier",
                "description": "primaryIssuerIdentifier is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
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
            "name": "IssuerDetails",
            "response": [
              {
                "name": "issuers",
                "type": [
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerName",
                    "type": "String"
                  },
                  {
                    "name": "ultimateParentIssuer",
                    "type": "String"
                  },
                  {
                    "name": "ultimateIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "countryOfDomicile",
                    "type": "String"
                  },
                  {
                    "name": "countryOfRisk",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "classification",
                    "type": [
                      {
                        "name": "issuerIndustryGroup",
                        "type": "String"
                      },
                      {
                        "name": "issuerGlobalIndustryClassificationSystemIndustry",
                        "type": "String"
                      },
                      {
                        "name": "issuerIndustry",
                        "type": "String"
                      },
                      {
                        "name": "issuerIndustrySubgroup",
                        "type": "String"
                      },
                      {
                        "name": "globalIndustryClassificationSystemSector",
                        "type": "String"
                      },
                      {
                        "name": "globalIndustryClassificationSystemSectorName",
                        "type": "String"
                      },
                      {
                        "name": "globalIndustryClassificationSystemIndustryGroup",
                        "type": "String"
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
            "parameters": [
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
                "name": "primarySecurityIdentifier",
                "description": "primarySecurityIdentifier is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
              },
              {
                "name": "primarySecurityIdentifierType",
                "description": "primarySecurityIdentifierType is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
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
            "name": "SecurityDetails",
            "response": [
              {
                "name": "securities",
                "type": [
                  {
                    "name": "ratings",
                    "type": [
                      {
                        "name": "moodysRating",
                        "type": "String"
                      },
                      {
                        "name": "standardAndPoorsRating",
                        "type": "String"
                      },
                      {
                        "name": "fitchRating",
                        "type": "String"
                      }
                    ]
                  },
                  {
                    "name": "securityClassification",
                    "type": [
                      {
                        "name": "securityTypeCode",
                        "type": "String"
                      },
                      {
                        "name": "securityDescription",
                        "type": "String"
                      },
                      {
                        "name": "contractMultiplier",
                        "type": "String"
                      },
                      {
                        "name": "investmentTypeCode",
                        "type": "String"
                      },
                      {
                        "name": "issueUnitOfMeasure",
                        "type": "String"
                      },
                      {
                        "name": "issuePricingMultiplier",
                        "type": "String"
                      },
                      {
                        "name": "alternativeIssueIdentifier",
                        "type": "String"
                      },
                      {
                        "name": "assetGroup",
                        "type": "String"
                      }
                    ]
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerName",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "issueDate",
                    "type": "String"
                  },
                  {
                    "name": "clientSecuritySyn",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssueDomicile",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "currencyName",
                    "type": "String"
                  },
                  {
                    "name": "securityCurrency",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "poolNumber",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "couponType",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "sharesOutstanding",
                    "type": "String"
                  },
                  {
                    "name": "dividendFrequency",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "underlyingSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "firstCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "dayOfMonthOverride",
                    "type": "String"
                  },
                  {
                    "name": "couponDayOfMonth",
                    "type": "String"
                  },
                  {
                    "name": "nextCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "businessDayConvention",
                    "type": "String"
                  },
                  {
                    "name": "maturityPrice",
                    "type": "String"
                  },
                  {
                    "name": "bondCallaableIndicator",
                    "type": "String"
                  },
                  {
                    "name": "bondPutableIndicator",
                    "type": "String"
                  },
                  {
                    "name": "amountIssued",
                    "type": "String"
                  },
                  {
                    "name": "demandFeatureIndicator",
                    "type": "String"
                  },
                  {
                    "name": "conversionStartDate",
                    "type": "String"
                  },
                  {
                    "name": "conversionEndDate",
                    "type": "String"
                  },
                  {
                    "name": "conversionRatio",
                    "type": "String"
                  },
                  {
                    "name": "convertibleSecurityIndicator",
                    "type": "String"
                  },
                  {
                    "name": "delayDays",
                    "type": "String"
                  },
                  {
                    "name": "cusip",
                    "type": "String"
                  },
                  {
                    "name": "isin",
                    "type": "String"
                  },
                  {
                    "name": "stockExchangeDailyOfficialList",
                    "type": "String"
                  },
                  {
                    "name": "factor",
                    "type": "String"
                  },
                  {
                    "name": "factorDate",
                    "type": "String"
                  },
                  {
                    "name": "couponFrequency",
                    "type": "String"
                  },
                  {
                    "name": "resetDate",
                    "type": "String"
                  },
                  {
                    "name": "redemptionDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizationMethod",
                    "type": "String"
                  },
                  {
                    "name": "issuePrice",
                    "type": "String"
                  },
                  {
                    "name": "productExchangeCode",
                    "type": "String"
                  },
                  {
                    "name": "callPutIndicator",
                    "type": "String"
                  },
                  {
                    "name": "stateCode",
                    "type": "String"
                  },
                  {
                    "name": "stateName",
                    "type": "String"
                  },
                  {
                    "name": "rule144aIndicator",
                    "type": "String"
                  },
                  {
                    "name": "alternativeMinimumTaxIndicator",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorClientIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "federalTaxIndicator",
                    "type": "String"
                  },
                  {
                    "name": "redCode",
                    "type": "String"
                  },
                  {
                    "name": "payReceiveIndicatorSecurity",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIssueIdentifiers",
                    "type": "String"
                  },
                  {
                    "name": "clientSecuritySynonym",
                    "type": "String"
                  },
                  {
                    "name": "issueDescription",
                    "type": "String"
                  },
                  {
                    "name": "couponTypeDescription",
                    "type": "String"
                  },
                  {
                    "name": "optionsMaturityDate",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrencyName",
                    "type": "String"
                  },
                  {
                    "name": "securityYield",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceQuote",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "issueTypeDescription",
                    "type": "String"
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
                "name": "primaryIssuerIdentifier",
                "description": "primaryIssuerIdentifier is optional field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "correspondingPrimaryIssueIdentifier",
                "description": "Corresponding Primary Issue Identifier is optional field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "from",
                "description": "From date is a mandatory field",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "to",
                "description": "To date is a mandatory field",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
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
            "name": "CorporateActionsDetailsResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "corporateActions",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionMonthEndAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "blockOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "cancelIndicator",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "positionLongShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionQuantity",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lotLevelPositionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionUnits",
                    "type": "String"
                  },
                  {
                    "name": "dividendExDate",
                    "type": "String"
                  },
                  {
                    "name": "foreignExchangeSpotRate",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionShares",
                    "type": "String"
                  },
                  {
                    "name": "correspondingSystemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "correspondingTickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "correspondingPrimaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "corporationActionFinalPositionQuantity",
                    "type": "String"
                  },
                  {
                    "name": "correspondingPostCorpActionEventPrice",
                    "type": "String"
                  },
                  {
                    "name": "postCorpActionPrice",
                    "type": "String"
                  },
                  {
                    "name": "correspondingCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "correspondingCostBase",
                    "type": "String"
                  },
                  {
                    "name": "correspondingIssueName",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionConversionFactor",
                    "type": "String"
                  },
                  {
                    "name": "toIssueName",
                    "type": "String"
                  },
                  {
                    "name": "dividendRate",
                    "type": "String"
                  },
                  {
                    "name": "announcementDate",
                    "type": "String"
                  },
                  {
                    "name": "dividendPayDate",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionCashConversionFactor",
                    "type": "String"
                  },
                  {
                    "name": "dateOfRecord",
                    "type": "String"
                  },
                  {
                    "name": "ratioFromCorpActionShares",
                    "type": "String"
                  },
                  {
                    "name": "ratioToCorpActionShares",
                    "type": "String"
                  },
                  {
                    "name": "mandatoryVoluntaryIndicator",
                    "type": "String"
                  },
                  {
                    "name": "receivableOrPayableAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "receivableOrPayableAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "transactionCode",
                    "type": "String"
                  },
                  {
                    "name": "fractionalSharesIndicator",
                    "type": "String"
                  },
                  {
                    "name": "bookValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "bookValueBase",
                    "type": "String"
                  },
                  {
                    "name": "transactionCancelStatus",
                    "type": "String"
                  },
                  {
                    "name": "corporateIdentifierClientSpecific",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionProcessingPriority",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionProcessingStatus",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionEventSequence",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "domain": "Positions",
      "operations": [
        {
          "operation": "getDailyLotLevelDetails",
          "methodType": "POST",
          "description": "gets DailyLotLevel details based on filter values. if no value is provided all records will be returned. DailyLotFilter is required.",
          "request": {
            "name": "dailyLotFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "asOfDate",
                "description": "As of Date is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
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
                "name": "issueIdentifier",
                "description": "Optional Issue Identifier, if not provided all Issue Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "issuerIdentifier",
                "description": "Optional Issuer Identifier, if not provided all Issuer Identifiers will be captured.",
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
            "name": "PositionsDailyLotResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "positionsLot",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "productExchangeCode",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "optionsMaturityDate",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "securityYield",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceQuote",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "blockOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "openTransactionDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionLocalCost",
                    "type": "String"
                  },
                  {
                    "name": "originalTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "tradePrice",
                    "type": "String"
                  },
                  {
                    "name": "earliestTradeDateOfOriginalBuy",
                    "type": "String"
                  },
                  {
                    "name": "transactionTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lotLevelPositionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "positionDate",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "positionLongShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "lotLevelCorpActions",
                    "type": "String"
                  },
                  {
                    "name": "openSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "commissionAmount",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "positionSettlementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "accountBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "settlementExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "exchangeSpotRate",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "actualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "positionPrice",
                    "type": "String"
                  },
                  {
                    "name": "positionQuantity",
                    "type": "String"
                  },
                  {
                    "name": "closingFeeBase",
                    "type": "String"
                  },
                  {
                    "name": "closingFeeLocal",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "purchasedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "marketPrice",
                    "type": "String"
                  },
                  {
                    "name": "fxRate",
                    "type": "String"
                  },
                  {
                    "name": "marketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "marketValueBase",
                    "type": "String"
                  },
                  {
                    "name": "localUnrealizedSecurityGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedSecurityGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseTotalUnrealizedGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalPeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "clearingBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "buySellIndicator",
                    "type": "String"
                  },
                  {
                    "name": "originalBaseCost",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "feesCharges",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "tipsIndexRatio",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "tradeYieldToCall",
                    "type": "String"
                  },
                  {
                    "name": "notionalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalCost",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValue",
                    "type": "String"
                  },
                  {
                    "name": "notionalLocalUnrealizedGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedCurrencyGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedSecurityGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "issueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "spotRateIndicator",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "cancelTransactionProcessingDate",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "dtcCusip",
                    "type": "String"
                  },
                  {
                    "name": "investmentType",
                    "type": "String"
                  },
                  {
                    "name": "stateCode",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIncorporation",
                    "type": "String"
                  },
                  {
                    "name": "countryTax",
                    "type": "String"
                  },
                  {
                    "name": "countryOfDomicile",
                    "type": "String"
                  },
                  {
                    "name": "incomeCurrency",
                    "type": "String"
                  },
                  {
                    "name": "datedDate",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "daysToMaturity",
                    "type": "String"
                  },
                  {
                    "name": "interestRate",
                    "type": "String"
                  },
                  {
                    "name": "couponDate",
                    "type": "String"
                  },
                  {
                    "name": "couponFrequency",
                    "type": "String"
                  },
                  {
                    "name": "businessDayConvention",
                    "type": "String"
                  },
                  {
                    "name": "moodysRating",
                    "type": "String"
                  },
                  {
                    "name": "standardAndPoorsRating",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMajor",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMinor",
                    "type": "String"
                  },
                  {
                    "name": "poolType",
                    "type": "String"
                  },
                  {
                    "name": "poolNumber",
                    "type": "String"
                  },
                  {
                    "name": "masterFundDescription",
                    "type": "String"
                  },
                  {
                    "name": "positionRecordType",
                    "type": "String"
                  },
                  {
                    "name": "nextCallDate",
                    "type": "String"
                  },
                  {
                    "name": "callPriceBond",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountDate",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBond",
                    "type": "String"
                  },
                  {
                    "name": "whenIssuedIndicator",
                    "type": "String"
                  },
                  {
                    "name": "issueAtParIndicator",
                    "type": "String"
                  },
                  {
                    "name": "callPutIndicator",
                    "type": "String"
                  },
                  {
                    "name": "dailyLimitIndicator",
                    "type": "String"
                  },
                  {
                    "name": "yankeeEuroIndicator",
                    "type": "String"
                  },
                  {
                    "name": "underlyingCUSIP",
                    "type": "String"
                  },
                  {
                    "name": "issueExerciseDate",
                    "type": "String"
                  },
                  {
                    "name": "expirationDate",
                    "type": "String"
                  },
                  {
                    "name": "tradeDate",
                    "type": "String"
                  },
                  {
                    "name": "contractualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "issueClass",
                    "type": "String"
                  },
                  {
                    "name": "shareClassIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "taxStatus",
                    "type": "String"
                  },
                  {
                    "name": "sharesParValue",
                    "type": "String"
                  },
                  {
                    "name": "contractQuantity",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValuePosition",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "unitCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "exchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "daysAmortized",
                    "type": "String"
                  },
                  {
                    "name": "closingTotalAmortizationBase",
                    "type": "String"
                  },
                  {
                    "name": "closingTotalAmortizationLocal",
                    "type": "String"
                  },
                  {
                    "name": "baseAmortizationCurrencyGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "exchangeRateDate",
                    "type": "String"
                  },
                  {
                    "name": "interestAccrualDate",
                    "type": "String"
                  },
                  {
                    "name": "daysOfInterestAccrued",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBase",
                    "type": "String"
                  },
                  {
                    "name": "accrualTypeIndicator",
                    "type": "String"
                  },
                  {
                    "name": "accrualTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "localTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "localTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "interestBaseAmount",
                    "type": "String"
                  },
                  {
                    "name": "firstCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "lastCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "nextCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceDateTime",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSource",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSourceCode",
                    "type": "String"
                  },
                  {
                    "name": "sellCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "offerYield",
                    "type": "String"
                  },
                  {
                    "name": "amortizationMethod",
                    "type": "String"
                  },
                  {
                    "name": "dividendPerShare",
                    "type": "String"
                  },
                  {
                    "name": "dividendExDate",
                    "type": "String"
                  },
                  {
                    "name": "dividendExpenseCurrentMonth",
                    "type": "String"
                  },
                  {
                    "name": "settlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "fundReferenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "tradeCurrency",
                    "type": "String"
                  },
                  {
                    "name": "swapLegIndicator",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueSize",
                    "type": "String"
                  },
                  {
                    "name": "originalExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "bloombergIndustryClassificationSystemSector",
                    "type": "String"
                  },
                  {
                    "name": "bloombergIndustryClassificationSystemGroup",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getMonthlyLotLevelDetails",
          "methodType": "POST",
          "description": "get MonthlyLotLevel details based on filter values. if no value is provided all records will be returned. MonthlyLotFilter is required.",
          "request": {
            "name": "monthlyLotFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "month",
                "description": "month is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "year",
                "description": "year is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
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
                "name": "issueIdentifier",
                "description": "Optional Issue Identifier, if not provided all Issue Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "issuerIdentifier",
                "description": "Optional Issuer Identifier, if not provided all Issuer Identifiers will be captured.",
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
            "name": "PositionsMonthlyLotResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "positionsLot",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "productExchangeCode",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "optionsMaturityDate",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "securityYield",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceQuote",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "blockOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "openTransactionDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionLocalCost",
                    "type": "String"
                  },
                  {
                    "name": "originalTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "tradePrice",
                    "type": "String"
                  },
                  {
                    "name": "earliestTradeDateOfOriginalBuy",
                    "type": "String"
                  },
                  {
                    "name": "transactionTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lotLevelPositionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "positionDate",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "positionLongShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "lotLevelCorpActions",
                    "type": "String"
                  },
                  {
                    "name": "openSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "commissionAmount",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "positionSettlementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "accountBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "settlementExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "exchangeSpotRate",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "actualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "positionPrice",
                    "type": "String"
                  },
                  {
                    "name": "positionQuantity",
                    "type": "String"
                  },
                  {
                    "name": "closingFeeBase",
                    "type": "String"
                  },
                  {
                    "name": "closingFeeLocal",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "purchasedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "marketPrice",
                    "type": "String"
                  },
                  {
                    "name": "fxRate",
                    "type": "String"
                  },
                  {
                    "name": "marketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "marketValueBase",
                    "type": "String"
                  },
                  {
                    "name": "localUnrealizedSecurityGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedSecurityGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseTotalUnrealizedGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalPeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "clearingBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "buySellIndicator",
                    "type": "String"
                  },
                  {
                    "name": "originalBaseCost",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "feesCharges",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "tipsIndexRatio",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "tradeYieldToCall",
                    "type": "String"
                  },
                  {
                    "name": "notionalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalCost",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValue",
                    "type": "String"
                  },
                  {
                    "name": "notionalLocalUnrealizedGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedCurrencyGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedSecurityGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "issueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "spotRateIndicator",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "cancelTransactionProcessingDate",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "dtcCusip",
                    "type": "String"
                  },
                  {
                    "name": "investmentType",
                    "type": "String"
                  },
                  {
                    "name": "stateCode",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIncorporation",
                    "type": "String"
                  },
                  {
                    "name": "countryTax",
                    "type": "String"
                  },
                  {
                    "name": "countryOfDomicile",
                    "type": "String"
                  },
                  {
                    "name": "incomeCurrency",
                    "type": "String"
                  },
                  {
                    "name": "datedDate",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "daysToMaturity",
                    "type": "String"
                  },
                  {
                    "name": "interestRate",
                    "type": "String"
                  },
                  {
                    "name": "couponDate",
                    "type": "String"
                  },
                  {
                    "name": "couponFrequency",
                    "type": "String"
                  },
                  {
                    "name": "businessDayConvention",
                    "type": "String"
                  },
                  {
                    "name": "moodysRating",
                    "type": "String"
                  },
                  {
                    "name": "standardAndPoorsRating",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMajor",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMinor",
                    "type": "String"
                  },
                  {
                    "name": "poolType",
                    "type": "String"
                  },
                  {
                    "name": "poolNumber",
                    "type": "String"
                  },
                  {
                    "name": "masterFundDescription",
                    "type": "String"
                  },
                  {
                    "name": "positionRecordType",
                    "type": "String"
                  },
                  {
                    "name": "nextCallDate",
                    "type": "String"
                  },
                  {
                    "name": "callPriceBond",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountDate",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBond",
                    "type": "String"
                  },
                  {
                    "name": "whenIssuedIndicator",
                    "type": "String"
                  },
                  {
                    "name": "issueAtParIndicator",
                    "type": "String"
                  },
                  {
                    "name": "callPutIndicator",
                    "type": "String"
                  },
                  {
                    "name": "dailyLimitIndicator",
                    "type": "String"
                  },
                  {
                    "name": "yankeeEuroIndicator",
                    "type": "String"
                  },
                  {
                    "name": "underlyingCUSIP",
                    "type": "String"
                  },
                  {
                    "name": "issueExerciseDate",
                    "type": "String"
                  },
                  {
                    "name": "expirationDate",
                    "type": "String"
                  },
                  {
                    "name": "tradeDate",
                    "type": "String"
                  },
                  {
                    "name": "contractualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "issueClass",
                    "type": "String"
                  },
                  {
                    "name": "shareClassIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "taxStatus",
                    "type": "String"
                  },
                  {
                    "name": "sharesParValue",
                    "type": "String"
                  },
                  {
                    "name": "contractQuantity",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValuePosition",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "unitCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "exchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "daysAmortized",
                    "type": "String"
                  },
                  {
                    "name": "closingTotalAmortizationBase",
                    "type": "String"
                  },
                  {
                    "name": "closingTotalAmortizationLocal",
                    "type": "String"
                  },
                  {
                    "name": "baseAmortizationCurrencyGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "exchangeRateDate",
                    "type": "String"
                  },
                  {
                    "name": "interestAccrualDate",
                    "type": "String"
                  },
                  {
                    "name": "daysOfInterestAccrued",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBase",
                    "type": "String"
                  },
                  {
                    "name": "accrualTypeIndicator",
                    "type": "String"
                  },
                  {
                    "name": "accrualTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "localTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "localTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "interestBaseAmount",
                    "type": "String"
                  },
                  {
                    "name": "firstCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "lastCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "nextCouponDate",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceDateTime",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSource",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSourceCode",
                    "type": "String"
                  },
                  {
                    "name": "sellCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "offerYield",
                    "type": "String"
                  },
                  {
                    "name": "amortizationMethod",
                    "type": "String"
                  },
                  {
                    "name": "dividendPerShare",
                    "type": "String"
                  },
                  {
                    "name": "dividendExDate",
                    "type": "String"
                  },
                  {
                    "name": "dividendExpenseCurrentMonth",
                    "type": "String"
                  },
                  {
                    "name": "settlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "fundReferenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "tradeCurrency",
                    "type": "String"
                  },
                  {
                    "name": "swapLegIndicator",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueSize",
                    "type": "String"
                  },
                  {
                    "name": "originalExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "bloombergIndustryClassificationSystemSector",
                    "type": "String"
                  },
                  {
                    "name": "bloombergIndustryClassificationSystemGroup",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getDailyPositionDetails",
          "methodType": "POST",
          "description": "get Daily Position details based on filter values. if no value is provided all records will be returned. DailyPortfolioFilter is required.",
          "request": {
            "name": "dailyPositionFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "asOfDate",
                "description": "As of Date is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
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
                "name": "issueIdentifier",
                "description": "Optional Issue Identifier, if not provided all Issue Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "issuerIdentifier",
                "description": "Optional Issuer Identifier, if not provided all Issuer Identifiers will be captured.",
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
            "name": "PositionsDailyPortfolioResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "positionsPortfolio",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueUnitOfMeasure",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "productExchangeCode",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "couponType",
                    "type": "String"
                  },
                  {
                    "name": "optionsMaturityDate",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "resetFrequency",
                    "type": "String"
                  },
                  {
                    "name": "issuePrice",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "underlyingSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "sinkingFundIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionRelatedUnderlyingIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "assetGroup",
                    "type": "String"
                  },
                  {
                    "name": "investmentType",
                    "type": "String"
                  },
                  {
                    "name": "couponTypeDescription",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "reportDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "positionLongShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "issuedOriginalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "fxExchangeSpotRate",
                    "type": "String"
                  },
                  {
                    "name": "positionQuantity",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLifeToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "accrualDeltaFromLastEarningsDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "settledCashBalance",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceDateTime",
                    "type": "String"
                  },
                  {
                    "name": "marketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "marketValueBase",
                    "type": "String"
                  },
                  {
                    "name": "unrealizedMarketGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "unrealizedMarketGainLossBase",
                    "type": "String"
                  },
                  {
                    "name": "baseTotalUnrealizedGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalPeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "deltaAccruedInterest",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "rule144AIndicator",
                    "type": "String"
                  },
                  {
                    "name": "buySellIndicator",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "tipsIndexRatio",
                    "type": "String"
                  },
                  {
                    "name": "payReceiveIndicatorPosition",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "deferredIncomeTotalPeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "deferredIncomeTotalPeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "positionPriceBase",
                    "type": "String"
                  },
                  {
                    "name": "positionTotalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "positionTotalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "positionAmortizationPrice",
                    "type": "String"
                  },
                  {
                    "name": "couponPaymentAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "couponPaymentAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyGain",
                    "type": "String"
                  },
                  {
                    "name": "localUnrealizedSecurityGain",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedSecurityGain",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyLoss",
                    "type": "String"
                  },
                  {
                    "name": "localUnrealizedSecurityLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedSecurityLoss",
                    "type": "String"
                  },
                  {
                    "name": "internationalOrganizationForStandardization3CurrencyText",
                    "type": "String"
                  },
                  {
                    "name": "notionalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalCost",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValue",
                    "type": "String"
                  },
                  {
                    "name": "unrealizedMarketGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedCurrencyGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedSecurityGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "priceLevel",
                    "type": "String"
                  },
                  {
                    "name": "positionDate",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "issueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "stateCode",
                    "type": "String"
                  },
                  {
                    "name": "registeredOfficeCountryCode",
                    "type": "String"
                  },
                  {
                    "name": "countryTax",
                    "type": "String"
                  },
                  {
                    "name": "principalOfficeCountryCode",
                    "type": "String"
                  },
                  {
                    "name": "issueDate",
                    "type": "String"
                  },
                  {
                    "name": "daysToMaturity",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBond",
                    "type": "String"
                  },
                  {
                    "name": "couponDate",
                    "type": "String"
                  },
                  {
                    "name": "couponFrequency",
                    "type": "String"
                  },
                  {
                    "name": "moodysRating",
                    "type": "String"
                  },
                  {
                    "name": "standardAndPoorsRating",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMajor",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMinor",
                    "type": "String"
                  },
                  {
                    "name": "poolType",
                    "type": "String"
                  },
                  {
                    "name": "masterFundDescription",
                    "type": "String"
                  },
                  {
                    "name": "tradeDate",
                    "type": "String"
                  },
                  {
                    "name": "contractualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "issueClass",
                    "type": "String"
                  },
                  {
                    "name": "shareClassIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "callPutIndicator",
                    "type": "String"
                  },
                  {
                    "name": "sharesParValue",
                    "type": "String"
                  },
                  {
                    "name": "contractQuantity",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValuePosition",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "unitCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "localTotalUnrealizedGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "marketPrice",
                    "type": "String"
                  },
                  {
                    "name": "fXRate",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSource",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSourceCode",
                    "type": "String"
                  },
                  {
                    "name": "sellCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "tradeFXTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "incomeCurrency",
                    "type": "String"
                  },
                  {
                    "name": "valuationTechniqueFairValues",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "cancelTransactionProcessingDate",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "dtcCusip",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getMonthlyPositionDetails",
          "methodType": "POST",
          "description": "get Monthly Position details based on filter values. if no value is provided all records will be returned. MonthlyPortfolioFilter is required.",
          "request": {
            "name": "monthlyPositionFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "month",
                "description": "month is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "year",
                "description": "year is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is a Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
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
                "name": "issueIdentifier",
                "description": "Optional Issue Identifier, if not provided all Issue Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "issuerIdentifier",
                "description": "Optional Issuer Identifier, if not provided all Issuer Identifiers will be captured.",
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
            "name": "PositionsMonthlyPortfolioResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "positionsPortfolio",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueUnitOfMeasure",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "productExchangeCode",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "couponType",
                    "type": "String"
                  },
                  {
                    "name": "optionsMaturityDate",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "resetFrequency",
                    "type": "String"
                  },
                  {
                    "name": "issuePrice",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "internalSecurityIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "underlyingSecurityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "sinkingFundIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionRelatedUnderlyingIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "assetGroup",
                    "type": "String"
                  },
                  {
                    "name": "investmentType",
                    "type": "String"
                  },
                  {
                    "name": "couponTypeDescription",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "reportDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "positionLongShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "issuedOriginalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "fxExchangeSpotRate",
                    "type": "String"
                  },
                  {
                    "name": "positionQuantity",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLifeToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "accrualDeltaFromLastEarningsDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "settledCashBalance",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceDateTime",
                    "type": "String"
                  },
                  {
                    "name": "marketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "marketValueBase",
                    "type": "String"
                  },
                  {
                    "name": "unrealizedMarketGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "unrealizedMarketGainLossBase",
                    "type": "String"
                  },
                  {
                    "name": "baseTotalUnrealizedGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalPeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "deltaAccruedInterest",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBasePeriodToDate",
                    "type": "String"
                  },
                  {
                    "name": "netInterestAccruedPeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "rule144AIndicator",
                    "type": "String"
                  },
                  {
                    "name": "buySellIndicator",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "incomeLifeToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "incomePeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "tipsIndexRatio",
                    "type": "String"
                  },
                  {
                    "name": "payReceiveIndicatorPosition",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "deferredIncomeTotalPeriodToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "deferredIncomeTotalPeriodToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "positionPriceBase",
                    "type": "String"
                  },
                  {
                    "name": "positionTotalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "positionTotalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "positionAmortizationPrice",
                    "type": "String"
                  },
                  {
                    "name": "couponPaymentAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "couponPaymentAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyGain",
                    "type": "String"
                  },
                  {
                    "name": "localUnrealizedSecurityGain",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedSecurityGain",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedCurrencyLoss",
                    "type": "String"
                  },
                  {
                    "name": "localUnrealizedSecurityLoss",
                    "type": "String"
                  },
                  {
                    "name": "baseUnrealizedSecurityLoss",
                    "type": "String"
                  },
                  {
                    "name": "internationalOrganizationForStandardization3CurrencyText",
                    "type": "String"
                  },
                  {
                    "name": "notionalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalCost",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalMarketValue",
                    "type": "String"
                  },
                  {
                    "name": "unrealizedMarketGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedCurrencyGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "notionalUnrealizedSecurityGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "priceLevel",
                    "type": "String"
                  },
                  {
                    "name": "positionDate",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "issueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "stateCode",
                    "type": "String"
                  },
                  {
                    "name": "registeredOfficeCountryCode",
                    "type": "String"
                  },
                  {
                    "name": "countryTax",
                    "type": "String"
                  },
                  {
                    "name": "principalOfficeCountryCode",
                    "type": "String"
                  },
                  {
                    "name": "issueDate",
                    "type": "String"
                  },
                  {
                    "name": "daysToMaturity",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBond",
                    "type": "String"
                  },
                  {
                    "name": "couponDate",
                    "type": "String"
                  },
                  {
                    "name": "couponFrequency",
                    "type": "String"
                  },
                  {
                    "name": "moodysRating",
                    "type": "String"
                  },
                  {
                    "name": "standardAndPoorsRating",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMajor",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMinor",
                    "type": "String"
                  },
                  {
                    "name": "poolType",
                    "type": "String"
                  },
                  {
                    "name": "masterFundDescription",
                    "type": "String"
                  },
                  {
                    "name": "tradeDate",
                    "type": "String"
                  },
                  {
                    "name": "contractualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "issueClass",
                    "type": "String"
                  },
                  {
                    "name": "shareClassIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "callPutIndicator",
                    "type": "String"
                  },
                  {
                    "name": "sharesParValue",
                    "type": "String"
                  },
                  {
                    "name": "contractQuantity",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValuePosition",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "unitCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "accruedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "localTotalUnrealizedGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "marketPrice",
                    "type": "String"
                  },
                  {
                    "name": "fXRate",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSource",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceSourceCode",
                    "type": "String"
                  },
                  {
                    "name": "sellCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "tradeFXTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "incomeCurrency",
                    "type": "String"
                  },
                  {
                    "name": "valuationTechniqueFairValues",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "cancelTransactionProcessingDate",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "dtcCusip",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "domain": "transactions",
      "operations": [
        {
          "operation": "getTransactionsDaily",
          "methodType": "POST",
          "description": "gets TransactionsDaily details based on filter values. if no value is provided all records will be returned. dailyFilter is required.",
          "request": {
            "name": "dailyTransactionsFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "asOfDate",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
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
                "name": "primaryIssueIdentifier",
                "description": "Optional primaryIssueIdentifier, if not provided all primaryIssue Identifiers will be captured.",
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
            "name": "TransactionsDailyResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "transactions",
                "type": [
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "issueDescription",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueUnitOfMeasure",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIssueIdentifiers",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "couponType",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "lotLevelPositionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportStartDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportEndDate",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionConversionFactor",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionCashRatePerShare",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "resetFrequency",
                    "type": "String"
                  },
                  {
                    "name": "investmentType",
                    "type": "String"
                  },
                  {
                    "name": "assetGroup",
                    "type": "String"
                  },
                  {
                    "name": "couponTypeDescription",
                    "type": "String"
                  },
                  {
                    "name": "orderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "originalTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "actualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "blockOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "eventTypeIndicator",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionType",
                    "type": "String"
                  },
                  {
                    "name": "alternateTransactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "tradeReviewedDateTime",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "transactionMonthEndAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "longShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "taxLotMethodSellingConvention",
                    "type": "String"
                  },
                  {
                    "name": "orderQuantity",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "tradePrice",
                    "type": "String"
                  },
                  {
                    "name": "commissionAmount",
                    "type": "String"
                  },
                  {
                    "name": "secFees",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "netGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "transactionSettlementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "yieldToMaturityAtPurchase",
                    "type": "String"
                  },
                  {
                    "name": "enterpriseBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "fxContractRate",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "baseOriginalUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedLocal",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedGainOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedLossOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "currencyGainAmount",
                    "type": "String"
                  },
                  {
                    "name": "currencyLossAmount",
                    "type": "String"
                  },
                  {
                    "name": "realizedGainOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "realizedLossOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "earliestTradeDateOfOriginalBuy",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "netSettlementAmount",
                    "type": "String"
                  },
                  {
                    "name": "brokerName",
                    "type": "String"
                  },
                  {
                    "name": "clearingBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "buySellIndicator",
                    "type": "String"
                  },
                  {
                    "name": "feesCharges",
                    "type": "String"
                  },
                  {
                    "name": "productNonDeliverableForwardIndicator",
                    "type": "String"
                  },
                  {
                    "name": "payReceiveIndicatorPosition",
                    "type": "String"
                  },
                  {
                    "name": "gainLossDisposalAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "gainLossDisposalAmount",
                    "type": "String"
                  },
                  {
                    "name": "feeAmountsLocal",
                    "type": "String"
                  },
                  {
                    "name": "feeAmountsBase",
                    "type": "String"
                  },
                  {
                    "name": "internationalOrganizationForStandardization2CountryText",
                    "type": "String"
                  },
                  {
                    "name": "tradeYieldToCall",
                    "type": "String"
                  },
                  {
                    "name": "cancelIndicator",
                    "type": "String"
                  },
                  {
                    "name": "gainOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "lossOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "totalGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "currencyName",
                    "type": "String"
                  },
                  {
                    "name": "feeRate",
                    "type": "String"
                  },
                  {
                    "name": "principalAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "principalAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "spotRateIndicator",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "cancelledTradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "tradeDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionCode",
                    "type": "String"
                  },
                  {
                    "name": "transactionTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "contractualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "settlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "clearingSettlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "countryTax",
                    "type": "String"
                  },
                  {
                    "name": "tradeFXtypecode",
                    "type": "String"
                  },
                  {
                    "name": "sharesParValue",
                    "type": "String"
                  },
                  {
                    "name": "fundReferenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "brokerReason",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMajor",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMinor",
                    "type": "String"
                  },
                  {
                    "name": "fxTradeIndicator",
                    "type": "String"
                  },
                  {
                    "name": "registeredAgentNumber",
                    "type": "String"
                  },
                  {
                    "name": "restrictedSecurityIndicator",
                    "type": "String"
                  },
                  {
                    "name": "saleAmortizationBase",
                    "type": "String"
                  },
                  {
                    "name": "saleAmortizationLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValuePosition",
                    "type": "String"
                  },
                  {
                    "name": "interestSettlementAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "purchasedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "localTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "contractSize",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "taxLotReliefMethod",
                    "type": "String"
                  },
                  {
                    "name": "gainLossDisposalAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitPrice",
                    "type": "String"
                  },
                  {
                    "name": "interestBaseAmount",
                    "type": "String"
                  },
                  {
                    "name": "otherFees",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "amortCostBase",
                    "type": "String"
                  },
                  {
                    "name": "purchaseAmortizationBase",
                    "type": "String"
                  },
                  {
                    "name": "unitCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "soldInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "localTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "transactionCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "purchaseAmortizationLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "settleCurrency",
                    "type": "String"
                  },
                  {
                    "name": "gainLossSettleAmount",
                    "type": "String"
                  },
                  {
                    "name": "settlementExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "transactionAverageCostBase",
                    "type": "String"
                  },
                  {
                    "name": "longTermGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "shortTermGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "transactionAverageCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "longTermGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "shortTermGainLossLocal",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getTransactionsMonthly",
          "methodType": "POST",
          "description": "get TransactionsMonthly details based on filter values. if no value is provided all records will be returned. MonthlyFilter is required.",
          "request": {
            "name": "monthlyTransactionsFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "month",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "year",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
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
                "name": "primaryIssueIdentifier",
                "description": "Optional primaryIssueIdentifier, if not provided all primaryIssue Identifiers will be captured.",
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
            "name": "TransactionsMonthlyResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "transactions",
                "type": [
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "issueDescription",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueUnitOfMeasure",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIssueIdentifiers",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "couponType",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "lotLevelPositionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportStartDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportEndDate",
                    "type": "String"
                  },
                  {
                    "name": "dayCountBasis",
                    "type": "String"
                  },
                  {
                    "name": "paymentFrequencyCodeFixedIncome",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionConversionFactor",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionCashRatePerShare",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "resetFrequency",
                    "type": "String"
                  },
                  {
                    "name": "investmentType",
                    "type": "String"
                  },
                  {
                    "name": "assetGroup",
                    "type": "String"
                  },
                  {
                    "name": "couponTypeDescription",
                    "type": "String"
                  },
                  {
                    "name": "orderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "originalTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "actualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "blockOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "eventTypeIndicator",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionType",
                    "type": "String"
                  },
                  {
                    "name": "alternateTransactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "tradeReviewedDateTime",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "transactionMonthEndAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "longShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "taxLotMethodSellingConvention",
                    "type": "String"
                  },
                  {
                    "name": "orderQuantity",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "tradePrice",
                    "type": "String"
                  },
                  {
                    "name": "commissionAmount",
                    "type": "String"
                  },
                  {
                    "name": "secFees",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "netGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "transactionSettlementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "yieldToMaturityAtPurchase",
                    "type": "String"
                  },
                  {
                    "name": "enterpriseBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "fxContractRate",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "baseOriginalUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "notionalAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedLocal",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedGainOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedLossOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "currencyGainAmount",
                    "type": "String"
                  },
                  {
                    "name": "currencyLossAmount",
                    "type": "String"
                  },
                  {
                    "name": "realizedGainOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "realizedLossOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "earliestTradeDateOfOriginalBuy",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "netSettlementAmount",
                    "type": "String"
                  },
                  {
                    "name": "brokerName",
                    "type": "String"
                  },
                  {
                    "name": "clearingBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "buySellIndicator",
                    "type": "String"
                  },
                  {
                    "name": "feesCharges",
                    "type": "String"
                  },
                  {
                    "name": "productNonDeliverableForwardIndicator",
                    "type": "String"
                  },
                  {
                    "name": "payReceiveIndicatorPosition",
                    "type": "String"
                  },
                  {
                    "name": "gainLossDisposalAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "gainLossDisposalAmount",
                    "type": "String"
                  },
                  {
                    "name": "feeAmountsLocal",
                    "type": "String"
                  },
                  {
                    "name": "feeAmountsBase",
                    "type": "String"
                  },
                  {
                    "name": "internationalOrganizationForStandardization2CountryText",
                    "type": "String"
                  },
                  {
                    "name": "tradeYieldToCall",
                    "type": "String"
                  },
                  {
                    "name": "cancelIndicator",
                    "type": "String"
                  },
                  {
                    "name": "gainOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "lossOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "totalGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "currencyName",
                    "type": "String"
                  },
                  {
                    "name": "feeRate",
                    "type": "String"
                  },
                  {
                    "name": "principalAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "principalAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "spotRateIndicator",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "cancelledTradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "tradeDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionCode",
                    "type": "String"
                  },
                  {
                    "name": "transactionTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "contractualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "settlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "clearingSettlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "countryTax",
                    "type": "String"
                  },
                  {
                    "name": "tradeFXtypecode",
                    "type": "String"
                  },
                  {
                    "name": "sharesParValue",
                    "type": "String"
                  },
                  {
                    "name": "fundReferenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "brokerReason",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMajor",
                    "type": "String"
                  },
                  {
                    "name": "standardIndustrialClassificationCodeMinor",
                    "type": "String"
                  },
                  {
                    "name": "fxTradeIndicator",
                    "type": "String"
                  },
                  {
                    "name": "registeredAgentNumber",
                    "type": "String"
                  },
                  {
                    "name": "restrictedSecurityIndicator",
                    "type": "String"
                  },
                  {
                    "name": "saleAmortizationBase",
                    "type": "String"
                  },
                  {
                    "name": "saleAmortizationLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValuePosition",
                    "type": "String"
                  },
                  {
                    "name": "interestSettlementAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "purchasedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "baseTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "localTaxReclaimAmount",
                    "type": "String"
                  },
                  {
                    "name": "contractSize",
                    "type": "String"
                  },
                  {
                    "name": "strikePrice",
                    "type": "String"
                  },
                  {
                    "name": "taxLotReliefMethod",
                    "type": "String"
                  },
                  {
                    "name": "gainLossDisposalAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitPrice",
                    "type": "String"
                  },
                  {
                    "name": "interestBaseAmount",
                    "type": "String"
                  },
                  {
                    "name": "otherFees",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "amortCostBase",
                    "type": "String"
                  },
                  {
                    "name": "purchaseAmortizationBase",
                    "type": "String"
                  },
                  {
                    "name": "unitCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "soldInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "localTaxExpense",
                    "type": "String"
                  },
                  {
                    "name": "transactionCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "purchaseAmortizationLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "settleCurrency",
                    "type": "String"
                  },
                  {
                    "name": "gainLossSettleAmount",
                    "type": "String"
                  },
                  {
                    "name": "settlementExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "transactionAverageCostBase",
                    "type": "String"
                  },
                  {
                    "name": "longTermGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "shortTermGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "transactionAverageCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "longTermGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "shortTermGainLossLocal",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getDailyDisposalLotLevelTransactions",
          "methodType": "POST",
          "description": "gets daily DisposalLotLevelTransactions Transactions based on filter values. DisposalLotLevelFilter is required.",
          "request": {
            "name": "disposalLotLevelFilterDaily",
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
                "description": "asOfDate is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional fundID, if not provided all fundIDs will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "adminName",
                "description": "Optional admin, if not provided all admins will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "primaryIssueIdentifier",
                "description": "Optional primaryIssueIdentifier, if not provided all primaryIssue Identifiers will be captured.",
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
            "name": "DisposalLotLevelTransactionsResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "disposalLotLevelTransactions",
                "type": [
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "originalTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "positionPrice",
                    "type": "String"
                  },
                  {
                    "name": "positionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "openSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "shareClassFullName",
                    "type": "String"
                  },
                  {
                    "name": "positionLongShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "openTransactionDate",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "positionLotCrossReferenceIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lotReliefMethod",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "monthEndAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "issuedOriginalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "settlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "netGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "transactionCode",
                    "type": "String"
                  },
                  {
                    "name": "positionSettlementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "netSettlementAmount",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "settlementExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "accountingPositionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "positionCloseUnitPrice",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedLocal",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedBase",
                    "type": "String"
                  },
                  {
                    "name": "closeTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "gainLossSettleIndicator",
                    "type": "String"
                  },
                  {
                    "name": "originalTransactionOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "purchasedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "tipsIndexRatio",
                    "type": "String"
                  },
                  {
                    "name": "tipsIncomeLocal",
                    "type": "String"
                  },
                  {
                    "name": "tipsIncomeBase",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBase",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "feesCharges",
                    "type": "String"
                  },
                  {
                    "name": "gainOnCurrencyUnderRule988",
                    "type": "String"
                  },
                  {
                    "name": "lossOnCurrencyUnderRule988",
                    "type": "String"
                  },
                  {
                    "name": "alternateTransactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyGainOnInterest",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyLossOnInterest",
                    "type": "String"
                  },
                  {
                    "name": "currencyGainAmount",
                    "type": "String"
                  },
                  {
                    "name": "gainOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "gainOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "currencyLossAmountLotLevel",
                    "type": "String"
                  },
                  {
                    "name": "lossOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "lossOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "totalGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getMonthlyDisposalLotLevelTransactions",
          "methodType": "POST",
          "description": "gets monthly DisposalLotLevelTransactions Transactions based on filter values. DisposalLotLevelFilter is required.",
          "request": {
            "name": "disposalLotLevelFilterMonthly",
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
                "name": "month",
                "description": "month is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "year",
                "description": "year is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional fundID, if not provided all fundIDs will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "adminName",
                "description": "Optional admin, if not provided all admins will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "primaryIssueIdentifier",
                "description": "Optional primaryIssueIdentifier, if not provided all primaryIssue Identifiers will be captured.",
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
            "name": "DisposalLotLevelTransactionsResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "disposalLotLevelTransactions",
                "type": [
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "originalTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "positionPrice",
                    "type": "String"
                  },
                  {
                    "name": "positionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "openSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "lotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "shareClassFullName",
                    "type": "String"
                  },
                  {
                    "name": "positionLongShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "openTransactionDate",
                    "type": "String"
                  },
                  {
                    "name": "positionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "positionLotCrossReferenceIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lotReliefMethod",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "monthEndAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "issuedOriginalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "settlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "tradedInterestLocal",
                    "type": "String"
                  },
                  {
                    "name": "netGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "transactionCode",
                    "type": "String"
                  },
                  {
                    "name": "positionSettlementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "netSettlementAmount",
                    "type": "String"
                  },
                  {
                    "name": "fundBaseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "settlementExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "accountingPositionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "positionCloseUnitPrice",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedLocal",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedBase",
                    "type": "String"
                  },
                  {
                    "name": "closeTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "gainLossSettleIndicator",
                    "type": "String"
                  },
                  {
                    "name": "originalTransactionOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "purchasedInterestAmount",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "tipsIndexRatio",
                    "type": "String"
                  },
                  {
                    "name": "tipsIncomeLocal",
                    "type": "String"
                  },
                  {
                    "name": "tipsIncomeBase",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "originalCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalIssueDiscountBase",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocalLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBaseLifeToDate",
                    "type": "String"
                  },
                  {
                    "name": "feesCharges",
                    "type": "String"
                  },
                  {
                    "name": "gainOnCurrencyUnderRule988",
                    "type": "String"
                  },
                  {
                    "name": "lossOnCurrencyUnderRule988",
                    "type": "String"
                  },
                  {
                    "name": "alternateTransactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyGainOnInterest",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyLossOnInterest",
                    "type": "String"
                  },
                  {
                    "name": "currencyGainAmount",
                    "type": "String"
                  },
                  {
                    "name": "gainOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "gainOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "currencyLossAmountLotLevel",
                    "type": "String"
                  },
                  {
                    "name": "lossOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "lossOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "totalGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getRGLTransactions",
          "methodType": "POST",
          "description": "gets RGLTransactions based on filter values. RGLFilter is required.",
          "request": {
            "name": "rglFilter",
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
                "description": "asOfDate is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional fundIdentifier, if not provided all fundIDs will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "adminName",
                "description": "Optional admin, if not provided all admins will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "primaryIssueIdentifier",
                "description": "Optional primaryIssueIdentifier, if not provided all primary IssueIdentifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "primaryIssuerIdentifier",
                "description": "Optional primaryIssuerIdentifier, if not provided all primary IssuerIdentifiers will be captured.",
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
            "name": "RGLTransactionsResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "rglTransactions",
                "type": [
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "shareClassFullName",
                    "type": "String"
                  },
                  {
                    "name": "shareClassDesignation",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "couponRate",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssueDomicile",
                    "type": "String"
                  },
                  {
                    "name": "countryOfIssue",
                    "type": "String"
                  },
                  {
                    "name": "securityDescription",
                    "type": "String"
                  },
                  {
                    "name": "issuePricingMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "contractMultiplier",
                    "type": "String"
                  },
                  {
                    "name": "securityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "compSecurityTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "clientSecuritySynonym",
                    "type": "String"
                  },
                  {
                    "name": "issuePrice",
                    "type": "String"
                  },
                  {
                    "name": "tickerSymbol",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "systemIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "currencyName",
                    "type": "String"
                  },
                  {
                    "name": "issuePriceType",
                    "type": "String"
                  },
                  {
                    "name": "investmentType",
                    "type": "String"
                  },
                  {
                    "name": "processingIssueType",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssuerIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "closeTransactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "lossLotIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "externalOrderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "transactionIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "orderIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "chartType",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "longShortIndicator",
                    "type": "String"
                  },
                  {
                    "name": "tradeDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "transactionCostLocal",
                    "type": "String"
                  },
                  {
                    "name": "originalCostBase",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedLocal",
                    "type": "String"
                  },
                  {
                    "name": "amountReceivedBase",
                    "type": "String"
                  },
                  {
                    "name": "totalGainOrLoss",
                    "type": "String"
                  },
                  {
                    "name": "realizedGainOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedLossOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyGainAmount",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyLossAmount",
                    "type": "String"
                  },
                  {
                    "name": "orderQuantity",
                    "type": "String"
                  },
                  {
                    "name": "realizedGainOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "realizedLossOnSecurityDisposalLocal",
                    "type": "String"
                  },
                  {
                    "name": "closingTotalAmortizationBase",
                    "type": "String"
                  },
                  {
                    "name": "tipsIncomeBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyGainOnInterest",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyLossOnInterest",
                    "type": "String"
                  },
                  {
                    "name": "gainOnCurrencyUnderRule988",
                    "type": "String"
                  },
                  {
                    "name": "lossOnCurrencyUnderRule988",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportStartDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportEndDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "amortizedCostAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "bookValueBase",
                    "type": "String"
                  },
                  {
                    "name": "bookValueLocal",
                    "type": "String"
                  },
                  {
                    "name": "tipsIncomeLocal",
                    "type": "String"
                  },
                  {
                    "name": "closingTotalAmortizationLocal",
                    "type": "String"
                  },
                  {
                    "name": "tradePrice",
                    "type": "String"
                  },
                  {
                    "name": "corporateActionType",
                    "type": "String"
                  },
                  {
                    "name": "transactionCostMethod",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyGainOrLossOnInterest",
                    "type": "String"
                  },
                  {
                    "name": "taxLotReliefMethod",
                    "type": "String"
                  },
                  {
                    "name": "earliestTradeDateOfOriginalBuy",
                    "type": "String"
                  },
                  {
                    "name": "transactionTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "totalBaseCurrencyGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "transactionSettlementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "originalExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "transactionType",
                    "type": "String"
                  },
                  {
                    "name": "baseUnitCost",
                    "type": "String"
                  },
                  {
                    "name": "exchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "gainLossTermIndicator",
                    "type": "String"
                  },
                  {
                    "name": "actualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "thirdPartyAdministratorReportType",
                    "type": "String"
                  },
                  {
                    "name": "tradeSettlementIndicator",
                    "type": "String"
                  },
                  {
                    "name": "monthEndAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "amortizationPrice",
                    "type": "String"
                  },
                  {
                    "name": "longTermGainBase",
                    "type": "String"
                  },
                  {
                    "name": "shortTermGainBase",
                    "type": "String"
                  },
                  {
                    "name": "longTermLossBase",
                    "type": "String"
                  },
                  {
                    "name": "shortTermLossBase",
                    "type": "String"
                  },
                  {
                    "name": "netGainLossBase",
                    "type": "String"
                  },
                  {
                    "name": "netGainLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "transactionLotCrossReferenceIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "swapPaymentGainBase",
                    "type": "String"
                  },
                  {
                    "name": "swapPaymentLossBase",
                    "type": "String"
                  },
                  {
                    "name": "orderTransactionType",
                    "type": "String"
                  },
                  {
                    "name": "contributedPropertyContributionDate",
                    "type": "String"
                  },
                  {
                    "name": "valuationTechniqueFairValues",
                    "type": "String"
                  },
                  {
                    "name": "fairValueAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "fairValueAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "orderReason",
                    "type": "String"
                  },
                  {
                    "name": "lossOnSecurityDisposalBase",
                    "type": "String"
                  },
                  {
                    "name": "brokerName",
                    "type": "String"
                  },
                  {
                    "name": "longTermGainLocal",
                    "type": "String"
                  },
                  {
                    "name": "impairmentLifeToDateLocal",
                    "type": "String"
                  },
                  {
                    "name": "longTermLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "shortTermGainLocal",
                    "type": "String"
                  },
                  {
                    "name": "impairmentLifeToDateBase",
                    "type": "String"
                  },
                  {
                    "name": "shortTermLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyGainBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyGainLocal",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyLossBase",
                    "type": "String"
                  },
                  {
                    "name": "realizedCurrencyLossLocal",
                    "type": "String"
                  },
                  {
                    "name": "cancelIndicator",
                    "type": "String"
                  },
                  {
                    "name": "fasRiskLevel",
                    "type": "String"
                  },
                  {
                    "name": "cancelTransactionProcessingDate",
                    "type": "String"
                  },
                  {
                    "name": "cancelTransactionAccountingDate",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "asOfDate",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getCashActivity",
          "methodType": "POST",
          "description": "gets CashActivityTransactionsResponse Transactions based on filter values. CashActivityFilter is required.",
          "request": {
            "name": "cashActivityFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "asOfDate",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "adminName",
                "description": "Optional Admin Name, if not provided all admin names will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
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
            "name": "CashActivityTransactionsResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "cashActivityTransactions",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issueCurrency",
                    "type": "String"
                  },
                  {
                    "name": "custodianName",
                    "type": "String"
                  },
                  {
                    "name": "transactionTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "cashActivityOrderType",
                    "type": "String"
                  },
                  {
                    "name": "netCashDividendReceivedBase",
                    "type": "String"
                  },
                  {
                    "name": "netCashDividendReceivedLocal",
                    "type": "String"
                  },
                  {
                    "name": "grossDividendIncomeBase",
                    "type": "String"
                  },
                  {
                    "name": "cashBeginningBalance",
                    "type": "String"
                  },
                  {
                    "name": "cashEndingBalance",
                    "type": "String"
                  },
                  {
                    "name": "netCashBalance",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getRealizedUnrealizedGainLossTransactions",
          "methodType": "POST",
          "description": "gets CashActivityTransactionsResponse Transactions based on filter values. CashActivityFilter is required.",
          "request": {
            "name": "realizedUnrealizedGainLossFilter",
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
                "description": "asOfDate is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "managingAdvisor",
                "description": "managingAdvisor is required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "fundIdentifier",
                "description": "Optional fundIdentifier, if not provided all fundIDs will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
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
            "name": "RealizedUnrealizedTransactionsResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "realizedUnrealizedTransactions",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "primaryIssueIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "issueName",
                    "type": "String"
                  },
                  {
                    "name": "tradeIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "maturityDate",
                    "type": "String"
                  },
                  {
                    "name": "investmentTypeCode",
                    "type": "String"
                  },
                  {
                    "name": "positionDate",
                    "type": "String"
                  },
                  {
                    "name": "openPositionType",
                    "type": "String"
                  },
                  {
                    "name": "alternativeIssueIdentifierType",
                    "type": "String"
                  },
                  {
                    "name": "cusip",
                    "type": "String"
                  },
                  {
                    "name": "interestRate",
                    "type": "String"
                  },
                  {
                    "name": "transactionCode",
                    "type": "String"
                  },
                  {
                    "name": "payReceiveIndicatorSecurity",
                    "type": "String"
                  },
                  {
                    "name": "originalFaceValue",
                    "type": "String"
                  },
                  {
                    "name": "sharesParValue",
                    "type": "String"
                  },
                  {
                    "name": "principalBaseAmount",
                    "type": "String"
                  },
                  {
                    "name": "receivableOrPayableAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "receivableOrPayableAmountBase",
                    "type": "String"
                  },
                  {
                    "name": "exchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "marketValueBase",
                    "type": "String"
                  },
                  {
                    "name": "baseTotalUnrealizedGainLoss",
                    "type": "String"
                  },
                  {
                    "name": "localCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "originalTradeDate",
                    "type": "String"
                  },
                  {
                    "name": "originalExchangeRate",
                    "type": "String"
                  },
                  {
                    "name": "contractualSettlementDate",
                    "type": "String"
                  },
                  {
                    "name": "settlementLocation",
                    "type": "String"
                  },
                  {
                    "name": "delayDays",
                    "type": "String"
                  },
                  {
                    "name": "tradeSettlementIndicator",
                    "type": "String"
                  },
                  {
                    "name": "orderQuantity",
                    "type": "String"
                  },
                  {
                    "name": "tradeCurrency",
                    "type": "String"
                  },
                  {
                    "name": "countryTax",
                    "type": "String"
                  },
                  {
                    "name": "pendingSettlementAmountLocal",
                    "type": "String"
                  },
                  {
                    "name": "primaryBrokerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "brokerName",
                    "type": "String"
                  },
                  {
                    "name": "crossReferenceBuyLotNumber",
                    "type": "String"
                  },
                  {
                    "name": "dummyIssueIndicator",
                    "type": "String"
                  },
                  {
                    "name": "postDate",
                    "type": "String"
                  },
                  {
                    "name": "reportDate",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "auditVersion",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "domain": "trial_balance",
      "operations": [
        {
          "operation": "getDailyTrialbalance",
          "methodType": "POST",
          "description": "gets daily trial balance based on filter values. DailyTrialbalanceFilter is required.",
          "request": {
            "name": "dailyTrialBalanceFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "trialBalanceFundClass",
                "description": "Optional TrialBalanceFundClass, if not provided all trialBalanceFundClasses will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "managingAdvisor",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "trialBalanceStartPeriod",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "trialBalanceEndPeriod",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
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
            "name": "GeneralLedgerDailyResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "generalLedger",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityName",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundName",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerAccountType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerDescription",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceDebitActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceCreditActivity",
                    "type": "String"
                  },
                  {
                    "name": "netActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndingBalance",
                    "type": "String"
                  },
                  {
                    "name": "taxYear",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceStartPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceSubGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceKnowledgeDate",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundClass",
                    "type": "String"
                  },
                  {
                    "name": "totalSharesOutstanding",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "localCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "financialStatementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "rowType",
                    "type": "String"
                  },
                  {
                    "name": "lineNumber",
                    "type": "String"
                  },
                  {
                    "name": "pageNumber",
                    "type": "String"
                  },
                  {
                    "name": "sectionHeader",
                    "type": "String"
                  },
                  {
                    "name": "sequenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "totalLineIndicator",
                    "type": "String"
                  },
                  {
                    "name": "reportType",
                    "type": "String"
                  },
                  {
                    "name": "runType",
                    "type": "String"
                  },
                  {
                    "name": "trialPeriodDuration",
                    "type": "String"
                  },
                  {
                    "name": "gainLossReconIndicator",
                    "type": "String"
                  },
                  {
                    "name": "relatedBusinessUnitIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "accountClassification",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceTaxStatus",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceReportDate",
                    "type": "String"
                  },
                  {
                    "name": "beginningBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "endingBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "netAssetsUnderManagementValuationFrequency",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueEndingBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueBeginningBalance",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueEndingBalance",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValuePerShare",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueDate",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "maxTrialBalanceStartPeriod",
                    "type": "String"
                  },
                  {
                    "name": "maxTrialBalanceEndPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodEndingBalance",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getMonthlyTrialbalance",
          "methodType": "POST",
          "description": "gets monthly trail balance based on filter values. MonthlyTrialbalanceFilter is required.",
          "request": {
            "name": "monthlyTrialBalanceFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "trialBalanceFundClass",
                "description": "Optional TrialBalanceFundClass, if not provided all trialBalanceFundClasses will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "managingAdvisor",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "month",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "year",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
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
            "name": "GeneralLedgerMonthlyResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "generalLedger",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityName",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundName",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerAccountType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerDescription",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceDebitActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceCreditActivity",
                    "type": "String"
                  },
                  {
                    "name": "netActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndingBalance",
                    "type": "String"
                  },
                  {
                    "name": "taxYear",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceStartPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceSubGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceKnowledgeDate",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundClass",
                    "type": "String"
                  },
                  {
                    "name": "totalSharesOutstanding",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "localCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "financialStatementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "rowType",
                    "type": "String"
                  },
                  {
                    "name": "lineNumber",
                    "type": "String"
                  },
                  {
                    "name": "pageNumber",
                    "type": "String"
                  },
                  {
                    "name": "sectionHeader",
                    "type": "String"
                  },
                  {
                    "name": "sequenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "totalLineIndicator",
                    "type": "String"
                  },
                  {
                    "name": "reportType",
                    "type": "String"
                  },
                  {
                    "name": "runType",
                    "type": "String"
                  },
                  {
                    "name": "trialPeriodDuration",
                    "type": "String"
                  },
                  {
                    "name": "gainLossReconIndicator",
                    "type": "String"
                  },
                  {
                    "name": "relatedBusinessUnitIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "accountClassification",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceTaxStatus",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceReportDate",
                    "type": "String"
                  },
                  {
                    "name": "beginningBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "endingBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "netAssetsUnderManagementValuationFrequency",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueEndingBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueBeginningBalance",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueEndingBalance",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValuePerShare",
                    "type": "String"
                  },
                  {
                    "name": "netAssetValueDate",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceAccountingBasis",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "maxTrialBalanceStartPeriod",
                    "type": "String"
                  },
                  {
                    "name": "maxTrialBalanceEndPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodEndingBalance",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getDailyTrialBalanceByClass",
          "methodType": "POST",
          "description": "Gets daily trial balance information for a particular fund, for a reporting date range by class. DailyTrialBalanceByClassFilter is required.",
          "request": {
            "name": "dailyTrialBalanceByClassFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Fund Identifier, if not provided all Fund Identifiers will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "trialBalanceFundClass",
                "description": "Optional TrialBalanceFundClass, if not provided all trialBalanceFundClasses will be captured.",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "managingAdvisor",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "trialBalanceStartPeriod",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
              },
              {
                "name": "trialBalanceEndPeriod",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
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
            "name": "DailyTrialBalanceByClassResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "generalLedger",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityName",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundName",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerAccountType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerDescription",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceDebitActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceCreditActivity",
                    "type": "String"
                  },
                  {
                    "name": "netActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndingBalance",
                    "type": "String"
                  },
                  {
                    "name": "taxYear",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceStartPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceSubGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceKnowledgeDate",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundClass",
                    "type": "String"
                  },
                  {
                    "name": "totalSharesOutstanding",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "localCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "financialStatementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "rowType",
                    "type": "String"
                  },
                  {
                    "name": "lineNumber",
                    "type": "String"
                  },
                  {
                    "name": "pageNumber",
                    "type": "String"
                  },
                  {
                    "name": "sectionHeader",
                    "type": "String"
                  },
                  {
                    "name": "sequenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "totalLineIndicator",
                    "type": "String"
                  },
                  {
                    "name": "reportType",
                    "type": "String"
                  },
                  {
                    "name": "runType",
                    "type": "String"
                  },
                  {
                    "name": "trialPeriodDuration",
                    "type": "String"
                  },
                  {
                    "name": "gainLossReconIndicator",
                    "type": "String"
                  },
                  {
                    "name": "relatedBusinessUnitIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "accountClassification",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceTaxStatus",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceReportDate",
                    "type": "String"
                  },
                  {
                    "name": "beginningBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "endingBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "pageId",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodEndingBalance",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getMonthlyTrialBalanceByClass",
          "methodType": "POST",
          "description": "Gets monthly trial balance information for a particular fund for a particular month of a year. MonthlyTrialBalanceByClassFilter is required",
          "request": {
            "name": "monthlyTrialBalanceByClassFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "trialBalanceFundClass",
                "description": "Optional Field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "managingAdvisor",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "month",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "year",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
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
            "name": "MonthlyTrialBalanceByClassResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "generalLedger",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "relatedEntityName",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundName",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerAccountType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerDescription",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceDebitActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceCreditActivity",
                    "type": "String"
                  },
                  {
                    "name": "netActivity",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndingBalance",
                    "type": "String"
                  },
                  {
                    "name": "taxYear",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceStartPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceEndPeriod",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceType",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceSubGeneralLedgerAccountNumber",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceKnowledgeDate",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceFundClass",
                    "type": "String"
                  },
                  {
                    "name": "totalSharesOutstanding",
                    "type": "String"
                  },
                  {
                    "name": "baseCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "localCurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "financialStatementCurrency",
                    "type": "String"
                  },
                  {
                    "name": "rowType",
                    "type": "String"
                  },
                  {
                    "name": "lineNumber",
                    "type": "String"
                  },
                  {
                    "name": "pageNumber",
                    "type": "String"
                  },
                  {
                    "name": "sectionHeader",
                    "type": "String"
                  },
                  {
                    "name": "sequenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "totalLineIndicator",
                    "type": "String"
                  },
                  {
                    "name": "reportType",
                    "type": "String"
                  },
                  {
                    "name": "runType",
                    "type": "String"
                  },
                  {
                    "name": "trialPeriodDuration",
                    "type": "String"
                  },
                  {
                    "name": "gainLossReconIndicator",
                    "type": "String"
                  },
                  {
                    "name": "relatedBusinessUnitIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "accountClassification",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceTaxStatus",
                    "type": "String"
                  },
                  {
                    "name": "trialBalanceReportDate",
                    "type": "String"
                  },
                  {
                    "name": "beginningBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "endingBalanceDebitOrCreditIndicator",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodOpeningBalance",
                    "type": "String"
                  },
                  {
                    "name": "trialBalancePriorPeriodEndingBalance",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getLedgerEntries",
          "methodType": "POST",
          "description": "Gets monthly trial balance information for a particular fund for a particular month of a year. MonthlyTrialBalanceByClassFilter is required",
          "request": {
            "name": "ledgerEntriesFilter",
            "parameters": [
              {
                "name": "first",
                "description": "The cursor to continue",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": false
              },
              {
                "name": "offset",
                "description": "Number of records to continue after cursor",
                "parameterType": "GraphQL Variable",
                "dataType": "Int",
                "nullable": true
              },
              {
                "name": "fundIdentifier",
                "description": "Optional Field",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "managingAdvisor",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "TRPEnum",
                "nullable": false
              },
              {
                "name": "ledgerDate",
                "description": "Required field.",
                "parameterType": "GraphQL Variable",
                "dataType": "Date",
                "nullable": false
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
            "name": "LedgerEntriesResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "pageInfo",
                "type": [
                  {
                    "name": "hasPreviousPage",
                    "type": "Boolean"
                  },
                  {
                    "name": "hasNextPage",
                    "type": "Boolean"
                  }
                ]
              },
              {
                "name": "ledgerEntries",
                "type": [
                  {
                    "name": "fundIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "fundName",
                    "type": "String"
                  },
                  {
                    "name": "ledgerIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "ledgerName",
                    "type": "String"
                  },
                  {
                    "name": "ledgerDescription",
                    "type": "String"
                  },
                  {
                    "name": "subAccountCode",
                    "type": "String"
                  },
                  {
                    "name": "ledgerType",
                    "type": "String"
                  },
                  {
                    "name": "ledgerGroupIdentifier",
                    "type": "String"
                  },
                  {
                    "name": "ledgerGroupPurpose",
                    "type": "String"
                  },
                  {
                    "name": "ledgerGroupName",
                    "type": "String"
                  },
                  {
                    "name": "ledgerGroupDescription",
                    "type": "String"
                  },
                  {
                    "name": "normalBalance",
                    "type": "String"
                  },
                  {
                    "name": "quantityControlCode",
                    "type": "String"
                  },
                  {
                    "name": "beginningBalance",
                    "type": "String"
                  },
                  {
                    "name": "accountingDateOfReportedLedgerEntry",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerAccountCode",
                    "type": "String"
                  },
                  {
                    "name": "generalLedgerAccountDescription",
                    "type": "String"
                  },
                  {
                    "name": "endingBalance",
                    "type": "String"
                  },
                  {
                    "name": "ledgerAccountTarget",
                    "type": "String"
                  },
                  {
                    "name": "ledgerDate",
                    "type": "String"
                  },
                  {
                    "name": "ledgerNetActivity",
                    "type": "String"
                  },
                  {
                    "name": "accountingPeriodEndDate",
                    "type": "String"
                  },
                  {
                    "name": "sequenceNumber",
                    "type": "String"
                  },
                  {
                    "name": "realMemoIndicator",
                    "type": "String"
                  },
                  {
                    "name": "postingPeriod",
                    "type": "String"
                  },
                  {
                    "name": "managingAdvisor",
                    "type": "String"
                  },
                  {
                    "name": "adminName",
                    "type": "String"
                  },
                  {
                    "name": "debitActivity",
                    "type": "String"
                  },
                  {
                    "name": "creditActivity",
                    "type": "String"
                  },
                  {
                    "name": "localCurrencyCode",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "domain": "reference_data",
      "operations": [
        {
          "operation": "getRefGeography",
          "methodType": "POST",
          "description": "gets all values of GeographyReference.",
          "request": {
            "name": null,
            "parameters": null
          },
          "response": {
            "name": "GeographyReferenceResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "geographyReferences",
                "type": [
                  {
                    "name": "internationalOrganizationForStandardization2CountryCode",
                    "type": "String"
                  },
                  {
                    "name": "internationalOrganizationForStandardization2CountryText",
                    "type": "String"
                  },
                  {
                    "name": "clientCountrySynonym",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getRefCurrency",
          "methodType": "POST",
          "description": "gets all values of CurrencyReference.",
          "request": {
            "name": null,
            "parameters": null
          },
          "response": {
            "name": "CurrencyReferenceResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "currencyReferences",
                "type": [
                  {
                    "name": "internationalOrganizationForStandardization3CurrencyCode",
                    "type": "String"
                  },
                  {
                    "name": "internationalOrganizationForStandardization3CurrencyText",
                    "type": "String"
                  },
                  {
                    "name": "clientCurrencySynonym",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getRefSecuritySetup",
          "methodType": "POST",
          "description": "gets all values of SecuritySetupReference.",
          "request": {
            "name": null,
            "parameters": null
          },
          "response": {
            "name": "SecuritySetupResponse",
            "response": [
              {
                "name": "rowCount",
                "type": "Int"
              },
              {
                "name": "securitySetups",
                "type": [
                  {
                    "name": "exchangeCode",
                    "type": "String"
                  },
                  {
                    "name": "exchangeDescription",
                    "type": "String"
                  },
                  {
                    "name": "exchangeCodeSynonym",
                    "type": "String"
                  }
                ]
              }
            ]
          }
        },
        {
          "operation": "getRefAdministrator",
          "methodType": "POST",
          "description": "Gets TPA specfic Reference Data",
          "request": {
            "name": "refAdministratorFilter",
            "parameters": [
              {
                "name": "adminName",
                "description": "adminName is a optional parameter",
                "parameterType": "GraphQL Variable",
                "dataType": "String",
                "nullable": true
              },
              {
                "name": "tpaReferenceType",
                "description": "tpaReferenceType is a optional parameter",
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
            "name": "AdministratorReferenceResponse",
            "data": {
              "name": "AdministratorReferenceResponse",
              "response": [
                {
                  "name": "rowCount",
                  "type": "Int"
                },
                {
                  "name": "administratorReferences",
                  "type": [
                    {
                      "name": "tpaApplicationName",
                      "type": "String"
                    },
                    {
                      "name": "tpaReferenceType",
                      "type": "String"
                    },
                    {
                      "name": "tpsReferenceCode",
                      "type": "String"
                    },
                    {
                      "name": "tpaReferenceDescription",
                      "type": "String"
                    },
                    {
                      "name": "adminName",
                      "type": "String"
                    }
                  ]
                }
              ]
            }
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
