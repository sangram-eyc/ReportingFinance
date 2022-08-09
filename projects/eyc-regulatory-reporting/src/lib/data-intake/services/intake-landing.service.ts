import { Inject, Injectable } from '@angular/core';
// import { settingsService } from './data-managed-settings.service';
// import { apiService } from './eyc-data-api.service';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { HttpParams } from '@angular/common/http';
import { DataSummary } from './../models/data-summary.model'
import { formatDate } from '@angular/common';
import {DataGrid, ExceptionDataGrid,ExceptionDetailsDataGrid,GroupByDataProviderCardGrid} from './../models/data-grid.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntakeLandingService {

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
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
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

  getBusinessday(){
    // return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_summary_review_all}`);
    return of({
      "data": [
        {
          "barChartDTO": [
            {
                "name": "JPM",
                "series": [
                    {
                        "name": "No issues",
                        "value": 8
                    },
                    {
                        "name": "Low priority issues",
                        "value": 12
                    },
                    {
                        "name": "Medium priority issues",
                        "value": 15
                    },
                    {
                        "name": "High priority issues",
                        "value": 12
                    },
                    {
                        "name": "Missing files, past due",
                        "value": 23
                    },
                    {
                        "name": "Files not received",
                        "value": 24
                    }
                ]
            },
            {
                "name": "CIBC",
                "series": [
                    {
                        "name": "No issues",
                        "value": 10
                    },
                    {
                        "name": "Low priority issues",
                        "value": 20
                    },
                    {
                        "name": "Medium priority issues",
                        "value": 30
                    },
                    {
                        "name": "High priority issues",
                        "value": 10
                    },
                    {
                        "name": "Missing files, past due",
                        "value": 39
                    },
                    {
                        "name": "Files not received",
                        "value": 20
                    }
                ]
            }
      ]
        }]
      });
  }
  
  getFileSummaryList(params: DataSummary) {
    return this.apiService.invokePostAPI(`${this.settingsService.regIntakeSumarry.file_summary_list}`,params);
  } 

  getReviewAllList(params: DataSummary) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_summary_review_all}`);
  } 
  getEmbedURL() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.PBI_EMBED_URL}`);
  }  
  getEmbedTokenURL() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.PBI_AUTH_TOKEN_URL}`);
  }                                                 
  getDataProviderList() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_data_provider}`);
  }

  getDailyDataProviderList() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_data_provider_daily}`);
  }

  getMonthlyDataProviderList() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_data_provider_monthly}`);
  }

  getDailyDataDomainList() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_data_domain_daily}`);
  }

  getMonthlyDataDomainList() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_data_domain_monthly}`);
  }

  getDailyGeneralLedgerList(currentPage = 0, noOfRecords = 0) {
    let currentPageValue = `&currentPage=${currentPage}`;
    let noOfRecordsValue = `&numRecords=${noOfRecords}`;
    // After API integration will remove above line and uncomment below line
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_general_ledger_daily}${currentPageValue}${noOfRecordsValue}`);
  }

  getExceptionReportstable() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.exception_reports_table}`);
  }

  getReviewFilesData() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_review_data}`);
  }
  
  getReviewFileTableData(params: DataGrid) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.file_review_table_data}`);
  }

  getExceptionTableData(params:ExceptionDataGrid) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.exception_table_data}`);
  }

  getExceptionDetailsTableData(params:ExceptionDetailsDataGrid, bodyParam: any) {
    const tableName = `?tableName=${params.tableName}`;
    const auditDate = `&auditDate=${params.auditDate}`;
    return this.apiService.invokePostBodyAPI(`${this.settingsService.regIntakeSumarry.exception_details_table_data}${tableName}${auditDate}`, bodyParam);
  }
  /* getExceptionDetailsTableData(params:ExceptionDetailsDataGrid, bodyParam: any) {
    const tableName = `?tableName=${params.tableName}`;
    const auditDate = `&auditDate=${params.auditDate}`;
    return [];
    // return this.apiService.invokePostBodyAPI(`${this.settingsService.regIntakeSumarry.exception_details_table_data}${tableName}${auditDate}`, bodyParam);
  } */
  getReviewByGroupProviderOrDomainGrid(params:GroupByDataProviderCardGrid){
    // return this.apiService.invokePostAPI(`${this.settingsService.regIntakeSumarry.review_by_group_provider_domain}`,this.httpQueryParamsProviderCardGrid(params));
    return this.apiService.invokeGetAPI(`${this.settingsService.regIntakeSumarry.review_by_group_provider_domain}`);
    
  }
  getApiBaseUrl(){
    return this.settingsService.regIntakeSumarry.base_Url;
  }

  getApiCatalog(){
    return this.apiService.invokePostAPI(`${this.settingsService.regIntakeSumarry.api_catalog}`);
  }
}
