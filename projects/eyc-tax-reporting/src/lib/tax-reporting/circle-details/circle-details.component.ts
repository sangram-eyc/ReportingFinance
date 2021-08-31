import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import {customComparator} from '../../config/tax-config-helper';
import { Location } from '@angular/common';
import { ProductionCylcesService } from '../services/production-cylces.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {ErrorModalComponent} from 'eyc-ui-shared-component';

@Component({
  selector: 'circle-details',
  templateUrl: './circle-details.component.html',
  styleUrls: ['./circle-details.component.scss']
})
export class CircleDetailComponent implements OnInit {

  constructor(
    private productcyclesService: ProductionCylcesService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

   pageName:string = 'Cycle Details';
   activeFilings: any[] = [];
   activeReports: any[] = []
   completedFilings: any[] = [];
   filingResp: any[] = [];
   productCycleId;
   productCycleName;
   productCycleParams:string;

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
  @ViewChild('fundName')
  fundName: TemplateRef<any>;
  @ViewChild('urlDownload')
  urlDownload: TemplateRef<any>;

 

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
    value: 20,
    name: '20',
    id: 0
  };

  pageSize;


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productCycleParams = params.id
    });
  }
    
 onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  backtoCycleView(){
    this.location.back();
  }

  ngAfterViewInit(): void {
    let productCycleParamsArr =  this.productCycleParams.split('/')
    this.productCycleId = productCycleParamsArr[0]
    this.productCycleName = productCycleParamsArr[1]
    console.log(this.productCycleId)
    console.log(this.productCycleName)
    this.getCompletedProductCyclesData(this.productCycleId);
  }

   getCompletedProductCyclesData(id:any) {
     this.productcyclesService.getProductionCyclesDetails(id).subscribe(resp => {    
      if(resp['success'] === true){
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      resp['data'].forEach((item) => {
         const eachitem: any = {
           name: item.name,
           downloadUrl: item.downloadUrl
         };
         this.completedFilings.push(eachitem);
       });
       this.createHistoryRowData();
      }else{
        this.getModalError(resp);
      }

     });
   }

   createHistoryRowData() {
   
     this.rowData = [];
     this.completedFilings.forEach(filing => {
      this.rowData.push({
        name: filing.name,
        downloadUrl: filing.downloadUrl
      })
    });
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.fundName,
        },
        headerName: 'Fund Name',
        field: 'name',
        sortable: true,
        filter: false,       
        resizeable: true, 
        minWidth: 500,
        sort:'asc',
        comparator: customComparator
       
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.urlDownload,
        },
        headerName: 'Actions',
        // cellClass: 'ag-right-aligned-cell',
        field: 'downloadUrl',
        sortable: true,
        filter: false,        
        resizeable: true, 
        minWidth: 500,
        sort:'asc',
        comparator: customComparator
       
      }
    ];
  }

  getModalError(resp){
    let errCod = resp['error'] != null ? resp['error'].errorCode : "404";
    let msgErr = resp['error'] != null ? resp['error'].message : "Error not found.";
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      width: '500px',
      data: {
        type: "Error",
        header: "Error",
        description: "Error Code: " + errCod + " Message: " + msgErr,
        footer: {
          style: "end",
          YesButton: "Ok"                       
        }
      }
    });
  }
}
