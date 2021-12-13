import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.scss']
})
export class GeneralLedgerComponent implements OnInit {
  single: any[] = [];
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  gridApi;
  curDate;
  presentDate;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  activeFilings: any[] = [];
  activeReports:any[] = []
  completedFilings: any[] = [];
  filingResp: any[] = [];

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  noCompletedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  rowData;
  rowClass = 'row-style';
  columnDefs;
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

  dataset = [{
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
  currentlySelectedPageSize = {
    disable: false,
    value: 10,
    name: '10',
    id: 0
  };

  pageSize;
  columnGl: any
  glRowdata: any


  constructor(private dataManagedService: DataManagedService, private elementRef: ElementRef,
    private renderer: Renderer2, private customglobalService: CustomGlobalService) {

  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();

    this.getActiveFilingsData();
  }

  // table methods
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
  
  formatDate(timestamp) {
    let due = new Date(timestamp);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    return newdate;
  }

  createHistoryRowData() {
    this.rowData = [];
    this.completedFilings.forEach(filing => {
      this.rowData.push({
        name: filing.name,
        comments: filing.comments.length,
        dueDate: this.formatDate(filing.dueDate),
        subDate: '-',
        exceptions: 0,
        resolved: 0
      })
    });

    this.glRowdata = [
      {
        rname: "Coloumn Completeness",
        rtype: "Data Accuracy / completeness",
        priority: 1,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Gav Nav",
        rtype: "Data Accuracy / completeness",
        priority: 3,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Fund Completeness",
        rtype: "Data Accuracy / completeness",
        priority: 3,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Data Type",
        rtype: "Data Accuracy / completeness",
        priority: 2,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Maturity Date",
        rtype: "Data Accuracy / completeness",
        priority: 1,
        comments: 2,
        exceptions: 500,
      },
      {
        rname: "Coloumn Completeness",
        rtype: "Data Accuracy / completeness",
        priority: 2,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Coloumn Completeness",
        rtype: "Data Accuracy / completeness",
        priority: 1,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Coloumn Completeness",
        rtype: "Data Accuracy / completeness",
        priority: 1,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Coloumn Completeness",
        rtype: "Data Accuracy / completeness",
        priority: 1,
        comments: 2,
        exceptions: 3,
      },
      {
        rname: "Coloumn Completeness",
        rtype: "Data Accuracy / completeness",
        priority: 1,
        comments: 2,
        exceptions: 3,
      }
    ]

    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exception Report Type',
        field: 'rtype',
        sortable: true,
        filter: false,
        resizeable: true,
        minWidth: 200,
        sort: 'asc',
        wrapText: true,
        autoHeight: true,
        // comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        headerName: 'Exception Report Name',
        field: 'rname',
        sortable: true,
        filter: false,
        minWidth: 200,
        cellRendererParams: {
          ngTemplate: this.rname,
        }
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        headerName: 'Exception Priority Level',
        field: 'priority',
        sortable: true,
        filter: false,
        minWidth: 200,
        cellRendererParams: {
          ngTemplate: this.chipTemplate,
        }
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        headerName: 'Comments',
        field: 'comments',
        sortable: false,
        filter: false,
        minWidth: 200,
        cellRendererParams: {
          ngTemplate: this.commentscount,
        }
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptions',
        sortable: false,
        filter: false,
        minWidth: 200
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        headerName: '',
        field: 'next',
        sortable: false,
        filter: false,
        minWidth: 100,
        cellRendererParams: {
          ngTemplate: this.nextbuttonTemplete,
        }
      },
    ];
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
    this.dataManagedService.getFilings().subscribe(resp => {
      this.filingResp.push(resp);
      resp['data'].length === 0 ? this.noActivatedDataAvilable = true : this.noActivatedDataAvilable = false;
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

  dateSub(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() - 1);
    this.curDate = formatDate(curDateVal, 'MMM. dd, yyyy', 'en');
  }

  dateAdd(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() + 1);
    this.curDate = formatDate(curDateVal, 'MMM. dd, yyyy', 'en');
  }

  dailyData() {
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'secondary')
  }

  monthyData() {
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');
  }
}