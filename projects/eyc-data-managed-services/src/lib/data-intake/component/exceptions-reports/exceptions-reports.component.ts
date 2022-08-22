import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RoutingStateService } from '../../services/routing-state.service';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { AutoUnsubscriberService, CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { DATA_INTAKE_TYPE, DATA_INTAKE_TYPE_DISPLAY_TEXT,ROUTE_URL_CONST, INPUT_VALIDATON_CONFIG } from '../../../config/dms-config-helper';
import { GridDataSet } from '../../models/grid-dataset.model';
import { DataManagedService } from '../../services/data-managed.service';
import { ExceptionDetailsDataGrid } from '../../models/data-grid.model';
import { FirstDataRenderedEvent } from 'ag-grid-community';

@Component({
  selector: 'lib-exceptions-reports',
  templateUrl: './exceptions-reports.component.html',
  styleUrls: ['./exceptions-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsReportsComponent implements OnInit, AfterViewInit {
  previousRoute: string;
  routeHistory:any;
  isDataIntaketype:boolean=false;
  dataIntakeTypeDisplay: object;
  dataIntakeTypeDisplayText=DATA_INTAKE_TYPE_DISPLAY_TEXT;
  dataIntakeTypeUrl: string = '';
  filereviewUrl: string;
  exceptionUrl:string;
  ExceptionFileName: string;
  routeUrlConst=ROUTE_URL_CONST;
  gridApi;
  presentDate: Date;

  searchNoDataAvailable: boolean;

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  noCompletedDataAvailable = false;
  // MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  // TableHeaderRendererComponent = TableHeaderRendererComponent;
  rowData = [];
  rowClass = 'row-style';
  columnDefs = [];
  columnDefsFill = [];
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';
  // dataset: GridDataSet[] = [{
  //   disable: false,
  //   value: 10,
  //   name: '10',
  //   id: 0
  // },
  // {
  //   disable: false,
  //   value: 25,
  //   name: '25',
  //   id: 1
  // },
  // {
  //   disable: false,
  //   value: 50,
  //   name: '50',
  //   id: 2
  // }];

  // currentlySelectedPageSize: GridDataSet = {
  //   disable: false,
  //   value: 10,
  //   name: '10',
  //   id: 0
  // };
  exceptionTableData = [];
  exceptionTableFillData = [];
  headerColumnName = [];
  exceptionReportDetails = "";
  exceptionFileName: string = "";
  exceptionReportField:string="";
  auditDate: string = "";
  tableName: string = "";
  auditHashID: string = "";
  auditRuleType: string = "";

  isLoading = true;
  fileName="Files";
  httpDataGridParams: ExceptionDetailsDataGrid;
  exportName: string = "Data Intake_";
  pagination: boolean = true;
  paginationSize: number = 100;
  pageSize: number = 100;
  pageList: number[] = [100,150,200];
  paginationPageSize: number = 100;
  showAgGrid: boolean = true;

  constructor(private dataManagedService: DataManagedService, private cdr: ChangeDetectorRef,
    private routingState: RoutingStateService,
    private unsubscriber: AutoUnsubscriberService,) {
    this.exceptionReportDetails = this.dataManagedService.getExceptionDetails;
    this.exceptionFileName = this.dataManagedService.getExceptionFileName;
    this.exceptionReportField=this.dataManagedService.getExceptionReportField;
    this.isLoading = true;
    this.auditDate = this.dataManagedService.getAuditDate;
    this.tableName = this.dataManagedService.getTableName;
    this.auditHashID = this.dataManagedService.getAuditHashID;
    this.auditRuleType = this.dataManagedService.getAuditRuleType;
    console.log("auditRuleType", this.auditRuleType);
    this.httpDataGridParams = {
      auditDate : this.auditDate, tableName: this.tableName
    }

  }

  capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  ngAfterViewInit(): void {
    if (this.auditRuleType === "row") {
      const auditHashIds = { "auditHashId": this.auditHashID };
      this.dataManagedService
        .getExceptionDetailsTableData(this.httpDataGridParams, auditHashIds)
        .pipe(this.unsubscriber.takeUntilDestroy).subscribe((resp: any) => {
          const respData = resp.data;
          if (resp.data.length > 0) {
            const firstRow = resp.data[0];
            for (const [key] of Object.entries(firstRow)) {
              this.columnDefsFill.push({
                // headerComponentFramework: MotifTableHeaderRendererComponent,
                headerName: key.replace(/_/g, ' '),
                field: key,
                sortable: true,
                wrapText: false,
                autoHeight: false,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
              });
            }
            this.columnDefs = this.columnDefsFill;
            this.columnDefsFill.splice(0, 0, { headerName: '#', width: '70', valueGetter: 'node.rowIndex+1' });
            this.exceptionTableData = respData;
            this.cdr.detectChanges();
          }
        });
    }
    if (this.auditRuleType === "fileOrTable" && this.headerColumnName && this.headerColumnName.length > 0) {
      const headerColumnNameUnique = new Set(this.headerColumnName);
      headerColumnNameUnique.forEach((key) => {
        this.columnDefsFill.push({
          // headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: key.replace(/_/g, ' '),
          field: key,
          sortable: true,
          wrapText: false,
          autoHeight: false,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        });
      });
      const multiColumnData = [];
      for (let i = 0; i < this.exceptionTableFillData.length;) {
        let headerColumnNameUniqueWithValue = {};
        let headerIndex = 0;
        for (const headerColumnNameUniqueKey of headerColumnNameUnique) {
          const currentValue = this.exceptionTableFillData[i + headerIndex];
          const currentValueKey = Object.keys(currentValue);
          if (currentValueKey == headerColumnNameUniqueKey) {
            headerColumnNameUniqueWithValue[`${Object.keys(currentValue)}`] = currentValue[`${Object.keys(currentValue)}`];
          } else {
            const currentValueNoMatch = this.exceptionTableFillData[i + headerIndex - 1];
            headerColumnNameUniqueWithValue[`${Object.keys(currentValue)}`] = currentValueNoMatch[`${Object.keys(currentValue)}`];
            i++;
            break;
          }
          headerIndex++;
        }
        if (headerColumnNameUnique.size === headerIndex) {
          i = i + headerColumnNameUnique.size;
        }
        multiColumnData.push(headerColumnNameUniqueWithValue);
      }
      // this.columnDefs = this.columnDefsFill;
      // this.exceptionTableData = multiColumnData;
      // this.columnDefsFill.splice(0, 0, { headerName: '#', width: '70', valueGetter: 'node.rowIndex+1' });
      setTimeout(() => {
        this.columnDefs = this.columnDefsFill;
        this.exceptionTableData = multiColumnData;
        this.columnDefsFill.splice(0, 0, { headerName: '#', width: '70', valueGetter: 'node.rowIndex+1' });
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 10);      
    }
   }

  ngOnInit(): void {
    this.presentDate = new Date();
    this.exceptionTableFillData = [];
    this.headerColumnName = []
    this.columnDefs = [];
    this.columnDefsFill = [];

    this.previousRoute = this.routingState.getPreviousUrl();
    this.routeHistory = this.routingState.getHistory();
    const routeArray = this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.FILE_REVIEW_URL)).split("/");
    const routePart=routeArray[routeArray.length - 2];

    if (routePart == DATA_INTAKE_TYPE.DATA_PROVIDER || routePart == DATA_INTAKE_TYPE.DATA_DOMAIN) {
      this.isDataIntaketype = true;
      this.fileName = decodeURIComponent(routeArray[routeArray.length - 1]);
      if (routePart == DATA_INTAKE_TYPE.DATA_PROVIDER) {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_PROVIDER;
      }
      else {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_DOMAIN;
      }
      this.dataIntakeTypeUrl = this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL));
    }
    else {
      this.fileName = "Files";
      this.isDataIntaketype = false;
    }
    this.filereviewUrl = this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.FILE_REVIEW_URL));
    this.exceptionUrl = this.previousRoute;
    const exceptionUrlSplitArray = this.exceptionUrl.split("/");
    this.ExceptionFileName = exceptionUrlSplitArray[exceptionUrlSplitArray.length - 3];
    this.exportName = "Exception Report_" ;

    if (this.auditRuleType === "fileOrTable" && this.exceptionReportDetails && this.exceptionReportDetails.length > 0) {
      const str = this.exceptionReportDetails.replace(/[{}]/g, '').replace('"["', '"').replace('"]"', '"');
      const prop = str.split(',');
      prop.forEach((props) => {
        const columnName = this.capitalizeFirstLetter(props.split(':')[0].trim().replace(/"/g, ''));
        const value = props.split(':')[1].trim().replace(/"/g, '');
        this.headerColumnName.push(columnName);
        this.exceptionTableFillData.push({ [`${columnName}`]: value });
      })
    }

  }

  // onSortChanged(params) {
  //   this.gridApi.refreshCells();
  // }

  // Table methods
  // searchCompleted(input) {
  //   this.gridApi.setQuickFilter(input.el.nativeElement.value);
  //   this.searchNoDataAvailable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  //   this.gridApi.refreshCells();
  // }

  // onPasteSearchActiveReports(event: ClipboardEvent) {
  //   let clipboardData = event.clipboardData;
  //   let pastedText = (clipboardData.getData('text')).split("");    
  //   pastedText.forEach((ele, index) => {
  //     if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(ele)) {
  //       if ((pastedText.length - 1) === index) {
  //         return true;
  //       }
  //     } else {
  //       event.preventDefault();
  //       return false;
  //     }
  //   });
  //   this.gridApi.refreshCells();
  // }

  // searchFilingValidation(event) {
  //   var inp = String.fromCharCode(event.keyCode);
  //   if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  // updatePaginationSize(newPageSize: number) {
  //   this.noOfCompletdFilingRecords = newPageSize;
  // }

  // handlePageChange(val: number): void {
  //   this.currentPage = val;
  // }
}
