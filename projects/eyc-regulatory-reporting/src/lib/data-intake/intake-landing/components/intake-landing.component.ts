import {
  Component, OnInit, ElementRef,
  Renderer2, ViewChild, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { StackChartSeriesItemDTO } from '../../models/stack-chart-series-Item-dto.model';
import { ApiReviewByGroupSeriesItemDTO } from '../../models/api-reviewbygroup-dto.model';
import { IntakeLandingService } from './../../services/intake-landing.service';
import { formatDate,DatePipe } from '@angular/common';
import {
  FileFilterStatus, FILTER_TYPE,
  DATA_INTAKE_TYPE, DATA_FREQUENCY,ROUTE_URL_CONST,
  NO_FILE_MISSING_PAST_DUE, NO_HIGH_PRIORITY_ISSUES, NO_LOW_PRIORITY_ISSUES, NO_MEDUIM_PRIORITY_ISSUES,
  PowerBiReportDailyList, PowerBiReportMonthlyList,PowerBiReportDailyListProd,PowerBiReportMonthlyListProd,PBI_CONFIG, FILTER_TYPE_TITLE
} from './../../../config/intake-config-helpers';
import { DataSummary } from './../../models/data-summary.model';
import { BarChartSeriesItemDTO } from './../../models/bar-chart-series-Item-dto.model';
import { ApiSeriesItemDTO } from './../../models/api-series-Item-dto.model';
import { donutSummariesObject } from './../../models/donut-chart-summary.model';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';
import { RegulatoryReportingFilingService } from './../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

@Component({
  selector: 'lib-intake-landing',
  templateUrl: './intake-landing.component.html',
  styleUrls: ['./intake-landing.component.scss']
})
export class IntakeLandingComponent implements OnInit, AfterViewInit {

  fileMissingPastDueData: BarChartSeriesItemDTO[];
  fileMissingPastDueCount: number = 0;
  highPriorityIssuesData: BarChartSeriesItemDTO[];
  highPriorityIssuesCount: number = 0;
  mediumPriorityData: BarChartSeriesItemDTO[];
  mediumPriorityCount: number = 0;
  lowPriorityData: BarChartSeriesItemDTO[];
  lowPriorityCount: number = 0;
  dataList: [];
  dailyMonthlyStatus: boolean = true;
  disabledDailyMonthlyButton: boolean = true;
  reviewByGroupDomains: number = 0;
  reviewByGroupProviders: number = 0;
  noFileMissingPastDue = NO_FILE_MISSING_PAST_DUE;
  noHighPriorityIssues = NO_HIGH_PRIORITY_ISSUES;
  noLowPriorityIssues = NO_LOW_PRIORITY_ISSUES;
  noMediumPriorityIssues = NO_MEDUIM_PRIORITY_ISSUES;
  routeUrlConst=ROUTE_URL_CONST;
  dataIntakeType=DATA_INTAKE_TYPE;
  pbiConfig=PBI_CONFIG

  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;

  @ViewChild('dailyfilter2', { static: false }) dailyfilter2: ElementRef;
  @ViewChild('monthlyfilter2', { static: false }) monthlyfilter2: ElementRef;

  stackBarChartData: StackChartSeriesItemDTO[];
  tabIn: number = 1;
  innerTabIn: number = 1;
  presentDate: Date;
  presentMonth: Date;
  totalFileCount = 0;
  calSelectedDate: string;
  calSelectedMonth: string;
  powerBiReportId:string;
  pod:string="DMS";
  reportID:string="304fc8b5-4ba4-4760-b0c3-a85af3b1c17b";
  curDate:string;


  reports:any;
  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  fileSummaries = [];
  fileSummariesObject = JSON.parse(JSON.stringify(donutSummariesObject));
  reviewAllDisabled: boolean = true;

  // API Request match with response
  httpQueryParams: DataSummary;
  businessDayQueryParams:DataSummary;

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
  tooltipDisabled = true;
  showText = true;
  xAxisLabel = 'Providers';
  xAxisLabel2 = 'Domains';
  xAxisLabel3='Business Days'
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
  maxXAxisTickLength: number = 13;
  maxYAxisTickLength: number = 16;
  colorScheme: Color;
  colorScheme2: Color;
  colorScheme3: Color;
  colorScheme4: Color;
  colorSchemeAll: Color = colorSets.find(s => s.name === 'all');
  customColors: any = [
    { name: FILTER_TYPE_TITLE.noIssues, value: this.colorSchemeAll.domain[0] },
    { name: FILTER_TYPE_TITLE.low, value: this.colorSchemeAll.domain[1] },
    { name: FILTER_TYPE_TITLE.medium, value: this.colorSchemeAll.domain[2] },
    { name: FILTER_TYPE_TITLE.high, value: this.colorSchemeAll.domain[3] },
    { name: FILTER_TYPE_TITLE.missingFiles, value: this.colorSchemeAll.domain[4] },
    { name: FILTER_TYPE_TITLE.fileNotReceived, value: this.colorSchemeAll.domain[5] },
  ];

  //end option
  form: FormGroup;
  businessDays: boolean = false;
  lastMonthDate: Date;
  curDateVal:Date;
  lastMonthDueDateFormat: string;
  presentDateFormat: string;
  dueDate:any;
  PBI_BASE_EMBED_URL:string;
  PBI_BASE_EMBED_TOKEN_URL:string;
  baseURL:string;
  prodUrl='/trp/';
  presentMonthDate: Date;
  presentMonthFormat: string;
  filingName: any;
  period: any;

  constructor(
    private intakeLandingService: IntakeLandingService,
    private filingService: RegulatoryReportingFilingService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private unsubscriber: AutoUnsubscriberService) {
    this.setColorScheme();
    this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true'? true: false;
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth());
    this.lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    this.lastMonthDueDateFormat = this.intakeLandingService.apiDateFormat(this.lastMonthDate);
    this.presentMonthDate =  this.lastMonthDate;
    this.presentMonthFormat = this.intakeLandingService.monthlyFormat(this.presentMonthDate);
  }

  ngOnInit(): void {

    if (this.filingService.getFilingData) {
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
     
    }

    this.curDate = this.intakeLandingService.monthlyFormat(this.lastMonthDate);
    const selectedDate = sessionStorage.getItem("selectedDate");
    if (selectedDate) {
      this.presentDate = new Date(new Date(selectedDate).toDateString());
      this.presentMonthDate = this.intakeLandingService.monthLastDate(this.presentDate);
    } else {
      this.presentDate = this.intakeLandingService.businessDate(new Date());
      this.presentMonthDate = this.intakeLandingService.prevMonthLastDate(new Date());
    }
    this.presentDateFormat = this.intakeLandingService.apiDateFormat(this.presentDate);
    
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

  ngAfterViewInit(): void {
    this.baseURL = sessionStorage.getItem('pbiEndPoint');
    console.log('dms data intake-ngAfterViewInit base url',this.baseURL);
    this.dueDate = this.presentDateFormat;
    if (this.dailyMonthlyStatus) {
      this.presentMonthFormat = this.intakeLandingService.monthlyFormat(this.presentMonthDate);
      this.dueDate = this.intakeLandingService.apiDateFormat(this.presentMonthDate);
    }

    this.httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: DATA_INTAKE_TYPE.DATA_PROVIDER,
      dueDate: this.dueDate,
      regulationFormReportingPeriodDate: this.period,
      displayName: this.filingName,
      periodType: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };

    this.businessDayQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: DATA_INTAKE_TYPE.BUSINESS_DAY,
      dueDate: this.dueDate,
      regulationFormReportingPeriodDate: this.period,
      displayName: this.filingName,
      periodType: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };

    if(this.dailyMonthlyStatus) {
      if(this.baseURL.includes(this.prodUrl)){
        this.reports = PowerBiReportMonthlyListProd;
      }
      else{
        this.reports = PowerBiReportMonthlyList;
      }
    } else {
      if(this.baseURL.includes(this.prodUrl)){
        this.reports = PowerBiReportDailyListProd;
      }
      else{
        this.reports = PowerBiReportDailyList;
      }
    }
    this.getstackBarchart();
    this.fileSummaryList();
  }

  

  setColorScheme() {
    this.colorScheme = colorSets.find(s => s.name === 'red');
    this.colorScheme2 = colorSets.find(s => s.name === 'orange');
    this.colorScheme3 = colorSets.find(s => s.name === 'teal');
    this.colorScheme4 = colorSets.find(s => s.name === 'blue');  // Blue
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }

  innerTabChange(selectedTab) {
    this.innerTabIn = selectedTab;
    if (this.innerTabIn == 1) {
      this.getstackBarchart();
    } else if(this.innerTabIn == 2) {
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

  mapBarChartDataWithKey(fData: [ApiSeriesItemDTO]): BarChartSeriesItemDTO[] {
    return fData.map(({
      lable: name,
      ...rest
    }) => ({
      name,
      ...rest
    }));
  }

  manipulateStatusWithResponse(fetchData: any[]) {
    // Manipulate fetch-data as per status
    const cloneFileSummury = JSON.parse(JSON.stringify(donutSummariesObject));
    this.fileMissingPastDueCount = 0;
    this.fileMissingPastDueData = [];
    this.highPriorityIssuesCount = 0;
    this.highPriorityIssuesData = [];
    this.mediumPriorityCount = 0;
    this.mediumPriorityData = [];
    this.lowPriorityCount = 0;
    this.lowPriorityData = [];
    this.fileSummaries = cloneFileSummury;
    fetchData.find((fData) => {
      this.fileSummariesObject.map((summaryObject) => {
        if (fData.label === summaryObject.apiKey) {
          summaryObject.value = fData.value;
        }
      });
      switch (fData.label) {
        case FileFilterStatus.missingFilesPastDue.apiKey:
          this.fileMissingPastDueCount = fData.value;
          this.fileMissingPastDueData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
          break;
        case FileFilterStatus.highPriorityIssues.apiKey:
          this.highPriorityIssuesCount = fData.value;
          this.highPriorityIssuesData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
          break;
        case FileFilterStatus.mediumPriority.apiKey:
          this.mediumPriorityCount = fData.value;
          this.mediumPriorityData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
          break;
        case FileFilterStatus.lowPriority.apiKey:
          this.lowPriorityCount = fData.value;
          this.lowPriorityData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
          break;
        default:
      }
    });
    this.fileSummaries = JSON.parse(JSON.stringify(this.fileSummariesObject));
    this.fileSummariesObject = cloneFileSummury;
  }

  fileSummaryList() {
    // Mock API integration for bar chart (Data Providers/ Data Domains)
    this.reviewByGroupDomains = 0;
    this.reviewByGroupProviders = 0;
    this.dataList = [];
    this.intakeLandingService.getFileSummaryList(this.httpQueryParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe((dataSummuries: any) => {
      this.dataList = dataSummuries.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataSummuries.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataSummuries.data[0]['dataProvideCount'];
      this.reviewAllDisabled = (this.dataList.length > 0) ? false : true;
    });
  }


  getstackBarchart() {
    console.log("File Review Summary API Call Started", new Date().toISOString());
    // this.httpReviewByGroupParams.dataFrequency = this.httpDataGridParams.dataFrequency;
    // this.httpReviewByGroupParams.dueDate = this.httpDataGridParams.dueDate;
    this.dataList = [];
      this.totalFileCount = 0;
      this.intakeLandingService.getBusinessday(this.businessDayQueryParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe((businessday: any) => {
        this.stackBarChartData = [];
        if (businessday.data[0] && businessday.data[0].barChartDTO.length > 0) {
          this.stackBarChartData = businessday.data[0].barChartDTO;
          this.totalFileCount = this.stackBarChartData.length;
        }
        console.log("File Review Summary API Call End", new Date().toISOString());
      });
  }

}