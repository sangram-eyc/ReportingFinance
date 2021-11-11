import { Component, OnInit,ElementRef,Renderer2, ViewChild } from '@angular/core';
import { LegendPosition,colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'lib-file-review',
  templateUrl: './file-review.component.html',
  styleUrls: ['./file-review.component.scss']
})
export class FileReviewComponent implements OnInit {
  single:any[]=[];
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  multi=[
    {
      name: 'Statestreet',
      series: [
        {
          name: '2010',
          value: 4000
        },
        {
          name: '1000',
          value: 2000
        },
        {
          name: '500',
          value: 1500
        },
        {
          name: '2000',
          value: 3693,
          extra: {
            code: 'de'
          }
        },
        {
          name: '1990',
          value: 1476,
          extra: {
            code: 'de'
          }
        }
      ]
    },
    {
      name: 'Data H',
      series: [
        {
          name: '2010',
          value: 2000
        },
        {
          name: '1000',
          value: 3000
        },
        {
          name: '500',
          value: 1500
        },
        {
          name: '2000',
          value: 2693,
          extra: {
            code: 'de'
          }
        },
        {
          name: '1990',
          value: 2476,
          extra: {
            code: 'de'
          }
        }
      ]
    },
    {
      name: 'South Gate',
      series: [
        {
          name: '2010',
          value: 1000
        },
        {
          name: '1000',
          value: 3000
        },
        {
          name: '500',
          value: 1500
        },
        {
          name: '2000',
          value: 1693,
          extra: {
            code: 'de'
          }
        },
        {
          name: '1990',
          value: 2276,
          extra: {
            code: 'de'
          }
        }
      ]
    },
    {
      name: 'BNYM',
      series: [
        {
          name: '2010',
          value: 4000
        },
        {
          name: '1000',
          value: 2000
        },
        {
          name: '500',
          value: 1500
        },
        {
          name: '2000',
          value: 3693,
          extra: {
            code: 'de'
          }
        },
        {
          name: '1990',
          value: 1476,
          extra: {
            code: 'de'
          }
        }
      ]
    },
    {
      name: 'Bluming',
      series: [
        {
          name: '2010',
          value: 2500
        },
        {
          name: '1000',
          value: 1500
        },
        {
          name: '500',
          value: 3500
        },
        {
          name: '2000',
          value: 1200,
          extra: {
            code: 'de'
          }
        },
        {
          name: '1990',
          value: 2000,
          extra: {
            code: 'de'
          }
        }
      ]
    },
    {
      name: 'JP Morgan',
      series: [
        {
          name: '2010',
          value: 3000
        },
        {
          name: '1000',
          value: 4000
        },
        {
          name: '500',
          value: 2000
        },
        {
          name: '2000',
          value: 3693,
          extra: {
            code: 'de'
          }
        },
        {
          name: '1990',
          value: 2500,
          extra: {
            code: 'de'
          }
        }
      ]
    },
    {
      name: 'Tata',
      series: [
        {
          name: '2010',
          value: 4000
        },
        {
          name: '1000',
          value: 2000
        },
        {
          name: '500',
          value: 1500
        },
        {
          name: '2000',
          value: 3693,
          extra: {
            code: 'de'
          }
        },
        {
          name: '1990',
          value: 1476,
          extra: {
            code: 'de'
          }
        }
      ]
    }
  ];
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
  xAxisLabel2='Domain';
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
  colorSchemeAll;

//end option

  constructor(private dataManagedService: DataManagedService,private elementRef: ElementRef, private renderer: Renderer2) { 
    this.setColorScheme();
  }
  setColorScheme() {
    // this.selectedColorScheme = 'red';
    this.colorScheme = colorSets.find(s => s.name === 'red');
    this.colorScheme2 = colorSets.find(s => s.name === 'orange');
    this.colorScheme3 = colorSets.find(s => s.name === 'teal');
    this.colorSchemeAll=colorSets.find(s => s.name === 'all');
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
    this.dailyManagedData();
    this.dailyDataProvider();
    
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
    this.curDate = formatDate(curDateVal, 'MMM. dd, yyyy', 'en');
  }

  dateAdd(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() + 1);
    this.curDate = formatDate(curDateVal, 'MMM. dd, yyyy', 'en');
  }

  dailyData(){
    this.renderer.setAttribute(this.dailyfilter.nativeElement,  'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement,  'color', 'secondary')
    this.dailyManagedData();
    this.dailyDataProvider();
  }
  monthyData(){
    this.renderer.setAttribute(this.monthlyfilter.nativeElement,  'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement,  'color', 'secondary');
    this.monthyManagedData();
    this.monthyDataProvider();
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


  getDataProviderList(){
    this.dataManagedService.getDataProviderList().subscribe(data => {
      this.single = data.data['dataSeries'];
      this.totalFileCount=data.data['totalCount'];
    });  
  }

  dailyDataProvider() {
    // Mock API integration for donut chart
    this.dataManagedService.getDailyDataProviderList().subscribe(data => {
      this.single = data.data['dataSeries'];
      this.totalFileCount=data.data['totalCount'];
    });
  }

  monthyDataProvider() {
    // Mock API integration for donut chart
    this.dataManagedService.getMonthlyDataProviderList().subscribe(data => {
      this.single = data.data['dataSeries'];
      this.totalFileCount=data.data['totalCount'];
    });
  }
}
