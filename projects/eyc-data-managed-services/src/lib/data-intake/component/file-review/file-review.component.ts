import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { LegendPosition, colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';

import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-file-review',
  templateUrl: './file-review.component.html',
  styleUrls: ['./file-review.component.scss']
})
export class FileReviewComponent implements OnInit {
  single: any[] = [];
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  multi;
  gridApi;
  innerTabIn: number = 1;
  activeReports: any;
  curDate;
  presentDate;
  totalFileCount = 50;
  // totalFileCount=0;

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


  activeFilings: any[] = [];
  completedFilings: any[] = [];
  filingResp: any[] = [];

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  // searchNoDataAvilable = false;
  // activeReportsSearchNoDataAvilable = false;
  noCompletedDataAvilable = false;
  // noActivatedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  // gridApi;
  rowData;
  rowClass = 'row-style';
  columnDefs;
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';

  @ViewChild('chipTemplate') chipTemplate: TemplateRef<any>;
  @ViewChild('threeDotTooltip') threeDotTooltip: TemplateRef<any>;
  @ViewChild('nextButtonTemplate') nextButtonTemplate: TemplateRef<any>;

  @ViewChild('threeDotFunctionTooltip') threeDotFunctionTooltip: TemplateRef<any>;
  @ViewChild('threeDotExceptionsTooltip') threeDotExceptionsTooltip: TemplateRef<any>;
  

  

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

  constructor(private dataManagedService: DataManagedService, private elementRef: ElementRef,
    private renderer: Renderer2, private customglobalService: CustomGlobalService) {
    this.setColorScheme();
  }
  setColorScheme() {
    // this.selectedColorScheme = 'red';
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

  // table methods

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
  stringTrim(params) {
    if ((params).length > 17) {
      return (params).substr(0, 17) + ''
    } else {
      return params
    }
  }
  getReviewFileTableData() {
    this.dataManagedService.getReviewFileTableData().subscribe(resp => {
      resp.data["rowData"].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      this.glRowdata = resp.data["rowData"];
      this.columnGl = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'File',
          field: 'file',
          sortable: true,
          filter: true,
          minWidth: 150,
          wrapText: false,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.threeDotTooltip
          }
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Provider',
          field: 'provider',
          sortable: true,
          filter: true,
          minWidth: 100,
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
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Function',
          field: 'functions',
          sortable: true,
          filter: true,
          minWidth: 100,
          wrapText: false,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.threeDotFunctionTooltip
          },
          valueGetter: function (params) {
            if ((params.data.functions).length > 4) {
              return (params.data.functions).substr(0, 4) + ' ...'
            } else {
              return params.data.functions
            }
          }
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Due Date',
          field: 'due_date',
          sortable: true,
          filter: true,
          minWidth: 100,
          wrapText: true,
          autoHeight: true,
          cellStyle: function (params) {
            if ((params.data.data_domain).length < 10) {
              return { color: 'red' }
            } else {
              return true;
            }
          }
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Exceptions',
          field: 'exceptions',
          sortable: true,
          filter: true,
          minWidth: 100,
          wrapText: false,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.threeDotExceptionsTooltip
          },
          valueGetter: function (params) {
            if (params.data.exceptions) {
              return params.data.exceptions
            } else {
              return '--'
            }
          }
        }, {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Status',
          field: 'Status',
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
          headerName: '',
          field: 'next',
          sortable: false,
          filter: false,
          minWidth: 150,
          cellRendererParams: {
            ngTemplate: this.nextButtonTemplate,
          }
        },
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
  // end 
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
    // Mock API integration for donut chart
    this.dataManagedService.getFileSummaryList().subscribe(dataSummuries => {
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
    // Mock API integration for donut chart
    this.dataManagedService.getDailyFileSummaryList().subscribe(dataSummuries => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
  }

  monthyManagedData() {
    // Mock API integration for donut chart
    this.dataManagedService.getMonthlyFileSummaryList().subscribe(dataSummuries => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
  }


  getDataProviderList() {
    this.dataManagedService.getDataProviderList().subscribe(data => {
      this.single = data.data['dataSeries'];
      this.totalFileCount = data.data['totalCount'];
    });
  }

  dailyDataProvider() {
    // Mock API integration for donut chart
    this.dataManagedService.getDailyDataProviderList().subscribe(data => {
      this.single = data.data['dataSeries'];
      this.totalFileCount = data.data['totalCount'];
    });
  }

  monthyDataProvider() {
    // Mock API integration for donut chart
    this.dataManagedService.getMonthlyDataProviderList().subscribe(data => {
      this.single = data.data['dataSeries'];
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
