import { Component, OnInit,ElementRef,Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { LegendPosition,colorSets } from 'eyc-charts-shared-library';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';

import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';

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
  gridApi;
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


// table options


activeFilings: any[] = [];
completedFilings: any[] = [];
filingResp: any[] = [];

noOfCompletdFilingRecords = 10;
currentPage = 1;
maxPages = 5;
// searchNoDataAvilable = false;
// activeReportsSearchNoDataAvilable = false;
noCompletedDataAvilable = false;
// noActivatedDataAvilable = false;
MotifTableCellRendererComponent = MotifTableCellRendererComponent;
TableHeaderRendererComponent = TableHeaderRendererComponent;
// gridApi;
rowData;
rowClass = 'row-style';
columnDefs;
rowStyle = {
  height: '74px'
}
domLayout = 'autoHeight';
@ViewChild('commentscount')
commentscount: TemplateRef<any>;

@ViewChild('headerTemplate')
headerTemplate: TemplateRef<any>;
@ViewChild('nextbuttonTemplete')
nextbuttonTemplete : TemplateRef<any>;
@ViewChild('rname')
rname : TemplateRef<any>;

@ViewChild('chipTemplate')
chipTemplate : TemplateRef<any>;
@ViewChild('dropdownTemplate')
dropdownTemplate: TemplateRef<any>;
@ViewChild('commentTemplate')
commentTemplate: TemplateRef<any>;

dataset = [{
  disable: false,
  value: 10,
  name: '10',
  id: 0
},
{
  disable: false,
  value: 25,
  name: '25',
  id: 1
},
{
  disable: false,
  value: 50,
  name: '50',
  id: 2
}];
currentlySelectedPageSize = {
  disable: false,
  value: 10,
  name: '10',
  id: 0
};

pageSize;
columnGl:any
glRowdata:any


// end 

  constructor(private dataManagedService: DataManagedService,private elementRef: ElementRef,
     private renderer: Renderer2,private customglobalService: CustomGlobalService) { 
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

    this.getActiveFilingsData();
    this.getCompletedFilingsData();
    
  }

  // table methods
  
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  }

  onPasteSearchActiveReports(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");    
    pastedText.forEach((ele, index) => {
      if (/[A-Za-z0-9\-\_:/ ]+/.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  } 
  
  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[A-Za-z0-9\-\_:/ ]+/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getCompletedFilingsData() {
    this.completedFilings = [];
    // this.filingService.getFilingsHistory(this.currentPage - 1, this.noOfCompletdFilingRecords).subscribe(resp => {
    //   resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
    //   resp['data'].forEach((item) => {
    //     const eachitem: any = {
    //       name: item.filingName + ' // ' + item.period,
    //       period: item.period,
    //       dueDate: item.dueDate,
    //       startDate: item.startDate,
    //       comments: [],
    //       status: item.filingStatus
    //     };
    //     this.completedFilings.push(eachitem);
    //   });
    //   this.createHistoryRowData();
    // })
  }


  formatDate(timestamp) {
    let due = new Date(timestamp);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    return newdate;
  }

  createHistoryRowData() {
   
    this.rowData = [];
    this.completedFilings.forEach(filing => {
      this.rowData.push({
        name: filing.name,
        comments: filing.comments.length,
        dueDate: this.formatDate(filing.dueDate),
        subDate: '-',
        exceptions: 0,
        resolved: 0,
        
      })
    });

    this.glRowdata=[
      {
        rname: "Coloumn Completeness",
        rtype:"Data Accuracy / completeness",
        priority:1,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Gav Nav",
        rtype:"Data Accuracy / completeness",
        priority:3,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Fund Completeness",
        rtype:"Data Accuracy / completeness",
        priority:3,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Data Type",
        rtype:"Data Accuracy / completeness",
        priority:2,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Maturity Date",
        rtype:"Data Accuracy / completeness",
        priority:1,
        comments:2,
        exceptions:500,
      },
      {
        rname: "Coloumn Completeness",
        rtype:"Data Accuracy / completeness",
        priority:2,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Coloumn Completeness",
        rtype:"Data Accuracy / completeness",
        priority:1,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Coloumn Completeness",
        rtype:"Data Accuracy / completeness",
        priority:1,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Coloumn Completeness",
        rtype:"Data Accuracy / completeness",
        priority:1,
        comments:2,
        exceptions:3,
      },
      {
        rname: "Coloumn Completeness",
        rtype:"Data Accuracy / completeness",
        priority:1,
        comments:2,
        exceptions:3,
      },
    
    ]

    this.columnGl = [
      
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'File',
        field: '',
        sortable: true,
        filter: true,
        resizeable: true,
        minWidth: 100,
        sort:'asc',
        wrapText: true,
        autoHeight: true
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,

        headerName: 'Provider',
        field: '',
        sortable: true,
        filter: true,
        minWidth: 10,
        wrapText: true,
        autoHeight: true,
        // cellRendererParams: {
        //   ngTemplate: this.rname,
        // }
        
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,

        headerName: 'Data Domain',
        field: '',

        sortable: true,
        filter: true,
        minWidth: 100,
        wrapText: true,
        autoHeight: true,
        // cellRendererParams: {
        //   ngTemplate: this.chipTemplate,
        // }
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,

        headerName: 'Function',
        field: '',
        sortable: true,
        filter: true,
        minWidth: 10,
        wrapText: true,
        autoHeight: true,
        // cellRendererParams: {
        //   ngTemplate: this.commentscount,
        // }
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,

        headerName: 'Due Date',
        field: 'comments',
        sortable: true,
        filter: true,
        minWidth: 10,
        wrapText: true,
        autoHeight: true,
        // cellRendererParams: {
        //   ngTemplate: this.commentscount,
        // }
        
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: '',
        sortable: true,
        filter: true,
        minWidth: 10,
        wrapText: true,
        autoHeight: true,
      }, {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Status',
        field: '',
        sortable: true,
        filter: true,
        minWidth: 10,
        wrapText: true,
        autoHeight: true,
      },
      {
      headerComponentFramework: TableHeaderRendererComponent,
      cellRendererFramework: MotifTableCellRendererComponent,

      headerName: '',
      field: '',
      sortable: false,
      filter: false,
      minWidth: 10,
      // cellRendererParams: {
      //   ngTemplate: this.nextbuttonTemplete,
      // }
    
   },
    ];
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
    this.getCompletedFilingsData();
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
    this.getCompletedFilingsData();
  }

  getActiveFilingsData() {
  }
  // end 
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
