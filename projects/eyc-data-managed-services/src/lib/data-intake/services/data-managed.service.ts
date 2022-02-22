import { Inject, Injectable } from '@angular/core';
import { DataManagedSettingsService } from './data-managed-settings.service';
import { EycDataApiService } from './eyc-data-api.service';
import { HttpParams } from '@angular/common/http';
import { DataSummary } from '../models/data-summary.model'
import {DataGrid, ExceptionDataGrid,GroupByDataProviderCardGrid} from '../models/data-grid.model';
@Injectable({
  providedIn: 'root'
})
export class DataManagedService {
  public exceptionDetails: any;
  public exceptionFileName:string;
  constructor(
    private dataManagedSettingsService: DataManagedSettingsService,
    private eycDataApiService: EycDataApiService
  ) { }

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

  businessDate(businessWeekDay: Date): Date {
    const weekDay = businessWeekDay.getDay();
    switch (weekDay) {
      case 0: businessWeekDay.setDate(businessWeekDay.getDate() - 2); break;
      case 1: businessWeekDay.setDate(businessWeekDay.getDate() - 3); break;
      case 6: businessWeekDay.setDate(businessWeekDay.getDate() - 1); break;
      default: break;
    }
    return businessWeekDay;
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
    .append('reportName',dataGrid.reportName);
    return params;
  }

// fileName:Daily Working Trial Balance TF2021-03-31

  getFileSummaryList(params: DataSummary) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_list}`, this.httpQueryParams(params));
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

  getReviewByGroupProviderOrDomainGrid(params:GroupByDataProviderCardGrid){
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.review_by_group_provider_domain}`,this.httpQueryParamsProviderCardGrid(params));
  }
}
