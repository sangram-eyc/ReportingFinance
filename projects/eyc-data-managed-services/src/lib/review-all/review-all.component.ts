import { Component, OnInit } from '@angular/core';
import { DataManagedService } from '../data-intake/services/data-managed.service';
import { formatDate } from '@angular/common';
import { LegendPosition,colorSets } from 'eyc-charts-shared-library';

@Component({
  selector: 'lib-review-all',
  templateUrl: './review-all.component.html',
  styleUrls: ['./review-all.component.scss','../data-intake/component/data-intake.component.scss']
})
export class ReviewAllComponent implements OnInit {
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
  fileSummaries = [];
  curDate;
  tabIn: number = 1;
  innerTabIn: number = 1;
  totalFileCount=50;
  yScaleMax: number;c
  noBarWhenZero: boolean = true;
  xAxisLabel = 'Providers';
  yAxisLabel = 'Files';
  maxXAxisTickLength: number = 16;
  rotateXAxisTicks: boolean = true;
  trimXAxisTicks: boolean = true;
  showDataLabel: boolean = true;
  roundDomains = false;
  roundEdges: boolean = false;
  showXAxisGridLines=false;
  showYAxisGridLines = true;
  barPadding = 50;
  tooltipDisabled = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showLegend = false;
  legendTitle = 'Legend';
  legendPosition = LegendPosition.Below;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  animations: boolean = true;
  presentDate;
  colorScheme;
  colorScheme2;
  colorScheme3;
  constructor(private dataManagedService: DataManagedService) {
    this.setColorScheme();
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
    this.tabIn = 1;
 
  }
  formatDate(timestamp) {
    let due = new Date(timestamp);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    return newdate;
  }

  innerTabChange(selectedTab) {
    this.innerTabIn = selectedTab;
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

  
  getFileSummuries() {
    // Mock API integration for donut chart
    this.dataManagedService.getFileSummaryList().subscribe(dataSummuries => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
    });
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
