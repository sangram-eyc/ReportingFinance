import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';

import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { AutoUnsubscriberService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { DataSummary } from '../../models/data-summary.model'
import { GridDataSet } from '../../models/grid-dataset.model';
import { DataGrid, GroupByDataProviderCardGrid } from '../../models/data-grid.model';

import { donutSummariesObject } from '../../models/donut-chart-summary.model';
import { customComparator, DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE, FILTER_TYPE_TITLE, INPUT_VALIDATON_CONFIG } from '../../../config/dms-config-helper';
import { ApiStackSeriesItemDTO } from '../../models/api-stack-series-Item-dto.model';
import { StackChartSeriesItemDTO } from '../../models/stack-chart-series-Item-dto.model';
import { ApiSeriesItemDTO } from '../../models/api-series-Item-dto.model';
import { BarChartSeriesItemDTO } from '../../models/bar-chart-series-Item-dto.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RowClickedEvent } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiReviewByGroupSeriesItemDTO } from '../../models/api-reviewbygroup-dto.model';

@Component({
  selector: 'lib-file-review',
  templateUrl: './file-review.component.html',
  styleUrls: ['./file-review.component.scss']
})
export class FileReviewComponent implements OnInit, AfterViewInit {
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  private unsubscriber: AutoUnsubscriberService;
  stackBarChartGridData = [];
  gridApi;
  innerTabIn: number = 1;
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
  xAxisLabel2 = 'Domains';
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
  fileSummariesObject = JSON.parse(JSON.stringify(donutSummariesObject));
  dailyMonthlyStatus: boolean = false;
  tabIn: number = 1;
  motifDatepModel: any;
  form: FormGroup;
  disabledDailyMonthlyButton: boolean = false;
  calSelectedDate: string;
  FILTER_TYPE_TITLE = FILTER_TYPE_TITLE;
  FILTER_TYPE = FILTER_TYPE;
  lightVariant: string = "monochrome-light";
  darkVariant: string = "monochrome-dark";
  allIssueVariant: string = this.darkVariant;
  noIssueVariant: string = this.lightVariant;
  mediumLowIssueVariant: string = this.lightVariant;
  highIssueVariant: string = this.lightVariant;
  missingFileVariant: string = this.lightVariant;
  fileNotReceivedVariant: string = this.lightVariant;
  filterByIssueType: string = 'all';

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
  httpDataGridParams: DataGrid;
  httpReviewByGroupParams: GroupByDataProviderCardGrid;
  clientName = '';
  isViewClicked = false;
  dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
  colorSchemeAll:Color = colorSets.find(s => s.name === 'all');

  customColors: any = [
    { name: FILTER_TYPE_TITLE.noIssues, value: this.colorSchemeAll.domain[0] },
    { name: FILTER_TYPE_TITLE.mediumLow, value: this.colorSchemeAll.domain[1] },
    { name: FILTER_TYPE_TITLE.high, value: this.colorSchemeAll.domain[2] },
    { name: FILTER_TYPE_TITLE.missingFiles, value: this.colorSchemeAll.domain[3] },
    { name: FILTER_TYPE_TITLE.fileNotReceived, value: this.colorSchemeAll.domain[4] }
  ];

  constructor(private dataManagedService: DataManagedService, private cdr: ChangeDetectorRef,
    private renderer: Renderer2, private _router: Router, private _activatedroute: ActivatedRoute) {
      this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true'? true: false;
      this._activatedroute.paramMap.subscribe(params => {
        if(params.get('paramDataIntakeName') !== '' && params.get('paramDataIntakeType') !== '') {
          this.clientName = params.get('paramDataIntakeName');
          this.isViewClicked = true;
          this.dataIntakeType = params.get('paramDataIntakeType');
          this.xAxisLabel = '';
        }
      });
  }

  ngOnInit(): void {
    const selectedDate = sessionStorage.getItem("selectedDate");
    if (selectedDate) {
      this.presentDate = new Date(selectedDate);
    } else {
      this.presentDate = this.dataManagedService.businessDate(new Date());
    }
    this.presentDateFormat = `${formatDate(this.presentDate, 'yyyy-MM-dd', 'en')}`;

    this.tabIn = 1;
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

  patchDatePicker(patchDatePickerValue: Date) {
    const updateDatePicker = {
      isRange: false,
      singleDate: {
        date: {
          year: patchDatePickerValue.getFullYear(),
          month: patchDatePickerValue.getMonth() + 1,
          day: patchDatePickerValue.getDate()
        }
      }
    };
    this.form.patchValue({ datepicker: updateDatePicker });
  }

  ngAfterViewInit(): void {
    let dueDate;
    if (sessionStorage.getItem("selectedDate")) {
      dueDate = sessionStorage.getItem("selectedDate");
    } else if (this.dailyMonthlyStatus) {
      dueDate = this.lastMonthDueDateFormat;
      this.patchDatePicker(this.lastMonthDate);
    } else {
      dueDate = this.presentDateFormat;
    }
    this.httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: DATA_INTAKE_TYPE.DATA_PROVIDER,
      dueDate: dueDate,
      periodType: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };
    this.httpDataGridParams = {
      startDate: '',
      endDate: '',
      dataFrequency: this.httpQueryParams.dataFrequency,
      dataIntakeType: this.dataIntakeType,
      dueDate: this.httpQueryParams.dueDate,
      periodType: '',
      clientName: '',
      reportType: '',
      summaryType: '',
      queryPhrase: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };
    this.httpReviewByGroupParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: this.dataIntakeType,
      dueDate: this.httpQueryParams.dueDate,
      periodType: '',
      auditFileGuidName: '',
      fileId: '',
      fileName: '',
      clientName: this.clientName,
      reportId: '',
      reportName: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
      isViewClicked: this.isViewClicked
    };

    if(this.dailyMonthlyStatus) {
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
    } else {
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');
    }

    this.fileSummaryList();
    this.getReviewFileTableData();
  }

  onRowClicked(event: RowClickedEvent) {
    if (event.data && event.data.name && event.data.auditFileGuidName && event.data.fileNameAlias && event.data.exceptions) {
      this._router.navigate(['/data-managed-services/files/exceptions', event.data.name, event.data.auditFileGuidName, event.data.fileNameAlias]);
    } else {
      console.log("Data name is not getting");
      // This console is use for QA live env (RouterLink is working in local system but not in QA Env)
    }
  }

  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
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

  stringTrim(params, paramSize) {
    const newstr = params.replace(/\s+/g, ' ').trim();
    if (newstr?.length > paramSize) {
      return (newstr).substr(0, paramSize) + '';
    } else {
      return newstr;
    }
  }

  getReviewFileTableData() {
    this.dataManagedService.getReviewFileTableData(this.httpDataGridParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe(resp => {
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      this.glRowdata = resp['data'];
      this.columnGl = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'File',
          field: 'name',
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
          field: 'dataDomain',
          sortable: true,
          filter: true,
          minWidth: 100,
          wrapText: true,
          autoHeight: true
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Functions',
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
          field: 'dueDate',
          sortable: true,
          filter: true,
          minWidth: 100,
          wrapText: true,
          autoHeight: true,
          cellStyle: function (params) {
            if ((params.data.dueDate < Date.now) && params.data.maxPriority == FILTER_TYPE.MISSING_FILES) {
              return { color: 'red' }
            } else {
              return true;
            }
          },
          valueGetter: function (params) {
            if ((params.data.dueDate < Date.now) && params.data.maxPriority == FILTER_TYPE.MISSING_FILES) {
              const date1 = new Date(params.data.dueDate);
              const date2 = new Date();

              // One day in milliseconds
              const oneDay = 1000 * 60 * 60 * 24;

              // Calculating the time difference between two dates
              const diffInTime = date2.getTime() - date1.getTime();

              // Calculating the no. of days between two dates
              const diffInDays = Math.round(diffInTime / oneDay);

              return "-"+diffInDays+" Days";
            } else if(params.data.dueDate) {
              return params.data.dueDate;
            }
            else {
              return '--'
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
          minWidth: 200,
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
          field: 'maxPriority',
          sortable: true,
          filter: true,
          minWidth: 200,
          sort: 'asc',
          comparator: customComparator,
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
          minWidth: 100,
          cellRendererParams: {
            ngTemplate: this.nextButtonTemplate,
          }
        },
      ];
    });
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
      this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;

      this.dailyMonthlyStatus ? this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY
        : this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY

      this.dailyMonthlyStatus ? this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.MONTHLY
        : this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.DAILY

    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
      this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;

      this.dailyMonthlyStatus ?
        this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY
        : this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY

      this.dailyMonthlyStatus ?
        this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.MONTHLY
        : this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.DAILY
    }
    this.fileSummaryList();
    this.getReviewFileTableData();
  }

  dailyData(status: boolean) {
    // Daily data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY;
    this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.DAILY;

    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '')
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
      this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
      this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }
    if (!sessionStorage.getItem("selectedDate")) {
      this.httpQueryParams.dueDate = this.presentDateFormat;
      this.httpDataGridParams.dueDate = this.httpQueryParams.dueDate;
      this.patchDatePicker(this.presentDate);
    }
    this.fileSummaryList();
    this.getReviewFileTableData();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
    this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.MONTHLY;

    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
      this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
      this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }

    if (!sessionStorage.getItem("selectedDate")) {
      this.patchDatePicker(this.lastMonthDate);
      this.httpQueryParams.dueDate = this.lastMonthDueDateFormat;
      this.httpDataGridParams.dueDate = this.httpQueryParams.dueDate;
    }
    this.fileSummaryList();
    this.getReviewFileTableData();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }


  fileSummaryList() {
    // Mock API integration for bar chart (Data Providers/ Data Domains)
    this.dataList = [];
    if(this.isViewClicked) {
      this.dataManagedService.getReviewByGroupProviderOrDomainGrid(this.httpReviewByGroupParams).subscribe((reviewData: any) => {
        this.manipulateStatusWithReviewByGroup(reviewData.data);
      });
    } else {
      this.dataManagedService.getFileSummaryList(this.httpQueryParams).subscribe((dataProvider: any) => {
        this.dataList = dataProvider.data[0]['totalSeriesItem'];
        this.totalFileCount = dataProvider.data[0]['totalCount'];
        this.manipulateStatusWithResponse(this.dataList);
      });
    }
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

  manipulateStatusWithReviewByGroup(fetchData: ApiReviewByGroupSeriesItemDTO[]) {
    const cloneFileSummury = JSON.parse(JSON.stringify(donutSummariesObject));
    let stackBarChartDataReviewByGroup = fetchData.map((fData) => {
      fData.fastFilters.map((fDataSeries) => {
        this.fileSummariesObject.map((summaryObject) => {
          if (fDataSeries.lable === summaryObject.apiKey) {
            summaryObject.value += fDataSeries.value;
          }
        });
      });
      return {
        name: fData.dataIntakeName,
        series: this.mapBarChartDataWithKey(fData.fastFilters)
      };
    });
    this.fileSummaries = JSON.parse(JSON.stringify(this.fileSummariesObject));
    this.fileSummariesObject = cloneFileSummury;
    this.stackBarChartData = stackBarChartDataReviewByGroup as StackChartSeriesItemDTO[];
    this.totalFileCount = this.stackBarChartData.length;
  }

  mapBarChartDataWithKey(fData: any): BarChartSeriesItemDTO[] {
    return fData.map(({
      lable: name,
      ...rest
    }) => ({
      name,
      ...rest
    }));
  }

  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.formatted;
    if (this.calSelectedDate) {
      this.httpQueryParams.dueDate = this.calSelectedDate;
      this.httpDataGridParams.dueDate = this.calSelectedDate;
      this.fileSummaryList();
      this.getReviewFileTableData();
      sessionStorage.setItem("selectedDate", `${this.calSelectedDate}`);
    }
  }

  filterByIssues(issues: string, variants: string) {
    if (this.httpQueryParams.filterTypes.length >= 5 && this.allIssueVariant === this.darkVariant) {
      this.httpQueryParams.filterTypes = [];
    }
    switch (issues) {
      case FILTER_TYPE.NO_ISSUES:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.noIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.NO_ISSUES]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.noIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.NO_ISSUES]);
        }
        break;
      case FILTER_TYPE.MEDIUM_LOW:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.mediumLowIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.MEDIUM, FILTER_TYPE.LOW]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.mediumLowIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.MEDIUM, FILTER_TYPE.LOW]);
        }
        break;
      case FILTER_TYPE.HIGH:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.highIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.HIGH]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.highIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.HIGH]);
        }
        break;
      case FILTER_TYPE.MISSING_FILES:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.missingFileVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.MISSING_FILES]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.missingFileVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.MISSING_FILES]);
        }
        break;
      case FILTER_TYPE.FILE_NOT_RECIEVED:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.FILE_NOT_RECIEVED]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.FILE_NOT_RECIEVED]);
        }
        break;
      case 'all':
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.darkVariant;
          this.noIssueVariant = this.lightVariant;
          this.mediumLowIssueVariant = this.lightVariant;
          this.highIssueVariant = this.lightVariant;
          this.missingFileVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.lightVariant;
          this.httpQueryParams.filterTypes = [
            FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
            FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED];
        }
        break;
      default:
        break;
    }
    if (this.httpQueryParams.filterTypes.length <= 0) {
      this.allIssueVariant = this.darkVariant;
      this.noIssueVariant = this.lightVariant;
      this.mediumLowIssueVariant = this.lightVariant;
      this.highIssueVariant = this.lightVariant;
      this.missingFileVariant = this.lightVariant;
      this.fileNotReceivedVariant = this.lightVariant;
      this.httpQueryParams.filterTypes = [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED];
    }
    this.httpReviewByGroupParams.filterTypes = this.httpQueryParams.filterTypes;
    this.fileSummaryList();
    this.httpDataGridParams.filterTypes = this.httpQueryParams.filterTypes;
    this.getReviewFileTableData();
    this.cdr.detectChanges();
  }

  filterTypes(method: string, types: string[]) {
    switch (method) {
      case 'push':
        types.map((type) => {
          const index = this.httpQueryParams.filterTypes.indexOf(type);
          (index < 0)
            ? this.httpQueryParams.filterTypes.push(type)
            : null;
        });
        break;
      case 'pop':
        types.map((type) => {
          const index = this.httpQueryParams.filterTypes.indexOf(type);
          (index !== -1) ? this.httpQueryParams.filterTypes.splice(index, 1) : null;
        });
        break;
      default:
        break;
    }
  }
}
