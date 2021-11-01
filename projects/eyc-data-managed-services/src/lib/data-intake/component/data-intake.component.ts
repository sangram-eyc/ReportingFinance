import { Component, OnInit } from '@angular/core';
import { LegendPosition,colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit {
  single:any[]= [{
    name: 'Statestreet',
    value: 50632,
    extra: {
      code: 'de'
    }
  },
  {
    name: 'JP Morgan',
    value: 40000,
    extra: {
      code: 'us'
    }
  },
  {
    name: 'Bluming',
    value: 36745,
    extra: {
      code: 'fr'
    }
  },
  {
    name: 'BNYM',
    value: 30000,
    extra: {
      code: 'uk'
    }
  },
  {
    name: 'South Gate',
    value: 20000,
    extra: {
      code: 'es'
    }
  },
  {
    name: 'Data H',
    value: 10000,
    extra: {
      code: 'it'
    }
  }
  ];
  tabIn: number = 1;
  innerTabIn: number = 1;
  activeReports: any;
  curDate;
  presentDate;
  totalFileCount=50;
  // totalFileCount=0;

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
  showYAxisLabel = true;
  yAxisLabel = 'Files';
  showXAxisGridLines=false;
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

  constructor(private dataManagedService: DataManagedService) { 
    this.setColorScheme();
  }
  setColorScheme() {
    //this.selectedColorScheme = 'red';
    this.colorScheme = colorSets.find(s => s.name === 'red');
    this.colorScheme2 = colorSets.find(s => s.name === 'orange');
    this.colorScheme3 = colorSets.find(s => s.name === 'teal');
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMMM  yyyy', 'en');
    this.presentDate = new Date();
    this.getFileSummuries();
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }
  innerTabChange(selectedTab) {
    this.innerTabIn = selectedTab;
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

  getFileSummuries() {
    // Mock API integration for donut chart
    this.dataManagedService.getFileSummaryList().subscribe(dataSummuries => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
  }

  dateSub(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() - 1);
    this.curDate = formatDate(curDateVal, 'MMMM  yyyy', 'en');
  }

  dateAdd(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() + 1);
    this.curDate = formatDate(curDateVal, 'MMMM  yyyy', 'en');
  }

  dailyManagedData() {
    // Mock API integration for donut chart
    this.dataManagedService.getDailyFileSummaryList().subscribe(dataSummuries => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
  }

  monthyManagedData() {
    // Mock API integration for donut chart
    this.dataManagedService.getMonthlyFileSummaryList().subscribe(dataSummuries => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
  }
}