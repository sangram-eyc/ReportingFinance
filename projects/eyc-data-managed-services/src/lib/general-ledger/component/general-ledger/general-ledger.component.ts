import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LegendPosition,colorSets } from 'eyc-charts-shared-library';

import { formatDate } from '@angular/common';
import { MotifTableHeaderRendererComponent,  MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ColDef } from 'ag-grid-community';
import { CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { RegulatoryReportingFilingService } from 'projects/eyc-regulatory-reporting/src/lib/regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { customComparator } from '@default/services/settings-helpers';
import { DataManagedService } from '../../../data-intake/services/data-managed.service';
import { HttpClient } from '@angular/common/http';
import { DataIntakeLandingService } from 'projects/eyc-data-intake/src/lib/data-intake-landing/services/data-intake-landing.service';

@Component({
  selector: 'lib-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.scss','../../../data-intake/component/data-intake.component.scss']
})
export class GeneralLedgerComponent implements OnInit {

  gridApi;
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
  // activeReports: any;
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



  activeFilings: any[] = [];
  activeReports:any[] = []
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


//end option

  constructor(  private service: DataManagedService,private httpClient:HttpClient,private customglobalService: CustomGlobalService,private dataManagedService: DataManagedService,private filingService: RegulatoryReportingFilingService) { 
    this.setColorScheme();
  }

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
    this.filingService.getFilingsHistory(this.currentPage - 1, this.noOfCompletdFilingRecords).subscribe(resp => {
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.filingName + ' // ' + item.period,
          period: item.period,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: [],
          status: item.filingStatus
        };
        this.completedFilings.push(eachitem);
      });
      this.createHistoryRowData();
    })
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

    // this.glRowdata=[
    //   {
    //     rname: "Coloumn Completeness",
    //     rtype:"Data Accuracy / completeness",
    //     priority:1,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Gav Nav",
    //     rtype:"Data Accuracy / completeness",
    //     priority:3,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Fund Completeness",
    //     rtype:"Data Accuracy / completeness",
    //     priority:3,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Data Type",
    //     rtype:"Data Accuracy / completeness",
    //     priority:2,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Maturity Date",
    //     rtype:"Data Accuracy / completeness",
    //     priority:1,
    //     comments:2,
    //     exceptions:500,
    //   },
    //   {
    //     rname: "Coloumn Completeness",
    //     rtype:"Data Accuracy / completeness",
    //     priority:2,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Coloumn Completeness",
    //     rtype:"Data Accuracy / completeness",
    //     priority:1,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Coloumn Completeness",
    //     rtype:"Data Accuracy / completeness",
    //     priority:1,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Coloumn Completeness",
    //     rtype:"Data Accuracy / completeness",
    //     priority:1,
    //     comments:2,
    //     exceptions:3,
    //   },
    //   {
    //     rname: "Coloumn Completeness",
    //     rtype:"Data Accuracy / completeness",
    //     priority:1,
    //     comments:2,
    //     exceptions:3,
    //   },
    
    // ]

    this.columnDefs = [
      
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exception Report Type',
        field: 'name',
        sortable: true,
        filter: true,
        resizeable: true,
        minWidth: 100,
        sort:'asc',
        wrapText: true,
        autoHeight: true,
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        headerName: 'Exception Report Name',
        field: 'comments',
        sortable: true,
        filter: true,
        minWidth: 140,
        cellRendererParams: {
            ngTemplate: this.commentTemplate,
          }
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Due date',
        field: 'dueDate',
        sortable: true,
        filter: true,
        minWidth: 50,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exception Priority Level',
        field: 'subDate',
        sortable: true,
        filter: true,
        minWidth: 50,
      
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Comments',
        field: 'exceptions',
        sortable: true,
        filter: true,
        minWidth: 140
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'resolved',
        sortable: true,
        filter: true,
        minWidth: 50
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: '',
        field: 'arrow',
        sortable: true,
        filter: true,
        minWidth: 50
      },
    ];

    this.columnGl = [
      
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exception Report Type',
        field: 'rtype',
        sortable: true,
        filter: false,
        resizeable: true,
        minWidth: 100,
        sort:'asc',
        wrapText: true,
        autoHeight: true,
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,

        headerName: 'Exception Report Name',
        field: 'rname',
        sortable: true,
        filter: false,
        minWidth: 140,
        cellRendererParams: {
          ngTemplate: this.rname,
        }
        
      },
 
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,

        headerName: 'Exception Priority Level',
        field: 'priority',

        sortable: true,
        filter: false,
        minWidth: 180,
        cellRendererParams: {
          ngTemplate: this.chipTemplate,
        }
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,

        headerName: 'Comments',
        field: 'comments',
        sortable: false,
        filter: false,
        minWidth: 50,
        cellRendererParams: {
          ngTemplate: this.commentscount,
        }

        
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptions',
        sortable: false,
        filter: false,
        minWidth: 50
      },
      {
      headerComponentFramework: TableHeaderRendererComponent,
      cellRendererFramework: MotifTableCellRendererComponent,

      headerName: '',
      field: 'next',
      sortable: false,
      filter: false,
      minWidth: 50,
      cellRendererParams: {
        ngTemplate: this.nextbuttonTemplete,
      }
    //   cellRenderer:function(params){
    //     return '<span><i class="material-ions">edit</i></span>'      }
   },
    ];
  }

  //  ragCellClassRules={
  //   'rag-green-outer':function(params){
  //     console.log(params)
  //     return params.value==3;
  //   },
  //   'rag-amber-outer':function(params){
  //     console.log(params)
  //     return params.value == 2;
  //   },
  //   'rag-red-outer':function(params){
  //     console.log(params)
  //     return params.value == 1;
  //   }
  // }

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
  
  setColorScheme() {
    //this.selectedColorScheme = 'red';
    this.colorScheme = colorSets.find(s => s.name === 'red');
    this.colorScheme2 = colorSets.find(s => s.name === 'orange');
    this.colorScheme3 = colorSets.find(s => s.name === 'teal');
  }

  ngOnInit(): void {
 

    this.service.general().subscribe(res => {
     
      var mdata:any=res;
      this.glRowdata=mdata.data;
      console.log(this.glRowdata)
    })
    this.curDate = formatDate(new Date(), 'MMMM  yyyy', 'en');
    this.presentDate = new Date();
    this.getFileSummuries();
    this.tabIn = 1;
    this.getActiveFilingsData();
    this.getCompletedFilingsData();
  }

  
  getActiveFilingsData() {
    this.filingService.getFilings().subscribe(resp => {
      this.filingResp.push(resp);
      resp['data'].length === 0 ? this.noActivatedDataAvilable = true : this.noActivatedDataAvilable = false;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.filingName,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: [],
          status: item.filingStatus,
          filingName: item.filingName,
          period: item.period,
          filingId: item.filingId,
          totalFunds: item.totalFunds
        };
        this.activeFilings.push(eachitem);
        // this.activeReports.push(eachitem);
      });
      this.activeFilings = this.customglobalService.sortFilings(this.activeFilings)
      this.activeReports = this.activeFilings;
      this.createHistoryRowData();
    });
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
