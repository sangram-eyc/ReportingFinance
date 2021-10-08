import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { Location } from '@angular/common';
import { ProductionCycleService } from '../services/production-cycle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {ErrorModalComponent} from 'eyc-ui-shared-component';



@Component({
  selector: 'cycle-details',
  templateUrl: './cycle-details.component.html',
  styleUrls: ['./cycle-details.component.scss']
})
export class CycleDetailComponent implements OnInit {

  constructor(
    private productcyclesService: ProductionCycleService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router:Router
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
/*   noCompletedDataAvilable = false;
  noActivatedDataAvilable = false; */
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
  @ViewChild('openCommentEY')
  openCommentEY: TemplateRef<any>;
  @ViewChild('openCommentClient')
  openCommentClient: TemplateRef<any>;

  @ViewChild('datasetsDropdownTemplate')
  datasetsDropdownTemplate: TemplateRef<any>;

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

  submitDatasets;
  datasetsModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure want to approve this workbook deliverables? This indicates that you have no further comments.",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
      }
    }
  };
  exceptionDetailCellRendererParams;
  datasetsSelectedRows;


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productCycleName = params.name
      this.productCycleId = params.id
    });

    this.submitDatasets = this.onSubmitApproveDatasets.bind(this);
  }
    
 onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  backtoCycleView(){
    this.location.back();
  }

  ngAfterViewInit(): void {
    this.getCompletedProductCyclesData(this.productCycleId);
  }

  getDownloadFile(row){
    let urlDownloadfile = '';
    this.productcyclesService.getDownloadFile(row.id,row.name).subscribe(resp => {    
      urlDownloadfile = resp['data'].downloadUrl;    
      window.open(urlDownloadfile);
     });
  }

  createComment(row){
    console.log("Comments-Landing")
    this.router.navigate(['comment-page',row.id,row.name,this.productCycleName]);
  }

   getCompletedProductCyclesData(id:any) {
     this.productcyclesService.getProductionCyclesDetails(id).subscribe(resp => {    
      resp['data'].forEach((item) => {
         const eachitem: any = {
           name: item.name,
           hasContent: item.hasContent,
           id: item.id,
           approved: item.status === 'approved' ? true : (( item.openCommentsEY > 0 || item.openCommentClient > 0) ? true:false),
           approvedBack: item.status === 'approved' ? true : false, 
           openCommentsEY:item.openCommentsEY,
           openCommentsClient:item.openCommentsClient
         };
         this.completedFilings.push(eachitem);
       });
       this.createHistoryRowData();
     });
   }

   createHistoryRowData() {
     this.rowData = [];
     this.completedFilings.forEach(filing => {
      this.rowData.push({
        name: filing.name,
        hasContent: filing.hasContent,
        id:filing.id,
        approved:filing.approved,
        approvedBack:filing.approvedBack,
        openCommentsEY:filing.openCommentsEY,
        openCommentsClient:filing.openCommentsClient
      })
    });

  
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.datasetsDropdownTemplate,
        },
        field: 'template',
        headerName: '',
        width: 70,
        sortable: false,
        pinned: 'left',
      },
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
        minWidth: 300,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.openCommentEY,
        },
        headerName: 'Open comments (EY)',
        sortable: true,
        filter: false,        
        resizeable: true, 
        minWidth: 300,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.openCommentClient,
        },
        headerName: 'Open comments (Client)',
        sortable: true,
        filter: false,        
        resizeable: true, 
        minWidth: 300,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.urlDownload,
        },
        headerName: 'Actions',
        sortable: true,
        filter: false,        
        resizeable: true, 
        minWidth: 300,
        sort:'asc'
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

 datasetsReportRowsSelected(event) {
  console.log('dataset emiter',  event);
  this.datasetsSelectedRows = event;
}

onSubmitApproveDatasets() {
  console.log('dataset de prueba -->', this.datasetsSelectedRows); 
  this.datasetsSelectedRows.forEach(ele => { 
    this.rowData[this.rowData.findIndex(item => item.id === ele.id)].approvedBack = true;
  }); 
  console.log('row data submit-->', this.rowData)
  //this.rowData = [];
  //this.createHistoryRowData();
  //this.getCompletedProductCyclesData(this.productCycleId);
}

handleGridReady(params) {
  this.gridApi = params.api;
} 

}
