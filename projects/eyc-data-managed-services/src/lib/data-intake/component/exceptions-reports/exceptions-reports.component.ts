import { formatDate } from '@angular/common';
import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { RoutingStateService } from '../../services/routing-state.service';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { AutoUnsubscriberService, CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { DATA_INTAKE_TYPE, DATA_INTAKE_TYPE_DISPLAY_TEXT,ROUTE_URL_CONST, INPUT_VALIDATON_CONFIG } from '../../../config/dms-config-helper';
import { GridDataSet } from '../../models/grid-dataset.model';
import { DataManagedService } from '../../services/data-managed.service';
import { ExceptionDetailsDataGrid } from '../../models/data-grid.model';

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
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  rowData = [];
  rowClass = 'row-style';
  columnDefs = [];
  columnDefsFill = [];
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';
  dataset: GridDataSet[] = [{
    disable: false,
    value: 10,
    name: '10',
    id: 0
  },
  {
    disable: false,
    value: 25,
    name: '25',
    id: 1
  },
  {
    disable: false,
    value: 50,
    name: '50',
    id: 2
  }];

  currentlySelectedPageSize: GridDataSet = {
    disable: false,
    value: 10,
    name: '10',
    id: 0
  };
  exceptionTableData = [];
  exceptionTableFillData = [];
  headerColumnName = [];
  // exceptionReportDetails = "";
  exceptionFileName: string = "";
  auditDate: string = "";
  tableName: string = "";
  auditHashID: string = "";
  
  isLoading = true;
  fileName="Files";
  httpDataGridParams: ExceptionDetailsDataGrid;

  constructor(private dataManagedService: DataManagedService, private elementRef: ElementRef,
    private renderer: Renderer2, private customglobalService: CustomGlobalService, private routingState: RoutingStateService,
    private unsubscriber: AutoUnsubscriberService,) {
    this.exceptionFileName = this.dataManagedService.getExceptionFileName;
    this.isLoading = true;
    this.auditDate = this.dataManagedService.getAuditDate;
    this.tableName = this.dataManagedService.getTableName;
    this.auditHashID = this.dataManagedService.getAuditHashID;

    this.httpDataGridParams = {
      auditDate : this.auditDate, tableName: this.tableName
    }
  }

  capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  ngAfterViewInit(): void {
    const auditHashIds = { "auditHashId": this.auditHashID };
    this.dataManagedService
      .getExceptionDetailsTableData(this.httpDataGridParams, auditHashIds)
      .pipe(this.unsubscriber.takeUntilDestroy).subscribe((resp: any) => {
        console.log(resp);
        if (resp.data.length > 0) {
          const firstRow = resp.data[0];
          for (const [key, value] of Object.entries(firstRow)) {
            console.log(`${key}: ${value}`);
            this.columnDefsFill.push({
              headerComponentFramework: MotifTableHeaderRendererComponent,
              headerName: key.replace(/_/g, ' '),
              field: key,
              sortable: true,
              wrapText: true,
              autoHeight: true
            });
          }
          this.exceptionTableData = resp.data;
          this.columnDefsFill.splice(0, 0, { headerName: '#', width: '70', valueGetter: 'node.rowIndex+1' });
          this.columnDefs = this.columnDefsFill;
        }
      });
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
  }

  onSortChanged(params) {
    this.gridApi.refreshCells();
  }

  // Table methods
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvailable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
    this.gridApi.refreshCells();
  }

  onPasteSearchActiveReports(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");    
    pastedText.forEach((ele, index) => {
      if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
    this.gridApi.refreshCells();
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.isLoading = false;
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
  }
}
