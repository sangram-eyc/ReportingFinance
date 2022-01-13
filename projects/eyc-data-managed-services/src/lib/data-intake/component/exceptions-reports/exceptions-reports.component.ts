import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { ColDef } from 'ag-grid-community';
import { DataManagedService } from '../../services/data-managed.service';

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

  entityId;
  
  @ViewChild('motifTable') table: ElementRef;
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

  constructor(private dataManagedService: DataManagedService,) {
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
    this.getActiveFilingsData();
    // this.getExceptionReportstable();
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
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
        }
      ];
      this.getExceptionReportstable();
    });

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
