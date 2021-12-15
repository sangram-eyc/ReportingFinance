import { Component, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { LegendPosition, colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate } from '@angular/common';
import { GlobalConstants } from '../../global-constants'
import { ApiSeriesItemDTO, CarChartSeriesItemDTO, DataSummary } from '../models/api-request-model'
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
  totalFileCount = 50;
  // totalFileCount=0;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  // Received = No issue
  // Not Received = Files not received
  fileSummaries = [];
  fileSummariesObject = [
    {
      "apiKey": GlobalConstants.noIssue.apiKey,
      "label": GlobalConstants.noIssue.legendTitle,
      "value": 0
    },
    {
      "apiKey": GlobalConstants.mediumLowPriority.apiKey,
      "label": GlobalConstants.mediumLowPriority.legendTitle,
      "value": 0
    },
    {
      "apiKey": GlobalConstants.highPriorityIssues.apiKey,
      "label": GlobalConstants.highPriorityIssues.legendTitle,
      "value": 0
    },
    {
      "apiKey": GlobalConstants.missingFilesPastDue.apiKey,
      "label": GlobalConstants.missingFilesPastDue.legendTitle,
      "value": 0
    },
    {
      "apiKey": GlobalConstants.filesNotReceived.apiKey,
      "label": GlobalConstants.filesNotReceived.legendTitle,
      "value": 0
    }
  ];

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

  constructor(
    private dataManagedService: DataManagedService,
    private renderer: Renderer2) {
    this.setColorScheme();
  }

  ngAfterViewInit(): void {
    this.dailyDataProvider();
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
      this.dailyMonthlyStatus ? this.monthlyDataProvider() : this.dailyDataProvider()
    } else {
      this.dailyMonthlyStatus ? this.monthlyDataDomain() : this.dailyDataDomain()
    }
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

  dailyData(status: boolean) {
    // Daily data fetch as per click
    this.dailyMonthlyStatus = status;
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'secondary')
    if (this.innerTabIn == 1) {
      this.dailyDataProvider();
    } else {
      this.dailyDataDomain();
    }
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');
    if (this.innerTabIn == 1) {
      this.monthlyDataProvider();
    } else {
      this.monthlyDataDomain();
    }
  }

  mapBarChartDataWithKey(fData: [ApiSeriesItemDTO]): CarChartSeriesItemDTO[] {
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
    const cloneFileSummury = [...this.fileSummariesObject];
    fetchData.find((fData) => {
      this.fileSummariesObject.map((summaryObject) => {
        if (fData.label === summaryObject.apiKey) {
          summaryObject.value = fData.value;
        }
      });
      switch (fData.label) {
        case GlobalConstants.missingFilesPastDue.apiKey:
          this.fileMissingPastDueCount = fData.value;
          this.fileMissingPastDueData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
          break;
        case GlobalConstants.highPriorityIssues.apiKey:
          this.highPriorityIssuesCount = fData.value;
          this.highPriorityIssuesData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
          break;
        case GlobalConstants.mediumLowPriority.apiKey:
          this.mediumLowPriorityCount = fData.value;
          this.mediumLowPriorityData = this.mapBarChartDataWithKey(fData.seriesItemDTO);
          break;
        default:
      }
    });
    this.fileSummaries = this.fileSummariesObject;
    debugger;
    this.fileSummariesObject = cloneFileSummury;
  }

  dailyDataProvider() {
    this.httpQueryParams =
    {
      startDate: '',
      EndDate: '',
      dataFrequency: 'Daily',
      dataIntakeType: 'dataDomain',
      dueDate: '2021-10-22',
      periodType: '',
      filterTypes: ['noIssues', 'high', 'low', 'medium', 'missingFiles', 'fileNotRecieved']
    };

    // Mock API integration for bar chart (Data Providers)
    this.dataManagedService.getFileSummaryList(this.httpQueryParams).subscribe((dataProvider: any) => {
      this.dataList = dataProvider.data[0]['totalSeriesItem']; //dataSummuries.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataProvider.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataProvider.data[0]['dataProvideCount'];
    });
  }

  monthlyDataProvider() {
    // Mock API integration for bar chart
    this.dataManagedService.getMonthlyDataProviderList().subscribe(dataProvider => {
      this.dataList = dataProvider.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataProvider.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataProvider.data[0]['dataProvideCount'];
    });
  }

  dailyDataDomain() {
    // Mock API integration for bar chart (Data Domains)
    this.dataManagedService.getDailyDataDomainList().subscribe(dataDomain => {
      this.dataList = dataDomain.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataDomain.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataDomain.data[0]['dataProvideCount'];
    });
  }

  monthlyDataDomain() {
    // Mock API integration for bar chart (Data Domains) 
    this.dataManagedService.getMonthlyDataDomainList().subscribe(dataDomain => {
      this.dataList = dataDomain.data[0]['totalSeriesItem'];
      this.manipulateStatusWithResponse(this.dataList);
      this.reviewByGroupDomains = dataDomain.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = dataDomain.data[0]['dataProvideCount'];
    });
  }
}
