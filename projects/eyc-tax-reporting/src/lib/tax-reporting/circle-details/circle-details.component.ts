import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { TaxReportingFilingService } from '../services/tax-reporting-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import {customComparator} from '../../config/tax-config-helper';
import { CustomGlobalService } from 'eyc-ui-shared-component';
import { Location } from '@angular/common';
import { ProductionCylcesService } from '../services/production-cylces.service';
import {Router} from '@angular/router';

@Component({
  selector: 'circle-details',
  templateUrl: './circle-details.component.html',
  styleUrls: ['./circle-details.component.scss']
})
export class CircleDetailComponent implements OnInit {



  constructor(
    private customglobalService: CustomGlobalService,
    private productcyclesService: ProductionCylcesService,
    private location: Location,
    private router: Router
  ) { }

  nameReport:string = 'Client ABC, Inc.';
  activeFilings: any[] = [];
  activeReports: any[] = []
  completedFilings: any[] = [];
  filingResp: any[] = [];

  noOfCompletdFilingRecords = 10;
  currentPage = 0;
  maxPages = 5;
  searchNoDataAvilable = false;
  activeReportsSearchNoDataAvilable = false;
  noCompletedDataAvilable = false;
  noActivatedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData;
  rowClass = 'row-style';
  columnDefs;
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('productTemplate')
  productTemplate: TemplateRef<any>;

 

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


  ngOnInit(): void {
    // this.getActiveFilingsData();
    //this.getCompletedProductCyclesData();
  }
    
 onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  backtoTeamVIew() {
    sessionStorage.setItem('adminTab', '1');
    this.location.back();
  }

  ngAfterViewInit(): void {
     this.getCompletedProductCyclesData();
  }

  // getActiveFilingsData() {
  //     this.filingService.getFilings().subscribe(resp => {
  //       this.filingResp.push(resp);
  //       this.filingResp[0].data.length === 0 ? this.noActivatedDataAvilable = true : this.noActivatedDataAvilable = false;
  //       this.filingResp[0].data.forEach((item) => {
  //         const eachitem: any = {
  //           name: item.name,
  //           author: item.author,
  //           createdDate: item.createdDate,
  //           downloadUrl: item.downloadUrl
  //         };
  //         this.activeFilings.push(eachitem);
  //         this.activeReports.push(eachitem);
  //       });
  //       this.activeFilings = this.customglobalService.sortFilings(this.activeFilings)
  //       this.createHistoryRowData();
  //     });
  // }

   getCompletedProductCyclesData() {
  //   this.completedFilings = [];

     this.productcyclesService.getProductionCyclesDetails().subscribe(resp => {    
       resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;       
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      resp['data'].forEach((item) => {
         const eachitem: any = {
           name: item.name,
          id: item.id
         };
         this.completedFilings.push(eachitem);
       });
       this.createHistoryRowData();
     })
   }

   createHistoryRowData() {
   
     this.rowData = [];
     this.completedFilings.forEach(filing => {
      this.rowData.push({
        name: filing.name,
        id: filing.id
      })
    });
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.productTemplate,
        },
        headerName: 'Fund Name',
        field: 'name',
        sortable: true,
        filter: false,       
        resizeable: true, 
        minWidth: 640,
        sort:'asc',
        comparator: customComparator
       
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.productTemplate,
        },
        headerName: 'Actions',
        field: 'downloadUrl',
        sortable: true,
        filter: false,       
        resizeable: true, 
        minWidth: 640,
        sort:'asc',
        comparator: customComparator
       
      }
    ];
  }

  // onPasteSearchActiveReports(event: ClipboardEvent) {
  //   let clipboardData = event.clipboardData;
  //   let pastedText = (clipboardData.getData('text')).split("");    
  //   pastedText.forEach((ele, index) => {
  //     if (/[A-Za-z0-9\-\_:/ ]+/.test(ele)) {
  //       if ((pastedText.length - 1) === index) {
  //         return true;
  //       }
  //     } else {
  //       event.preventDefault();
  //       return false;
  //     }
  //   });
  // } 

  // searchCompleted(input) {
  //   this.gridApi.setQuickFilter(input.el.nativeElement.value);
  //   this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  // }

  // searchFilingValidation(event) {
  //   var inp = String.fromCharCode(event.keyCode);
  //   if (/[A-Za-z0-9\-\_:/ ]+/.test(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

  // formatDate(timestamp) {
  //   let due = new Date(timestamp);
  //   const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
  //     + ('0' + due.getDate()).slice(-2) + '/'
  //     + due.getFullYear();
  //   return newdate;
  // }

  // isFirstColumn(params) {
  //   const displayedColumns = params.columnApi.getAllDisplayedColumns();
  //   const thisIsFirstColumn = displayedColumns[0] === params.column;
  //   return thisIsFirstColumn;
  // };

  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridApi.sizeColumnsToFit();
  // };


}
