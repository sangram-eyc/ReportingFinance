import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { TaxReportingFilingService } from '../services/tax-reporting-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import {customComparator} from '../../config/tax-config-helper';
import { CustomGlobalService } from 'eyc-ui-shared-component';
@Component({
  selector: 'lib-tax-reporting',
  templateUrl: './tax-reporting-component.html',
  styleUrls: ['./tax-reporting-component.scss']
})
export class TaxReportingComponent implements OnInit {

  tabIn;
  constructor(
    private filingService: TaxReportingFilingService,
    private customglobalService: CustomGlobalService
  ) { }

  nameReport:string = 'Client ABC, Inc.';
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
    // this.getCompletedFilingsData();
  }
    
  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }

  ngAfterViewInit(): void {

  }

  getActiveFilingsData() {
    
    /* let resp = [
      {name: 'Management Report',author:'Janes Smith',createdDate:'06/28/12',downloadUrl:'asdasd'},
      {name: 'Management Report',author:'Janes Smith',createdDate:'07/28/12',downloadUrl:'asdasd'},
      {name: 'Management Report',author:'Janes Smith',createdDate:'08/28/12',downloadUrl:'asdasd'},
      {name: 'Management Report',author:'Janes Smith',createdDate:'09/28/12',downloadUrl:'asdasd'},
      {name: 'Management Report',author:'Janes Smith',createdDate:'10/28/12',downloadUrl:'asdasd'}
    ]; */
  
      this.filingService.getFilings().subscribe(resp => {
        this.filingResp.push(resp);
        resp.length === 0 ? this.noActivatedDataAvilable = true : this.noActivatedDataAvilable = false;
        resp.forEach((item) => {
          const eachitem: any = {
            name: item.name,
            author: item.author,
            createdDate: item.createdDate,
            downloadUrl: item.downloadUrl
          };
          this.activeFilings.push(eachitem);
          this.activeReports.push(eachitem);
        });
        this.activeFilings = this.customglobalService.sortFilings(this.activeFilings)
        this.createHistoryRowData();
      });
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
        sort:'asc',
        comparator: customComparator
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
    // this.getCompletedFilingsData();
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
    // this.getCompletedFilingsData();
  }
}
