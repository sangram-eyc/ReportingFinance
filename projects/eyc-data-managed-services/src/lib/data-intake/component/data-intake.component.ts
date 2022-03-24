import {
  Component, OnInit, ElementRef,
  Renderer2, ViewChild, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate } from '@angular/common';
import {
  FileFilterStatus, FILTER_TYPE,
  DATA_INTAKE_TYPE, DATA_FREQUENCY,
  NO_FILE_MISSING_PAST_DUE, NO_HIGH_PRIORITY_ISSUES, NO_MEDUIM_LOW_PRIORITY,PowerBiReportDailyList,PowerBiReportMonthlyList
}
  from '../../config/dms-config-helper'
import { DataSummary } from '../models/data-summary.model'
import { BarChartSeriesItemDTO } from '../models/bar-chart-series-Item-dto.model';
import { ApiSeriesItemDTO } from '../models/api-series-Item-dto.model';
import { donutSummariesObject } from '../models/donut-chart-summary.model';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';

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

  @ViewChild('dailyfilter2', { static: false }) dailyfilter2: ElementRef;
  @ViewChild('monthlyfilter2', { static: false }) monthlyfilter2: ElementRef;
  tabIn: number = 1;
  innerTabIn: number = 1;
  presentDate: Date;
  totalFileCount = 0;
  calSelectedDate: string;

  powerBiReportId:string;
  pod:string="DMS";
  reports:any;

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
  lastMonthDate: Date;
  lastMonthDueDateFormat: string;
  presentDateFormat: string;

  constructor(
    private dataManagedService: DataManagedService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private unsubscriber: AutoUnsubscriberService) {
    this.setColorScheme();
    this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true'? true: false;
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth());
    this.lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    this.lastMonthDueDateFormat = `${formatDate(this.lastMonthDate, 'yyyy-MM-dd', 'en')}`;
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

    if(this.dailyMonthlyStatus) {
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
      this.reports=PowerBiReportMonthlyList;
    } else {
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');
      this.reports=PowerBiReportDailyList;
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

  dailyData(status: boolean) {
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');

    this.renderer.setAttribute(this.dailyfilter2.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter2.nativeElement, 'color', '');

    this.reports=PowerBiReportDailyList;
    // Daily data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY;
    
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }
    
    if(!sessionStorage.getItem("selectedDate")){
      this.httpQueryParams.dueDate = this.presentDateFormat;
      this.patchDatePicker(this.presentDate);
    }

    this.fileSummaryList();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  monthlyData(status: boolean) {
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');

    this.renderer.setAttribute(this.monthlyfilter2.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter2.nativeElement, 'color', '');

    this.reports=PowerBiReportMonthlyList;
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
  
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    } else {
      this.httpQueryParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    }

    if(!sessionStorage.getItem("selectedDate")){
      this.patchDatePicker(this.lastMonthDate);
      this.httpQueryParams.dueDate = this.lastMonthDueDateFormat;
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

  visualizePowerBiReport(){
    
  }

}
