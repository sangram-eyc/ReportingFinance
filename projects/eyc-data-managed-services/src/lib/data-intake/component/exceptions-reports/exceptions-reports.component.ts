import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { ColDef } from 'ag-grid-community';
import { DataManagedService } from '../../services/data-managed.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomGlobalService, ModalComponent, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { GridDataSet } from '../../models/grid-dataset.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'lib-exceptions-reports',
  templateUrl: './exceptions-reports.component.html',
  styleUrls: ['./exceptions-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsReportsComponent implements OnInit {
  single = [];
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  gridApi;
  curDate: string;
  presentDate: Date;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvailable: boolean;
  searchNoDataAvilable: boolean;

  activeFilings = [];
  activeReports = []
  completedFilings = [];
  filingResp = [];

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  noCompletedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  rowData = [];
  rowClass = 'row-style';
  columnDefs = [];
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';
  @ViewChild('commentscount')
  commentscount: TemplateRef<any>;

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('nextbuttonTemplete')
  nextbuttonTemplete: TemplateRef<any>;
  @ViewChild('rname')
  rname: TemplateRef<any>;

  @ViewChild('chipTemplate')
  chipTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;

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

  constructor(private dataManagedService: DataManagedService, private elementRef: ElementRef,
    private renderer: Renderer2, private customglobalService: CustomGlobalService) {
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
    this.getActiveFilingsData();
    // this.getExceptionReportstable();
  }

  // Table methods
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  }

  getCompletedFilingsData() {
    this.completedFilings = [];
    this.dataManagedService.getDailyGeneralLedgerList(this.currentPage - 1, this.noOfCompletdFilingRecords).subscribe(resp => {
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.filingName + ' // ' + item.period,
          period: item.period,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: [],
          status: item.filingStatus
        };
        this.completedFilings.push(eachitem);
      });
      this.createHistoryRowData();
    })
  }

  createHistoryRowData() {
    debugger;
    this.rowData = [];
    this.completedFilings.forEach(filing => {
      this.rowData.push({
        name: filing.name,
        comments: filing.comments.length,
        dueDate: this.customglobalService.formatDateWithSlashConcat(filing.dueDate),
        subDate: '-',
        exceptions: 0,
        resolved: 0
      })
    });

   this.exceptionTableData = [
      {
        "type": "Valuation",
        "exposure": "Listed Equity",
        "classification": "Financial",
        "category": "DiffLVL",
        "value": "(64,27,000)",
        "variance": "2.47%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity",
        "classification": "Non-financial",
        "category": "DiffLVL",
        "value": "(4,27,000)",
        "variance": "2.47%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity",
        "classification": "Financial",
        "category": "DiffLVL",
        "value": "(4,02,000)",
        "variance": "0.47%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity",
        "classification": "Non-financial",
        "category": "DiffLVL",
        "value": "(4,56,000)",
        "variance": "0.87%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity",
        "classification": "Non-financial",
        "category": "DiffLVL",
        "value": "(3,70,000)",
        "variance": "0.37%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity Derivatives",
        "classification": "Financial",
        "category": "DiffLVL",
        "value": "(2,27,000)",
        "variance": "0.10%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity Derivatives",
        "classification": "Non-financial",
        "category": "DiffLVL",
        "value": "(3,43,000)",
        "variance": "0.37%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity Derivatives",
        "classification": "Financial",
        "category": "DiffLVL",
        "value": "(2,27,000)",
        "variance": "0.56%"
      },
      {
        "type": "Valuation",
        "exposure": "Listed Equity Derivatives",
        "classification": "Financial",
        "category": "DiffLVL",
        "value": "(5,23,000)",
        "variance": "0.87%"
      }
    ];

    this.columnDefs = [
      {
        headerComponentFramework: MotifTableHeaderRendererComponent,
        headerName: 'Type',
        field: 'type',
        sortable: true
      },
      {
        headerComponentFramework: MotifTableHeaderRendererComponent,
        headerName: 'Exposure',
        field: 'exposure',
        sortable: true,
      },
      {
        headerComponentFramework: MotifTableHeaderRendererComponent,
        headerName: 'Classification',
        field: 'classification',
        sortable: true,
      },
      {
        headerComponentFramework: MotifTableHeaderRendererComponent,
        headerName: 'Category',
        field: 'category',
        sortable: true,
      },
      {
        headerComponentFramework: MotifTableHeaderRendererComponent,
        headerName: 'Value',
        field: 'value',
        sortable: true,
      },
      {
        headerComponentFramework: MotifTableHeaderRendererComponent,
        headerName: 'Variance',
        field: 'variance',
        sortable: true,
      },
      {
        headerComponentFramework: MotifTableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.commentTemplate,
        },
        headerName: 'Comments',
        field: 'comments',
        sortable: true,
        filter: true,
        width: 155
      }
    ];
    // this.columnDefs = [
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Exception Report Type',
    //     field: 'rtype',
    //     sortable: true,
    //     filter: false,
    //     resizeable: true,
    //     minWidth: 200,
    //     sort: 'asc',
    //     wrapText: true,
    //     autoHeight: true
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     headerName: 'Exception Report Name',
    //     field: 'rname',
    //     sortable: true,
    //     filter: false,
    //     minWidth: 200,
    //     cellRendererParams: {
    //       ngTemplate: this.rname,
    //     }
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     headerName: 'Exception Priority Level',
    //     field: 'priority',
    //     sortable: true,
    //     filter: false,
    //     minWidth: 200,
    //     cellRendererParams: {
    //       ngTemplate: this.chipTemplate,
    //     }
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     headerName: 'Comments',
    //     field: 'comments',
    //     sortable: false,
    //     filter: false,
    //     minWidth: 200,
    //     cellRendererParams: {
    //       ngTemplate: this.commentscount,
    //     }
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Exceptions',
    //     field: 'exceptions',
    //     sortable: false,
    //     filter: false,
    //     minWidth: 200
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     headerName: '',
    //     field: 'next',
    //     sortable: false,
    //     filter: false,
    //     minWidth: 100,
    //     cellRendererParams: {
    //       ngTemplate: this.nextbuttonTemplete,
    //     }
    //   },
    // ];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
    this.getCompletedFilingsData();
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
    this.getCompletedFilingsData();
  }

  getActiveFilingsData() {
    debugger;
    this.dataManagedService.getExceptionReportstable().subscribe(resp => {
      this.filingResp.push(resp);
      resp['data'].length === 0 ? this.noActivatedDataAvailable = true : this.noActivatedDataAvailable = false;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.filingName,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: [],
          status: item.filingStatus,
          filingName: item.filingName,
          period: item.period,
          filingId: item.filingId,
          totalFunds: item.totalFunds
        };
        this.activeFilings.push(eachitem);
      });
      this.activeFilings = this.customglobalService.sortFilings(this.activeFilings)
      this.activeReports = this.activeFilings;
      this.createHistoryRowData();
    });
  }


  // MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  // MotifTableCellRendererComponent = MotifTableCellRendererComponent;

  // exceptionTableData = [];
  // gridApi;
  // columnDefs: Array<ColDef>;


  // entityId;
  // showComments = false;
  // commentEntityType;
  // commentsName;
  // row={
  //   "commentsCount":20
  // }

  // @ViewChild('motifTable') table: ElementRef;
  // @ViewChild('headerTemplate')
  // headerTemplate: TemplateRef<any>;
  // @ViewChild('dropdownTemplate')
  // dropdownTemplate: TemplateRef<any>;

  // @ViewChild('commentTemplate')
  // commentTemplate: TemplateRef<any>;

  // constructor(private dataManagedService: DataManagedService,public dialog: MatDialog,) {
  // }

  // ngOnInit(): void {
  // }

  // openComments(row) {
  //   console.log(row);
  //    this.showComments = true;  
  // }

  // addComment(row) {
  //   const dialogRef = this.dialog.open(ModalComponent, {
  //     width: '700px',
  //     data: {
  //       type: "ConfirmationTextUpload",
  //       header: "Add comment",
  //       description: `Please add your comment below.`,
  //       entityId: row.entityId,
  //       entityType: "FILING_ENTITY",
  //       forms: {
  //         isSelect: false,
  //         selectDetails: {
  //           label: "Assign to (Optional)",
  //           formControl: 'assignTo',
  //           type: "select",
  //           data:[
  //             { name: "Test1", id: 1 },
  //             { name: "Test2", id: 2 },
  //             { name: "Test3", id: 3 },
  //             { name: "Test4", id: 4 }
  //           ]
  //         },
  //         isTextarea: true,
  //         textareaDetails:{
  //           label:"Comment (required)",
  //           formControl: 'comment',
  //           type: "textarea",
  //           validation: true,
  //           validationMessage: "Comment is required"
  //         }
  //       },
  //       footer: {
  //         style: "start",
  //         YesButton: "Submit",
  //         NoButton: "Cancel"
  //       }
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log('The dialog was closed', result);
  //     if(result.button === "Submit") {
  //       const obj = {
  //         assignTo: result.data.assignTo,
  //         comment: escape(result.data.comment),
  //         files: result.data.files
  //       }
  //       console.log(obj);
  //     } else {
  //       console.log(result);
  //     }
  //   });
  // }
  // commentAdded() {

  // }
  // isFirstColumn = (params) => {
  //   const displayedColumns = params.columnApi.getAllDisplayedColumns();
  //   const thisIsFirstColumn = displayedColumns[0] === params.column;
  //   return thisIsFirstColumn;
  // };

  // handleGridReady = (params) => {
  //   this.gridApi = params.api;
  //   this.gridApi.sizeColumnsToFit();
  // };

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.columnDefs = [
  //       {
  //         headerComponentFramework: MotifTableHeaderRendererComponent,
  //         headerName: 'Type',
  //         field: 'type',
  //         sortable: true
  //       },
  //       {
  //         headerComponentFramework: MotifTableHeaderRendererComponent,
  //         headerName: 'Exposure',
  //         field: 'exposure',
  //         sortable: true,
  //       },
  //       {
  //         headerComponentFramework: MotifTableHeaderRendererComponent,
  //         headerName: 'Classification',
  //         field: 'classification',
  //         sortable: true,
  //       },
  //       {
  //         headerComponentFramework: MotifTableHeaderRendererComponent,
  //         headerName: 'Category',
  //         field: 'category',
  //         sortable: true,
  //       },
  //       {
  //         headerComponentFramework: MotifTableHeaderRendererComponent,
  //         headerName: 'Value',
  //         field: 'value',
  //         sortable: true,
  //       },
  //       {
  //         headerComponentFramework: MotifTableHeaderRendererComponent,
  //         headerName: 'Variance',
  //         field: 'variance',
  //         sortable: true,
  //       },
  //       {
  //         headerComponentFramework: MotifTableHeaderRendererComponent,
  //         cellRendererFramework: MotifTableCellRendererComponent,
  //         cellRendererParams: {
  //           ngTemplate: this.commentTemplate,
  //         },
  //         headerName: 'Comments',
  //         field: 'comments',
  //         sortable: true,
  //         filter: true,
  //         width: 155
  //       }
  //     ];
  //     this.getExceptionReportstable();
  //   });

  // }

  // getExceptionReportstable() {
  //   // Mock API integration for exception reports table
  //   this.dataManagedService.getExceptionReportstable().subscribe(data => {
  //     // this.exceptionTableData = data.data['rowData'];
  //   });
  //   // this.exceptionTableData = [
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity",
  //   //     "classification": "Financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(64,27,000)",
  //   //     "variance": "2.47%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity",
  //   //     "classification": "Non-financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(4,27,000)",
  //   //     "variance": "2.47%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity",
  //   //     "classification": "Financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(4,02,000)",
  //   //     "variance": "0.47%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity",
  //   //     "classification": "Non-financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(4,56,000)",
  //   //     "variance": "0.87%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity",
  //   //     "classification": "Non-financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(3,70,000)",
  //   //     "variance": "0.37%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity Derivatives",
  //   //     "classification": "Financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(2,27,000)",
  //   //     "variance": "0.10%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity Derivatives",
  //   //     "classification": "Non-financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(3,43,000)",
  //   //     "variance": "0.37%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity Derivatives",
  //   //     "classification": "Financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(2,27,000)",
  //   //     "variance": "0.56%"
  //   //   },
  //   //   {
  //   //     "type": "Valuation",
  //   //     "exposure": "Listed Equity Derivatives",
  //   //     "classification": "Financial",
  //   //     "category": "DiffLVL",
  //   //     "value": "(5,23,000)",
  //   //     "variance": "0.87%"
  //   //   }
  //   // ];
  // }
}
