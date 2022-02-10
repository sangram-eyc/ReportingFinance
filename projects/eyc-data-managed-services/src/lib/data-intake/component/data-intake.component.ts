import {
  Component, OnInit, ElementRef,
  Renderer2, ViewChild, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate } from '@angular/common';
import {
  FileFilterStatus, FILTER_TYPE,
  DATA_INTAKE_TYPE, DATA_FREQUENCY,
  NO_FILE_MISSING_PAST_DUE, NO_HIGH_PRIORITY_ISSUES, NO_MEDUIM_LOW_PRIORITY
}
  from '../../config/dms-config-helper'
import { DataSummary } from '../models/data-summary.model'
import { BarChartSeriesItemDTO } from '../models/bar-chart-series-Item-dto.model';
import { ApiSeriesItemDTO } from '../models/api-series-Item-dto.model';
import { donutSummariesObject } from '../models/donut-chart-summary.model';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit, AfterViewInit {
  fileMissingPastDueData: BarChartSeriesItemDTO[];
  fileMissingPastDueCount: number = 0;
  highPriorityIssuesData: BarChartSeriesItemDTO[];
  highPriorityIssuesCount: number = 0;
  mediumLowPriorityData: BarChartSeriesItemDTO[];
  mediumLowPriorityCount: number = 0;
  dataList: [];
  dailyMonthlyStatus: boolean = false;
  disabledDailyMonthlyButton: boolean = false;
  reviewByGroupDomains: number = 0;
  reviewByGroupProviders: number = 0;
  noFileMissingPastDue = NO_FILE_MISSING_PAST_DUE;
  noHighPriorityIssues = NO_HIGH_PRIORITY_ISSUES;
  noMediumLowPriority = NO_MEDUIM_LOW_PRIORITY;

  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  tabIn: number = 1;
  innerTabIn: number = 1;
  curDate: string;
  presentDate: Date;
  totalFileCount = 0;
  calSelectedDate: string;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  fileSummaries = [];
  fileSummariesObject = JSON.parse(JSON.stringify(donutSummariesObject));
  reviewAllDisabled: boolean = true;

  // API Request match with response
  httpQueryParams: DataSummary;

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
  //end option
  form: FormGroup;
  businessDays: boolean = false;

  constructor(
    private dataManagedService: DataManagedService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private unsubscriber: AutoUnsubscriberService) {
    this.setColorScheme();
    this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true'? true: false;
  }

  ngAfterViewInit(): void {
    this.httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: DATA_INTAKE_TYPE.DATA_PROVIDER,
      dueDate: sessionStorage.getItem("selectedDate") ? sessionStorage.getItem("selectedDate") : `${formatDate(new Date(), 'yyyy-MM-dd', 'en')}`,
      periodType: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };

    if(this.dailyMonthlyStatus) {
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
    } else {
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');
    }

    this.fileSummaryList();
  }

  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.formatted;
    if (this.calSelectedDate) {
      this.httpQueryParams.dueDate = this.calSelectedDate;
      this.fileSummaryList();
      sessionStorage.setItem("selectedDate", `${this.calSelectedDate}`);
    }
  }

  setColorScheme() {
    this.colorScheme = colorSets.find(s => s.name === 'red');
    this.colorScheme2 = colorSets.find(s => s.name === 'orange');
    this.colorScheme3 = colorSets.find(s => s.name === 'teal');
  }

  ngOnInit(): void {
    const selectedDate = sessionStorage.getItem("selectedDate");
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = selectedDate ? new Date(selectedDate) : new Date();
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

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
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

  dailyData(status: boolean) {
    // Daily data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY;
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }
    this.fileSummaryList();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }
    this.fileSummaryList();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
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
    this.mediumLowPriorityCount = 0;
    this.mediumLowPriorityData = [];
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
        case FileFilterStatus.mediumLowPriority.apiKey:
          this.mediumLowPriorityCount = fData.value;
          this.mediumLowPriorityData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
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
    this.dataManagedService.getFileSummaryList(this.httpQueryParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe((dataSummuries: any) => {
      this.dataList = dataSummuries.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataSummuries.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataSummuries.data[0]['dataProvideCount'];
      this.reviewAllDisabled = (this.dataList.length > 0) ? false : true;
    });
  }
}
