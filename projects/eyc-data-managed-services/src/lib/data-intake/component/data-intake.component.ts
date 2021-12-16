import { Component, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LegendPosition, colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate } from '@angular/common';
import { FileFilterStatus, FilterTypes, DataIntakeType, DataFrequency } from '../../global-constants'
import { DataSummary } from '../models/data-summary.model'
import { BarChartSeriesItemDTO } from '../models/bar-chart-series-Item-dto.model';
import { ApiSeriesItemDTO } from '../models/api-series-Item-dto.model';
import { donutSummariesObject } from '../models/donut-chart-summary.model';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit, AfterViewInit {
  fileMissingPastDueData: any[] = [];
  fileMissingPastDueCount: number = 0;
  highPriorityIssuesData: any[] = [];
  highPriorityIssuesCount: number = 0;
  mediumLowPriorityData: any[] = [];
  mediumLowPriorityCount: number = 0;
  dataList: any[] = [];
  dailyMonthlyStatus: boolean = false;
  reviewByGroupDomains: number = 0;
  reviewByGroupProviders: number = 0;
  noFileMissingPastDue = "No missing files, past due at the moment";
  noHighPriorityIssues = "No high priority issues at the moment";
  noMediumLowPriority = "No medium / low priority issues at the moment";

  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  tabIn: number = 1;
  innerTabIn: number = 1;
  activeReports: any;
  curDate;
  presentDate;
  totalFileCount = 0;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  fileSummaries = [];
  fileSummariesObject = donutSummariesObject;

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
  //end option

  motifDatepModel: any;
  @ViewChild('dp') myDp;

  constructor(
    private dataManagedService: DataManagedService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2) {
    this.setColorScheme();
  }

  ngAfterViewInit(): void {
    this.httpQueryParams =
    {
      startDate: '',
      EndDate: '',
      dataFrequency: DataFrequency.daily,
      dataIntakeType: DataIntakeType.dataProvider,
      dueDate: `${formatDate(new Date(), 'yyyy-MM-dd', 'en')}`,
      periodType: '',
      filterTypes: [
        FilterTypes.noIssues, FilterTypes.high, FilterTypes.low, FilterTypes.medium,
        FilterTypes.missingFiles, FilterTypes.fileNotRecieved]
    };
    this.fileSummaryList();
  }


  toggleCalendar(): void {
    this.cdr.detectChanges();
    this.myDp.toggleCalendar();
    if(this.motifDatepModel){
      this.httpQueryParams.dueDate = this.motifDatepModel?.singleDate.formatted;
      this.fileSummaryList();
    }
  }

  formatDate(timestamp) {
    let due = new Date(timestamp);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    return newdate;
  }

  setColorScheme() {
    this.colorScheme = colorSets.find(s => s.name === 'red');
    this.colorScheme2 = colorSets.find(s => s.name === 'orange');
    this.colorScheme3 = colorSets.find(s => s.name === 'teal');
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
    this.tabIn = 1;
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }

  innerTabChange(selectedTab) {
    this.innerTabIn = selectedTab;
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DataIntakeType.dataProvider;
      this.dailyMonthlyStatus ? this.httpQueryParams.dataFrequency = DataFrequency.monthly
        : this.httpQueryParams.dataFrequency = DataFrequency.daily
    } else {
      this.httpQueryParams.dataIntakeType = DataIntakeType.dataDomain;
      this.dailyMonthlyStatus ?
        this.httpQueryParams.dataFrequency = DataFrequency.monthly
        : this.httpQueryParams.dataFrequency = DataFrequency.daily
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
    this.httpQueryParams.dataFrequency = DataFrequency.daily;
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'secondary')
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DataIntakeType.dataProvider;
    } else {
      this.httpQueryParams.dataIntakeType = DataIntakeType.dataDomain;
    }
    this.fileSummaryList();
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DataFrequency.monthly;
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');
    if (this.innerTabIn == 1) {
      this.httpQueryParams.dataIntakeType = DataIntakeType.dataProvider;
    } else {
      this.httpQueryParams.dataIntakeType = DataIntakeType.dataDomain;
    }
    this.fileSummaryList();
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
    const cloneFileSummury = [...donutSummariesObject];
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
    this.fileSummaries = this.fileSummariesObject;
    this.fileSummariesObject = cloneFileSummury;
  }

  fileSummaryList() {
    // Mock API integration for bar chart (Data Providers/ Data Domains)
    this.dataManagedService.getFileSummaryList(this.httpQueryParams).subscribe((dataProvider: any) => {
      this.dataList = dataProvider.data[0]['totalSeriesItem']; //dataSummuries.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataProvider.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataProvider.data[0]['dataProvideCount'];
    });
  }
}
