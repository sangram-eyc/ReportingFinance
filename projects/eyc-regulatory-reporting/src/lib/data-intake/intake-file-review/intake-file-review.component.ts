import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { IntakeLandingService } from './../services/intake-landing.service';

import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { AutoUnsubscriberService, CellRendererTemplateComponent, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { DataSummary } from './../models/data-summary.model'
import { GridDataSet } from './../models/grid-dataset.model';
import { DataGrid, GroupByDataProviderCardGrid } from './../models/data-grid.model';

import { donutSummariesObject } from './../models/donut-chart-summary.model';
import { customComparator, sortCaseInsentitve, DATA_FREQUENCY, DATA_INTAKE_TYPE, DATA_INTAKE_TYPE_DISPLAY_TEXT, FILTER_TYPE, FILTER_TYPE_TITLE, ROUTE_URL_CONST, INPUT_VALIDATON_CONFIG } from './../../config/intake-config-helpers';
import { ApiStackSeriesItemDTO } from './../models/api-stack-series-Item-dto.model';
import { StackChartSeriesItemDTO } from './../models/stack-chart-series-Item-dto.model';
import { ApiSeriesItemDTO } from './../models/api-series-Item-dto.model';
import { BarChartSeriesItemDTO } from './../models/bar-chart-series-Item-dto.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RowClickedEvent } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { IntakeRoutingStateService } from './../services/intake-routing-state.service';
import { ApiReviewByGroupSeriesItemDTO } from './../models/api-reviewbygroup-dto.model';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

@Component({
  selector: 'lib-intake-file-review',
  templateUrl: './intake-file-review.component.html',
  styleUrls: ['./intake-file-review.component.scss']
})
export class IntakeFileReviewComponent implements OnInit, AfterViewInit {
  previousRoute: string;
  routeHistory: any;
  
  private unsubscriber: AutoUnsubscriberService;
  stackBarChartGridData = [];
  gridApi;
  innerTabIn: number = 1;
  presentDate: Date;
  totalFileCount = 0;
  dataIntakeTypeDisplay: object;
  dataIntakeTypeDisplayText = DATA_INTAKE_TYPE_DISPLAY_TEXT;
  routeUrlConst = ROUTE_URL_CONST;
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
  xAxisLabel = DATA_INTAKE_TYPE_DISPLAY_TEXT.DATA_PROVIDER.Plural;
  xAxisLabel2 = DATA_INTAKE_TYPE_DISPLAY_TEXT.DATA_DOMAIN.Plural;
  showYAxisLabel = true;
  yAxisLabel = 'Files';
  showXAxisGridLines = false;
  showYAxisGridLines = true;
  barPadding = 50;
  roundDomains = false;
  roundEdges: boolean = false;
  animations: boolean = true;
  isDisplay: boolean = false;
  calSelectedMonth: string;
  xScaleMin: number;
  xScaleMax: number;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel: boolean = true;
  noBarWhenZero: boolean = true;
  trimXAxisTicks: boolean = true;
  trimYAxisTicks: boolean = true;
  rotateXAxisTicks: boolean = true;
  maxXAxisTickLength: number = 13;
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
  lowIssueVariant: string = this.lightVariant;
  mediumIssueVariant: string = this.lightVariant;
  highIssueVariant: string = this.lightVariant;
  missingFileVariant: string = this.lightVariant;
  fileNotReceivedVariant: string = this.lightVariant;
  filterByIssueType: string = 'all';
  dataIntakeTypeUrl: string = '';
  filingName: string;
  period: string;
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
  filesCount:number;
  // end 

  // API Request match with response
  httpQueryParams: DataSummary;
  httpDataGridParams: DataGrid;
  httpReviewByGroupParams: GroupByDataProviderCardGrid;
  clientName = '';
  fileName = 'Files';
  isViewClicked = false;
  dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
  colorSchemeAll: Color = colorSets.find(s => s.name === 'all');

  customColors: any = [
    { name: FILTER_TYPE_TITLE.noIssues, value: this.colorSchemeAll.domain[0] },
    { name: FILTER_TYPE_TITLE.low, value: this.colorSchemeAll.domain[1] },
    { name: FILTER_TYPE_TITLE.medium, value: this.colorSchemeAll.domain[2] },
    { name: FILTER_TYPE_TITLE.high, value: this.colorSchemeAll.domain[3] },
    { name: FILTER_TYPE_TITLE.missingFiles, value: this.colorSchemeAll.domain[4] },
    { name: FILTER_TYPE_TITLE.fileNotReceived, value: this.colorSchemeAll.domain[5] },
  ];

  lastMonthDate: Date;
  lastMonthDueDateFormat: string;
  presentDateFormat: string;
  presentMonthDate: Date;
  presentMonthFormat: string;

  constructor(private IntakeLandingService: IntakeLandingService, private cdr: ChangeDetectorRef,private filingService: RegulatoryReportingFilingService,
    private renderer: Renderer2, private _router: Router, private _activatedroute: ActivatedRoute, private routingState: IntakeRoutingStateService) {
    console.log("File Review Page constructor", new Date().toISOString());
    this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true' ? true : false;
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth());
    this.lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    this.lastMonthDueDateFormat = this.IntakeLandingService.apiDateFormat(this.lastMonthDate);
    this.presentMonthDate = this.lastMonthDate;
    this.presentMonthFormat = this.IntakeLandingService.monthlyFormat(this.presentMonthDate);
  
    this._activatedroute.paramMap.subscribe(params => {
      if ((!!params.get('paramDataIntakeName')) && (!!params.get('paramDataIntakeType'))) {
        this.clientName = this.routingState.ngDecode(params.get('paramDataIntakeName').trim());
        this.isViewClicked = true;
        this.dataIntakeType = params.get('paramDataIntakeType');
        this.fileName = this.clientName;
        if (this.dataIntakeType == DATA_INTAKE_TYPE.DATA_PROVIDER) {
          this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_PROVIDER;
        }
        else {
          this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_DOMAIN;
          this.xAxisLabel = DATA_INTAKE_TYPE_DISPLAY_TEXT.DATA_DOMAIN.Plural;
        }
      }
      else {
        this.fileName = 'Files'
      }
    });
  }

  ngOnInit(): void {
    console.log("File Review Page Init", new Date().toISOString());
    const selectedDate = sessionStorage.getItem("selectedDate");
    this.filingName = this.filingService.getFilingData.filingName;
    this.period = this.filingService.getFilingData.period;
    if (selectedDate) {
      this.presentDate = new Date(new Date(selectedDate).toDateString());
      this.presentMonthDate = this.IntakeLandingService.monthLastDate(this.presentDate);
    } else {
      this.presentDate = this.IntakeLandingService.businessDate(new Date());
      this.presentMonthDate = this.IntakeLandingService.prevMonthLastDate(new Date());
    }
    this.presentDateFormat = this.IntakeLandingService.apiDateFormat(this.presentDate);

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
    if (this.routingState.getBrowserBackForwardButtonClick()) {
      this.previousRoute = this.routingState.getPreviousUrl();
      this.routeHistory = this.routingState.getHistory();
      this.dataIntakeTypeUrl = this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL));

    }
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
    console.log("File Review ngAfterViewInit", new Date().toISOString());
    let dueDate;
    dueDate = this.presentDateFormat;
    if (this.dailyMonthlyStatus) {
      this.presentMonthFormat = this.IntakeLandingService.monthlyFormat(this.presentMonthDate);
      dueDate = this.IntakeLandingService.apiDateFormat(this.presentMonthDate);
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
      clientName: this.clientName,
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

    

    this.fileSummaryList();
    this.getReviewFileTableData();
  }

  onRowClicked(event: RowClickedEvent) {
    if (event.data && event.data.name && event.data.auditFileGuidName && event.data.fileNameAlias && event.data.exceptions) {
      this._router.navigate([ROUTE_URL_CONST.FILE_EXCEPTION, event.data.name, event.data.auditFileGuidName, event.data.fileNameAlias]);
    } else {
      console.log("Data name is not getting");
      // This console is use for QA live env (RouterLink is working in local system but not in QA Env)
    }
  }

  routeToExceptionDetailsPage(event: any) {
    this._router.navigate([ROUTE_URL_CONST.FILE_EXCEPTION, event.name, event.auditFileGuidName, event.fileNameAlias]);
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
    if (!newstr) {
      return "--"
    }
    else if (newstr?.length > paramSize) {
      return (newstr).substr(0, paramSize) + '';
    } else {
      return newstr;
    }
  }

  getReviewFileTableData() {
    console.log("File Review Grid API Call Started", new Date().toISOString());
    this.IntakeLandingService.getReviewFileTableData(this.httpDataGridParams).subscribe(resp => {
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      this.glRowdata = resp['data'];
      this.filesCount = this.glRowdata.length;
      console.log("File Review Grid API Call End", new Date().toISOString());
      this.columnGl = [
        {
          valueGetter: "node.rowIndex + 1",
          getQuickFilterText: function(params) {
            return '';
          },
          maxWidth: 70,
          sortable: false,
          menuTabs: [],
          filter:false,
          pinned: 'left',
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
          
          cellRendererFramework: CellRendererTemplateComponent,
          headerName: 'File',
          field: 'name',
          minWidth: 220,
          wrapText: false,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.threeDotTooltip
          },
          comparator: sortCaseInsentitve,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
          
          headerName: 'Provider',
          field: 'provider',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 120,
          wrapText: true,
          autoHeight: true,
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
          
          headerName: 'Data domain',
          field: 'dataDomain',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 185,
          autoHeight: true,
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
          
          cellRendererFramework: CellRendererTemplateComponent,
          headerName: 'Functions',
          field: 'functions',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 180,
          wrapText: false,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.threeDotFunctionTooltip
          },
          comparator: sortCaseInsentitve,
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
          
          headerName: 'Due date',
          field: 'dueDate',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 160,
          wrapText: true,
          autoHeight: true,
          cellRenderer: (params) => {
            if ((params.data.dueDate < Date.now) && params.data.maxPriority == FILTER_TYPE.MISSING_FILES) {
              const date1 = new Date(params.data.dueDate);
              const date2 = new Date();

              // One day in milliseconds
              const oneDay = 1000 * 60 * 60 * 24;

              // Calculating the time difference between two dates
              const diffInTime = date2.getTime() - date1.getTime();

              // Calculating the no. of days between two dates
              const diffInDays = Math.round(diffInTime / oneDay);
              return "-" + diffInDays + " Days";

            } else if (params.data.dueDate) {
              return params.data.dueDate;
            }
            else {
              return '--'
            }
          },
          cellStyle: function (params) {
            if ((params.data.dueDate < Date.now) && params.data.maxPriority == FILTER_TYPE.MISSING_FILES) {
              return { color: 'red' }
            } else {
              return true;
            }
          },
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
          
          cellRendererFramework: CellRendererTemplateComponent,
          headerName: 'Exceptions',
          field: 'exceptions',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          wrapText: false,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.threeDotExceptionsTooltip
          },
          comparator: sortCaseInsentitve,
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        }, 
        {
          
          cellRendererFramework: CellRendererTemplateComponent,
          headerName: 'Status',
          field: 'maxPriority',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 250,
          sort: 'asc',
          comparator: customComparator,
          cellRendererParams: {
            ngTemplate: this.chipTemplate,
          },
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
          
          cellRendererFramework: CellRendererTemplateComponent,
          headerName: '',
          field: 'next',
          filter: false,
          sortable: false,
          menuTabs: [],
          minWidth: 100,
          cellRendererParams: {
            ngTemplate: this.nextButtonTemplate,
          },
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
      ];
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    console.log("File Review Grid Ready", new Date().toISOString());
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

   
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = this.dataIntakeType;;
      this.httpDataGridParams.dataIntakeType = this.dataIntakeType;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
      this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }

    if (!sessionStorage.getItem("selectedDate")) {
      this.httpQueryParams.dueDate = this.presentDateFormat;
      this.httpDataGridParams.dueDate = this.httpQueryParams.dueDate;
      this.patchDatePicker(this.presentDate);
    } else {
      const sesstionDate = this.IntakeLandingService.ymdToApiDateFormat(sessionStorage.getItem("selectedDate"));
      this.httpQueryParams.dueDate = sesstionDate;
      this.httpDataGridParams.dueDate = this.httpQueryParams.dueDate;
      this.patchDatePicker(new Date(sesstionDate));
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
   

    const monthlySelectedDate = sessionStorage.getItem("selectedDate");
    if (monthlySelectedDate) {
      this.presentMonthDate = this.IntakeLandingService.monthLastDate(new Date(monthlySelectedDate));
    } else {
      this.presentMonthDate = this.IntakeLandingService.prevMonthLastDate(new Date());
    }
    this.presentMonthFormat = this.IntakeLandingService.monthlyFormat(this.presentMonthDate);
    this.httpQueryParams.dueDate = this.IntakeLandingService.apiDateFormat(this.presentMonthDate);
    this.httpDataGridParams.dueDate = this.httpQueryParams.dueDate;

    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = this.dataIntakeType;;
      this.httpDataGridParams.dataIntakeType = this.dataIntakeType;;
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
    // Mock API integration for bar chart (Data Providers/ Data Domains)-
    console.log("File Review Summary API Call Started", new Date().toISOString());
    this.httpReviewByGroupParams.dataFrequency = this.httpDataGridParams.dataFrequency;
    this.httpReviewByGroupParams.dueDate = this.httpDataGridParams.dueDate;
    this.dataList = [];
    if (this.isViewClicked) {
      this.IntakeLandingService.getReviewByGroupProviderOrDomainGrid(this.httpReviewByGroupParams).subscribe((reviewData: any) => {
        this.manipulateStatusWithReviewByGroup(reviewData.data);
        console.log("File Review Summary API Call End", new Date().toISOString());
      });
    } else {
      this.totalFileCount = 0;
      this.IntakeLandingService.getReviewAllList(this.httpQueryParams).subscribe((dataProvider: any) => {
        this.stackBarChartData = [];
        this.fileSummaries = dataProvider.data[0].donutChartDTO;
        if (dataProvider.data[0] && dataProvider.data[0].barChartDTO.length > 0) {
          this.stackBarChartData = dataProvider.data[0].barChartDTO;
          this.totalFileCount = this.stackBarChartData.length;
        }
        console.log("File Review Summary API Call End", new Date().toISOString());
      });
    }
  }

  manipulateStatusWithResponse(fetchData: ApiStackSeriesItemDTO[]) {
    console.log("File Review manipulateStatusWithResponse Start", new Date().toISOString());
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
    console.log("File Review manipulateStatusWithResponse End", new Date().toISOString());
  }

  manipulateStatusWithReviewByGroup(fetchData: ApiReviewByGroupSeriesItemDTO[]) {
    console.log("File Review manipulateStatusWithReviewByGroup Start", new Date().toISOString());
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
    console.log("File Review manipulateStatusWithReviewByGroup End", new Date().toISOString());
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
      case FILTER_TYPE.LOW:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.lowIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.LOW]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.lowIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.LOW]);
        }
        break;
      case FILTER_TYPE.MEDIUM:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.mediumIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.MEDIUM]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.mediumIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.MEDIUM]);
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
          this.lowIssueVariant = this.lightVariant;
          this.mediumIssueVariant = this.lightVariant;
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
      this.lowIssueVariant = this.lightVariant;
      this.mediumIssueVariant = this.lightVariant;
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

  checkException(params) {
    return params.data && params.data.name && params.data.auditFileGuidName && params.data.fileNameAlias && params.data.exceptions;
  }
}
