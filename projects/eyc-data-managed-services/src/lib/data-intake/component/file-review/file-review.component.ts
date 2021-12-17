import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { LegendPosition, colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';

import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { DataSummary } from '../../models/data-summary.model'

@Component({
  selector: 'lib-file-review',
  templateUrl: './file-review.component.html',
  styleUrls: ['./file-review.component.scss']
})
export class FileReviewComponent implements OnInit {
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  multi;
  gridApi;
  innerTabIn: number = 1;
  curDate;
  presentDate;
  totalFileCount = 0;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  dataFetch: number[];
  fileSummaries = [];

  // bar chart start
  fitContainer: boolean = false;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  legendTitle = 'Legend';
  legendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = 'Providers';
  xAxisLabel2 = 'Domain';
  showYAxisLabel = true;
  yAxisLabel = 'Files';
  showXAxisGridLines = false;
  showYAxisGridLines = true;
  barPadding = 50;
  roundDomains = false;
  roundEdges: boolean = false;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel: boolean = true;
  noBarWhenZero: boolean = true;
  trimXAxisTicks: boolean = true;
  trimYAxisTicks: boolean = true;
  rotateXAxisTicks: boolean = true;
  maxXAxisTickLength: number = 16;
  maxYAxisTickLength: number = 16;
  colorScheme;
  colorScheme2;
  colorScheme3;
  colorSchemeAll;
  //end option

  // table options
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

  @ViewChild('chipTemplate')
  chipTemplate : TemplateRef<any>;
  
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
  // end 

  // API Request match with response
  httpQueryParams: DataSummary;

  constructor(private dataManagedService: DataManagedService, private elementRef: ElementRef,
    private renderer: Renderer2, private customglobalService: CustomGlobalService) {
    this.setColorScheme();
  }
  setColorScheme() {
    this.colorScheme = colorSets.find(s => s.name === 'red');
    this.colorScheme2 = colorSets.find(s => s.name === 'orange');
    this.colorScheme3 = colorSets.find(s => s.name === 'teal');
    this.colorSchemeAll = colorSets.find(s => s.name === 'all');
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
    this.dailyManagedData();
    this.dailyDataProvider();
    this.getReviewFilesData();
    this.getReviewFileTableData();
  }

  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
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

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[A-Za-z0-9\-\_:/ ]+/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getReviewFileTableData() {
    this.dataManagedService.getReviewFileTableData().subscribe(resp => {
      resp.data["rowData"].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      this.glRowdata = resp.data["rowData"];
      this.columnGl = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'File',
          field: 'file',
          sortable: true,
          filter: true,
          resizeable: true,
          minWidth: 100,
          sort:'asc',
          wrapText: true,
          autoHeight: true
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
  
          headerName: 'Provider',
          field: 'provider',
          sortable: true,
          filter: true,
          minWidth: 10,
          wrapText: true,
          autoHeight: true
          
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
  
          headerName: 'Data Domain',
          field: 'data_domain',
  
          sortable: true,
          filter: true,
          minWidth: 100,
          wrapText: true,
          autoHeight: true
          
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
  
          headerName: 'Function',
          field: 'functions',
          sortable: true,
          filter: true,
          minWidth: 10,
          wrapText: true,
          autoHeight: true
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
  
          headerName: 'Due Date',
          field: 'due_date',
          sortable: true,
          filter: true,
          minWidth: 10,
          wrapText: true,
          autoHeight: true
          
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exceptions',
          field: 'exceptions',
          sortable: true,
          filter: true,
          minWidth: 10,
          wrapText: true,
          autoHeight: true,
        }, {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Status',
          field: 'Status',
          sortable: true,
          filter: true,
          minWidth: 300,
          wrapText: true,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.chipTemplate,
          }
        }
      ];
    })
  }


  formatDate(timestamp) {
    let due = new Date(timestamp);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    return newdate;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
    this.getReviewFileTableData();
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
    this.getReviewFileTableData();
  }

  innerTabChange(selectedTab) {
    this.innerTabIn = selectedTab;
  }

  select(event) {
    console.log(event);
  }
  activate(event) {
    console.log(event);
  }
  deactivate(event) {
    console.log(event);
  }

  getFileSummuries() {
    this.httpQueryParams =
    {
      startDate: '',
      EndDate: '',
      dataFrequency: 'All',
      dataIntakeType: 'dataProvider',
      dueDate: '2021-10-22',
      periodType: '',
      filterTypes: ['noIssues','high','low', 'medium', 'missingFiles', 'fileNotRecieved']
    };
    // Mock API integration for donut chart
    this.dataManagedService.getFileSummaryList(this.httpQueryParams).subscribe((dataSummuries: any) => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
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
    this.dailyManagedData();
    this.dailyDataProvider();
  }
  monthyData() {
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');
    this.monthyManagedData();
    this.monthyDataProvider();
  }

  dailyManagedData() {
    this.httpQueryParams =
    {
      startDate: '',
      EndDate: '',
      dataFrequency: 'Daily',
      dataIntakeType: 'dataProvider',
      dueDate: '2021-10-22',
      periodType: '',
      filterTypes: ['noissues','high','low', 'medium', 'pastDue', 'missingandpastdue', 'filesnotreceived']
    };
    // Mock API integration for donut chart
    this.dataManagedService.getFileSummaryList( this.httpQueryParams).subscribe((dataSummuries: any) => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
  }

  monthyManagedData() {
    this.httpQueryParams =
    {
      startDate: '',
      EndDate: '',
      dataFrequency: 'Monthly',
      dataIntakeType: 'dataProvider',
      dueDate: '2021-10-22',
      periodType: '',
      filterTypes: ['noissues','high','low', 'medium', 'pastDue', 'missingandpastdue', 'filesnotreceived']
    };
    // Mock API integration for donut chart
    this.dataManagedService.getFileSummaryList( this.httpQueryParams).subscribe((dataSummuries: any) => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
  }


  getDataProviderList() {
    this.dataManagedService.getDataProviderList().subscribe(data => {
      this.fileSummaries = data.data['dataSeries'];
      this.totalFileCount = data.data['totalCount'];
    });
  }

  dailyDataProvider() {
    // Mock API integration for donut chart
    this.dataManagedService.getDailyDataProviderList().subscribe(data => {
      this.fileSummaries = data.data['dataSeries'];
      this.totalFileCount = data.data['totalCount'];
    });
  }

  monthyDataProvider() {
    // Mock API integration for donut chart
    this.dataManagedService.getMonthlyDataProviderList().subscribe(data => {
      this.fileSummaries = data.data['dataSeries'];
      this.totalFileCount = data.data['totalCount'];
    });
  }


  getReviewFilesData() {
    // Mock API integration for Review File
    this.dataManagedService.getReviewFilesData().subscribe(data => {
      this.multi = data.data["dataseries"];
    });
  }

}
