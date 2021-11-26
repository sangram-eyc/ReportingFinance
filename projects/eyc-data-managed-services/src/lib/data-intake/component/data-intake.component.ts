import { Component, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { LegendPosition, colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit, AfterViewInit {
  // single: any[] = [];
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


  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  tabIn: number = 1;
  innerTabIn: number = 1;
  curDate;
  presentDate;
  // totalFileCount = 50;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  // Received = No issue
  // Not Received = Files not received
  fileSummaries = [];
  fileSummariesObject = [
    {
      "label": "Received",
      "value": 0
    },
    {
      "label": "Medium / low priority issues",
      "value": 0
    },
    {
      "label": "High priority issues",
      "value": 0
    },
    {
      "label": "Missing files, past due",
      "value": 0
    },
    {
      "label": "Not Received",
      "value": 0
    }
  ];

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
    // this.dailyManagedData();
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
    // this.selectedColorScheme = 'red';
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
    this.dailyMonthlyStatus = status;
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'secondary')
    // this.dailyManagedData();
    if (this.innerTabIn == 1) {
      this.dailyDataProvider();
    } else {
      this.dailyDataDomain();
    }
  }

  monthlyData(status: boolean) {
    this.dailyMonthlyStatus = status;
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');
    // this.monthyManagedData();
    if (this.innerTabIn == 1) {
      this.monthlyDataProvider();
    } else {
      this.monthlyDataDomain();
    }
  }

  // dailyManagedData() {
  //   // Mock API integration for donut chart
  //   this.dataManagedService.getDailyFileSummaryList().subscribe(dataSummuries => {
  //     this.fileSummaries = dataSummuries.data['dataSeries'];
  //   });
  // }

  // monthyManagedData() {
  //   // Mock API integration for donut chart
  //   this.dataManagedService.getMonthlyFileSummaryList().subscribe(dataSummuries => {
  //     this.fileSummaries = dataSummuries.data['dataSeries'];
  //   });
  // }


  // getDataProviderList() {
  //   this.dataManagedService.getDataProviderList().subscribe(data => {
  //     this.single = data.data['dataSeries'];
  //     this.totalFileCount = data.data['totalCount'];
  //   });
  // }

fileSummeryCompareWithResponse () {
  const cloneFileSummury = [...this.fileSummariesObject];
  this.fileSummariesObject.map((v) => {
    this.dataList.find(data => {
      if (data.label === v.label) {
        v.value = data.value;
      }
    });
  });
  this.fileSummaries = this.fileSummariesObject;
  console.log(cloneFileSummury);
  this.fileSummariesObject = cloneFileSummury;
}

  dailyDataProvider() {
    // Mock API integration for bar chart (Data Providers)
    this.dataManagedService.getDailyDataProviderList().subscribe(data => {
      this.dataList = data.data[0]['totalSeriesItem']; //dataSummuries.data[0]['totalSeriesItem'];
      this.fileSummeryCompareWithResponse();
      this.reviewByGroupDomains = data.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = data.data[0]['dataProvideCount'];
      Object.entries(this.dataList).forEach(([_, obj]) => {
        const key = Object.keys(obj)[0];
        switch (obj[key]) {
          case 'Not Received':
            this.fileMissingPastDueCount = obj.value;
            this.fileMissingPastDueData = obj.seriesItemDTO;
          case 'Received':
          // this.highPriorityIssuesCount = obj.value;
          // this.highPriorityIssuesData = obj.seriesItemDTO;
        }
      });
    });
  }

  monthlyDataProvider() {
    // Mock API integration for bar chart
    // this.dataManagedService.getMonthlyDataProviderList().subscribe(data => {
    //   this.single = data.data['dataSeries'];
    //   this.totalFileCount = data.data['totalCount'];
    // });
    // Mock API integration for bar chart
    this.dataManagedService.getMonthlyDataProviderList().subscribe(data => {
      this.dataList = data.data[0]['totalSeriesItem']; //dataSummuries.data[0]['totalSeriesItem'];
      this.fileSummeryCompareWithResponse();
      this.reviewByGroupDomains = data.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = data.data[0]['dataProvideCount'];
      Object.entries(this.dataList).forEach(([_, obj]) => {
        const key = Object.keys(obj)[0];
        switch (obj[key]) {
          case 'Not Received':
            this.fileMissingPastDueCount = obj.value;
            this.fileMissingPastDueData = obj.seriesItemDTO;
          case 'Received':
          // this.highPriorityIssuesCount = obj.value;
          // this.highPriorityIssuesData = obj.seriesItemDTO;
        }
      });
    });
  }

  dailyDataDomain() {
    // Mock API integration for bar chart (Data Domains)
    this.dataManagedService.getDailyDataDomainList().subscribe(data => {
      this.dataList = data.data[0]['totalSeriesItem'];
      this.fileSummeryCompareWithResponse();
      this.reviewByGroupDomains = data.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = data.data[0]['dataProvideCount'];
      Object.entries(this.dataList).forEach(([_, obj]) => {
        const key = Object.keys(obj)[0];
        switch (obj[key]) {
          case 'Not Received':
            this.fileMissingPastDueCount = obj.value;
            this.fileMissingPastDueData = obj.seriesItemDTO;
          case 'Received':
          // this.highPriorityIssuesCount = obj.value;
          // this.highPriorityIssuesData = obj.seriesItemDTO;
        }
      });
    });
  }

  monthlyDataDomain() {
    // Mock API integration for bar chart (Data Domains) 
    this.dataManagedService.getMonthlyDataDomainList().subscribe(data => {
      this.dataList = data.data[0]['totalSeriesItem'];
      this.fileSummeryCompareWithResponse();
      this.reviewByGroupDomains = data.data[0]['dataDomainCount'];
      this.reviewByGroupProviders = data.data[0]['dataProvideCount'];
      Object.entries(this.dataList).forEach(([_, obj]) => {
        const key = Object.keys(obj)[0];
        switch (obj[key]) {
          case 'Not Received':
            this.fileMissingPastDueCount = obj.value;
            this.fileMissingPastDueData = obj.seriesItemDTO;
          case 'Received':
          // this.highPriorityIssuesCount = obj.value;
          // this.highPriorityIssuesData = obj.seriesItemDTO;
        }
      });
    });
  }
}
