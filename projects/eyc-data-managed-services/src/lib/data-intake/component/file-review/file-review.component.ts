import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';

import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { DataSummary } from '../../models/data-summary.model'
import { GridDataSet } from '../../models/grid-dataset.model';

import { donutSummariesObject } from '../../models/donut-chart-summary.model';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FileFilterStatus, FILTER_TYPE, FILTER_TYPE_TITLE } from '../../../config/dms-config-helper';
import { ApiStackSeriesItemDTO } from '../../models/api-stack-series-Item-dto.model';
import { StackChartSeriesItemDTO } from '../../models/stack-chart-series-Item-dto.model';
import { ApiSeriesItemDTO } from '../../models/api-series-Item-dto.model';
import { BarChartSeriesItemDTO } from '../../models/bar-chart-series-Item-dto.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lib-file-review',
  templateUrl: './file-review.component.html',
  styleUrls: ['./file-review.component.scss']
})
export class FileReviewComponent implements OnInit, AfterViewInit {
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  stackBarChartGridData = [];
  gridApi;
  innerTabIn: number = 1;
  curDate: string;
  presentDate: Date;
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
  xScaleMin: number;
  xScaleMax: number;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel: boolean = true;
  noBarWhenZero: boolean = true;
  trimXAxisTicks: boolean = true;
  trimYAxisTicks: boolean = true;
  rotateXAxisTicks: boolean = true;
  maxXAxisTickLength: number = 16;
  maxYAxisTickLength: number = 16;
  colorScheme: Color;
  colorScheme2: Color;
  colorScheme3: Color;
  colorSchemeAll: Color;
  //end option

  // table options
  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  noCompletedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  rowClass = 'row-style';
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';

  @ViewChild('chipTemplate') chipTemplate: TemplateRef<any>;
  @ViewChild('threeDotTooltip') threeDotTooltip: TemplateRef<any>;
  @ViewChild('nextButtonTemplate') nextButtonTemplate: TemplateRef<any>;

  @ViewChild('threeDotFunctionTooltip') threeDotFunctionTooltip: TemplateRef<any>;
  @ViewChild('threeDotExceptionsTooltip') threeDotExceptionsTooltip: TemplateRef<any>;

  stackBarChartData: StackChartSeriesItemDTO[];
  dataList: ApiStackSeriesItemDTO[];
  fileSummariesObject = donutSummariesObject;
  dailyMonthlyStatus: boolean = false;
  tabIn: number = 1;
  motifDatepModel: any;
  @ViewChild('dp') myDp;
  form: FormGroup;
  disabledDailyMonthlyButton: boolean = false;
  calSelectedDate: string;
  FILTER_TYPE_TITLE = FILTER_TYPE_TITLE;
  FILTER_TYPE = FILTER_TYPE;
  
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

  columnGl = [];
  glRowdata = [];
  // end 

  // API Request match with response
  httpQueryParams: DataSummary;

  constructor(private dataManagedService: DataManagedService, private cdr: ChangeDetectorRef,
    private renderer: Renderer2) {
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
    this.tabIn = 1;
    this.getReviewFilesData();
    this.getReviewFileTableData();
    this.form = new FormGroup({
      datepicker: new FormControl({
        isRange: false, 
        singleDate: {
          date: {
            year: this.presentDate.getFullYear(),
            month: this.presentDate.getMonth() + 1,
            day: this.presentDate.getDate()
          }
        }
      }, [Validators.required])
    });
  }
  
  ngAfterViewInit(): void {
    this.httpQueryParams =
    {
      startDate: '',
      EndDate: '',
      dataFrequency: DATA_FREQUENCY.MONTHLY,
      dataIntakeType: DATA_INTAKE_TYPE.DATA_PROVIDER,
      dueDate: `${formatDate(new Date(), 'yyyy-MM-dd', 'en')}`,
      periodType: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };
    this.fileSummaryList();
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

  stringTrim(params, paramSize) {
    if ((params).length > paramSize) {
      return (params).substr(0, paramSize) + ''
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
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
      this.dailyMonthlyStatus ? this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY
        : this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
      this.dailyMonthlyStatus ?
        this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY
        : this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY
    }
    this.fileSummaryList();
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

  dailyData(status: boolean) {
    // Daily data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY;
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'secondary')
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }
    this.fileSummaryList();
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }
    this.fileSummaryList();
  }


  fileSummaryList() {
    // Mock API integration for bar chart (Data Providers/ Data Domains)
    this.dataManagedService.getFileSummaryList(this.httpQueryParams).subscribe((dataProvider: any) => {
      this.dataList = dataProvider.data[0]['totalSeriesItem']; //dataSummuries.data[0]['totalSeriesItem'];
      this.totalFileCount = dataProvider.data[0]['totalCount'];
      this.manipulateStatusWithResponse(this.dataList);
    });
  }

  manipulateStatusWithResponse(fetchData: ApiStackSeriesItemDTO[]) {
    // Manipulate fetch-data as per status
    const cloneFileSummury = JSON.parse(JSON.stringify(donutSummariesObject));
    const stackBarChart = [];
    fetchData.find((fData) => {
      this.fileSummariesObject.map((summaryObject) => {
        if (fData.label === summaryObject.apiKey) {
          summaryObject.value = fData.value;
        }
      });
      fData.seriesItemDTO.map((seriesData) => {
        stackBarChart.push({
            name: FILTER_TYPE_TITLE[`${fData.label}`], // key mapping ,
            lable: seriesData.lable,
            value: seriesData.value
          }
        )
      });
    });
    // GroupBy fetch-data as per status
    const groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          { name: currentValue.name, value: currentValue.value }
        );
        return result;
      }, {});
    };
    this.fileSummaries = JSON.parse(JSON.stringify(this.fileSummariesObject));
    this.fileSummariesObject = cloneFileSummury;
    const stackBarChartNew = groupBy(stackBarChart, 'lable');
    const stackBarChartUpdated = [];
    // Fetch-data as per Stack Bar Chart
    for (const [key, value] of Object.entries(stackBarChartNew)) {
      stackBarChartUpdated.push({
        name: `${key}`,
        series: value
      })
    }
    this.stackBarChartData = stackBarChartUpdated as StackChartSeriesItemDTO[];
  }

  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.formatted;
    if (this.calSelectedDate) {
      this.httpQueryParams.dueDate = this.calSelectedDate;
      this.fileSummaryList();
    }
  }

  mapBarChartDataWithKey(fData: [ApiSeriesItemDTO]): BarChartSeriesItemDTO[] {
    return fData.map(({
      lable: name,
      ...rest
    }) => ({
      name,
      ...rest
    }));
  }

  getReviewFilesData() {
    // Mock API integration for Review File
    this.dataManagedService.getReviewFilesData().subscribe(data => {
      this.stackBarChartGridData = data.data["dataseries"];
    });
  }
}
