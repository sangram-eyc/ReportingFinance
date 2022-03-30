import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { ArchivedReportsService } from '../services/archived-reports.service';


@Component({
  selector: 'lib-archived-reports',
  templateUrl: './archived-reports.component.html',
  styleUrls: ['./archived-reports.component.css']
})
export class ArchivedReportsComponent implements OnInit {

  constructor(private archivedReportsService: ArchivedReportsService) { }


  activeReport: any[] = [];
  activeReports: any[] = []
  completedReports: any[] = [];
  reportResp: any[] = [];

  noOfCompletdFilingRecords = 10;
  currentPage = 0;
  maxPages = 5;
  searchNoDataAvilable = false;
  activeReportsSearchNoDataAvilable = false;
  noCompletedDataAvilable = false;
  noActivatedDataAvilable = false;
  calledProductCyclesList = false;
  calledManagementReport = false;
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

  @ViewChild('taxReportNameTemplate')
  taxReportName: TemplateRef<any>;
  @ViewChild('totalFundsTemplate')
  totalFunds: TemplateRef<any>;
  @ViewChild('totalCommentsTemplate')
  totalComments: TemplateRef<any>;

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
    value: 20,
    name: '20',
    id: 0
  };


  ngOnInit(): void {
    this.getArchivedReportData();
  }

  getArchivedReportData() {
    this.archivedReportsService.getArchivedReportsData().subscribe(resp => {
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.name,
          id: item.id,
          fundCount: item.fundCount != null ? item.fundCount : 0,
          CommentsCount: item.commentsCount != null ? item.commentsCount : 0,
        };
        this.completedReports.push(eachitem);
      });
      this.createHistoryRowData();
    });
  }

  createHistoryRowData() {
    this.rowData = [];
    this.completedReports.forEach(reportRow => {
      this.rowData.push({
        name: reportRow.name,
        id: reportRow.id,
        fundCount: reportRow.fundCount,
        CommentsCount: reportRow.CommentsCount,
      })
    });
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.taxReportName,
        },
        headerName: 'Tax Report Name',
        field: 'name',
        sortable: true,
        filter: true,
        resizeable: true,
        width: 250,
        sort: 'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.totalFunds,
        },
        headerName: 'Total Funds',
        field: 'fundCount',
        sortable: true,
        filter: true,
        resizeable: true,
        width: 250,
        sort: 'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.totalComments,
        },
        headerName: 'Comments',
        field: 'CommentsCount',
        sortable: true,
        filter: true,
        resizeable: true,
        width: 250,
        sort: 'asc'
      },
    ]
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

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  searchGrid(input) {
    this.gridApi.setQuickFilter(input);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }
}
