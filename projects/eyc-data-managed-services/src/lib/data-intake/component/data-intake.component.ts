import {
  Component, OnInit, ElementRef,
  Renderer2, ViewChild, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate,DatePipe } from '@angular/common';
import {
  FileFilterStatus, FILTER_TYPE,
  DATA_INTAKE_TYPE, DATA_FREQUENCY,ROUTE_URL_CONST,
  NO_FILE_MISSING_PAST_DUE, NO_HIGH_PRIORITY_ISSUES, NO_LOW_PRIORITY_ISSUES, NO_MEDUIM_PRIORITY_ISSUES,
  PowerBiReportDailyList, PowerBiReportMonthlyList,PowerBiReportDailyListProd,PowerBiReportMonthlyListProd,PBI_CONFIG
} from '../../config/dms-config-helper';
import { DataSummary } from '../models/data-summary.model';
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
  mediumPriorityData: BarChartSeriesItemDTO[];
  mediumPriorityCount: number = 0;
  lowPriorityData: BarChartSeriesItemDTO[];
  lowPriorityCount: number = 0;
  dataList: [];
  dailyMonthlyStatus: boolean = false;
  disabledDailyMonthlyButton: boolean = false;
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
  maxXAxisTickLength: number = 13;
  maxYAxisTickLength: number = 16;
  colorScheme: Color;
  colorScheme2: Color;
  colorScheme3: Color;
  colorScheme4: Color;
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
    this.lastMonthDueDateFormat = this.dataManagedService.apiDateFormat(this.lastMonthDate);
    this.presentMonthDate =  this.lastMonthDate;
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
  }

  ngOnInit(): void {
    this.curDate = this.dataManagedService.monthlyFormat(this.lastMonthDate);
    const selectedDate = sessionStorage.getItem("selectedDate");
    if (selectedDate) {
      this.presentDate = new Date(new Date(selectedDate).toDateString());
      this.presentMonthDate = this.dataManagedService.monthLastDate(this.presentDate);
    } else {
      this.presentDate = this.dataManagedService.businessDate(new Date());
      this.presentMonthDate = this.dataManagedService.prevMonthLastDate(new Date());
    }
    this.presentDateFormat = this.dataManagedService.apiDateFormat(this.presentDate);
    
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
      this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
      this.dueDate = this.dataManagedService.apiDateFormat(this.presentMonthDate);
    }

    this.httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: DATA_INTAKE_TYPE.DATA_PROVIDER,
      dueDate: this.dueDate,
      periodType: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };

    if(this.dailyMonthlyStatus) {
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');

      // if(this.baseURL.includes(this.prodUrl)){
      //   this.reports = PowerBiReportMonthlyListProd;
      // }
      // else{
      //   this.reports = PowerBiReportMonthlyList;
      // }

      this.getPowerBiReports('MONTHLY');
    } else {
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');
      
      // if(this.baseURL.includes(this.prodUrl)){
      //   this.reports = PowerBiReportDailyListProd;
      // }
      // else{
      //   this.reports = PowerBiReportDailyList;
      // }
      this.getPowerBiReports('DAILY');
    }

    this.fileSummaryList();
  }

  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.jsDate;
    if (this.calSelectedDate) {
      this.httpQueryParams.dueDate = this.dataManagedService.ymdToApiDateFormat(this.calSelectedDate);
      this.fileSummaryList();
      this.dueDate= this.httpQueryParams.dueDate;
      sessionStorage.setItem("selectedDate", `${this.calSelectedDate}`);
    }
  }

  toggleMonthlyCalendar(): void {
    this.disabledDailyMonthlyButton = false;
    this.httpQueryParams.dueDate = this.dataManagedService.apiDateFormat(this.presentMonthDate);
    this.fileSummaryList();
    sessionStorage.setItem("selectedDate", `${this.presentMonthDate}`);
  }

  dateSub() {
    this.presentMonthDate = this.dataManagedService.montlyDateSub(this.presentMonthDate);
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
    this.toggleMonthlyCalendar();
  }

  dateAdd() {
    this.presentMonthDate = this.dataManagedService.montlyDateAdd(this.presentMonthDate);
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
    this.toggleMonthlyCalendar();
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
    this.powerBiReportId='xyz';
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');

    this.renderer.setAttribute(this.dailyfilter2.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter2.nativeElement, 'color', '');

    // if(this.baseURL.includes(this.prodUrl)){
    //   this.reports = PowerBiReportDailyListProd;
    // }
    // else{
    //   this.reports = PowerBiReportDailyList;
    // }

    this.getPowerBiReports('DAILY');
    
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
    } else {
      const sesstionDate =  this.dataManagedService.ymdToApiDateFormat(sessionStorage.getItem("selectedDate"));
      this.httpQueryParams.dueDate = sesstionDate;
      this.patchDatePicker(new Date(sesstionDate));
    }

    this.fileSummaryList();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  monthlyData(status: boolean) {
    this.powerBiReportId='xyz';
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');

    this.renderer.setAttribute(this.monthlyfilter2.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter2.nativeElement, 'color', '');

    // if (this.baseURL.includes(this.prodUrl)) {
    //   this.reports = PowerBiReportMonthlyListProd;
    // }
    // else {
    //   this.reports = PowerBiReportMonthlyList;
    // }

    this.getPowerBiReports('MONTHLY');

    const monthlySelectedDate =  sessionStorage.getItem("selectedDate");
    if (monthlySelectedDate) {
      this.presentMonthDate = this.dataManagedService.monthLastDate(new Date(monthlySelectedDate)); 
    } else {
      this.presentMonthDate = this.dataManagedService.prevMonthLastDate(new Date());   
    } 
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
    this.httpQueryParams.dueDate = this.dataManagedService.apiDateFormat(this.presentMonthDate);
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
    this.dataManagedService.getFileSummaryList(this.httpQueryParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe((dataSummuries: any) => {
      this.dataList = dataSummuries.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataSummuries.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataSummuries.data[0]['dataProvideCount'];
      this.reviewAllDisabled = (this.dataList.length > 0) ? false : true;
    });
  }

  getPowerBiReports(dateFrequency){
    let param={
      reportModule:'DMS',
      reportPage:'DATA_EXPLORER',
      reportPageSection:'',
      reportAddnlFilter:dateFrequency
    }
    this.dataManagedService.getPowerBiReports(param,'').pipe(this.unsubscriber.takeUntilDestroy).subscribe((res: any) =>{
      this.reports=res?.data;
    })
  }
}
