import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { RegulatoryReportingFilingService } from '../services/regulatory-reporting-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';

@Component({
  selector: 'lib-regulatory-reporting-filing',
  templateUrl: './regulatory-reporting-filing.component.html',
  styleUrls: ['./regulatory-reporting-filing.component.scss']
})
export class RegulatoryReportingFilingComponent implements OnInit {

  tabIn;
  constructor(
    private filingService: RegulatoryReportingFilingService
  ) { }

  activeFilings: any[] = [];
  activeReports: any[] = []
  completedFilings: any[] = [];
  filingResp: any[] = [];

  noOfCompletdFilingRecords = 10;
  currentPage = 0;
  maxPages = 5;
  searchNoDataAvilable = false;
  activeReportsSearchNoDataAvilable = false;
  noCompletedDataAvilable = false;
  noActivatedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData;
  rowClass = 'row-style';
  columnDefs;
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

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


  ngOnInit(): void {
    this.tabIn = 1;
    this.getActiveFilingsData();
    this.getCompletedFilingsData();
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }

  ngAfterViewInit(): void {

  }

  getActiveFilingsData() {
    this.filingService.getFilings().subscribe(resp => {
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
        this.activeReports.push(eachitem);
      });
      this.createHistoryRowData();
    });
  }

  getCompletedFilingsData() {
    this.completedFilings = [];
    this.filingService.getFilingsHistory(this.currentPage, this.noOfCompletdFilingRecords).subscribe(resp => {
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
    this.columnDefs = [
      {
        headerName: '',
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.dropdownTemplate,
        },
        field: 'template',
        minWidth: 43,
        width: 43,
        sortable: false,
        cellClass: 'actions-button-cell',
        pinned: 'left'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Filing Report Name',
        field: 'name',
        sortable: true,
        filter: true,
        resizeable: true,
        minWidth: 240,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Comments',
        field: 'comments',
        sortable: true,
        filter: true,
        minWidth: 140,
        cellClass: 'custom_comments'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Due date',
        field: 'dueDate',
        sortable: true,
        filter: true,
        minWidth: 130,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Submission date',
        field: 'subDate',
        sortable: true,
        filter: true,
        minWidth: 180
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptions',
        sortable: true,
        filter: true,
        minWidth: 140
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Resolved',
        field: 'resolved',
        sortable: true,
        filter: true,
        minWidth: 140
      },
    ];
  }

  searchActiveReports(input) {
    this.activeFilings = this.activeReports.filter(item => item.name.toLowerCase().indexOf((input.el.nativeElement.value).toLowerCase()) !== -1)
    this.activeReportsSearchNoDataAvilable = !!(this.activeFilings.length === 0);
  }

  onPasteSearchActiveReports(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");    
    pastedText.forEach((ele, index) => {
      if (/[A-Za-z0-9\-\_:/ ]+/.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  } 

  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[A-Za-z0-9\-\_:/ ]+/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  sortByDueDate(a, b) {
    let date1 = new Date(a.dueDate)
    let date2 = new Date(b.dueDate)
    if (date1 < date2) {
      return 1;
    } else if (date1 > date2) {
      return -1;
    } else {
      return 0;
    }
  }

  formatDate(timestamp) {
    let due = new Date(timestamp);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    return newdate;
  }

  isFirstColumn(params) {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };

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
}
