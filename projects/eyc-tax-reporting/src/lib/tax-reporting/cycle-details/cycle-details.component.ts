import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { Location } from '@angular/common';
import { ProductionCycleService } from '../services/production-cycle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {ErrorModalComponent, fileUploadHeading, PermissionService} from 'eyc-ui-shared-component';
import {AssignUsersModalComponent} from '../assign-users-modal/assign-users-modal.component'
import { identifierName } from '@angular/compiler';

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
    private router:Router,
    public permissions: PermissionService
  ) {}

   pageName:string = 'Cycle Details';
   activeFilings: any[] = [];
   activeReports: any[] = []
   completedFunds: any[] = [];
   filingResp: any[] = [];
   productCycleId;
   productCycleName;
   productCycleParams:string;
   permissionApproval = this.permissions.validatePermission('Production Cycles', 'Fund Approval');

  noOfCompletdFilingRecords = 10;
  currentPage = 0;
  maxPages = 5;
  searchNoDataAvilable = false;
  activeReportsSearchNoDataAvilable = false;
  iDs = "";
  
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
  @ViewChild('assignedToTemplate')
  assignedToTemplate: TemplateRef<any>;

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
  startClass = true;


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
    this.router.navigate(['comment-page',row.id,row.name,this.productCycleName,row.status,row.openCommentsEY,row.openCommentsClient]);
  }

   getCompletedProductCyclesData(id:any) {
     this.completedFunds = [];
     this.productcyclesService.getProductionCyclesDetails(id).subscribe(resp => {    
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.name,
          hasContent: item.hasContent,
          id: item.id,
          status : item.status,
          approved: this.isApproved(item.status) || !this.permissionApproval || item.openCommentsEY > 0 || item.openCommentsClient > 0,
          approvedBack: this.isApproved(item.status), 
          openCommentsEY: item.openCommentsEY,
          openCommentsClient: item.openCommentsClient,
          assignedTo: item.assignedUsers == null ? [] : item.assignedUsers
        };
        this.completedFunds.push(eachitem);
      });
       this.createFundRowData();
     });
   }

   isApproved(status: string): boolean {
     return status.toLowerCase() === 'approved';
   }

   createFundRowData() {
     this.rowData = [];
     this.completedFunds.forEach(fund => {
      this.rowData.push({
        name: fund.name,
        hasContent: fund.hasContent,
        id:fund.id,
        status: fund.status,
        approved:fund.approved,
        approvedBack:fund.approvedBack,
        openCommentsEY:fund.openCommentsEY,
        openCommentsClient:fund.openCommentsClient,
        assignedTo:fund.assignedTo
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
        minWidth: 400,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.assignedToTemplate,
        },
        headerName: 'Assigned to',
        field: 'assignedTo',
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
    if (this.iDs == "") {
      this.iDs = ele.id 
    } else {
      this.iDs = this.iDs + "," + ele.id 
    }
  }); 
  const body = {
                "status": "approved", 
                "fundIds": this.iDs.split(',')
               }
  console.log("body: ", body.fundIds);
  this.productcyclesService.putApproveEntities(body).subscribe(resp => {
    console.log(resp);
      setTimeout(() => {
      console.log(resp);
    }, 5000); 
  });
  console.log('row data submit-->', this.rowData)
  //this.createHistoryRowData();
  this.getCompletedProductCyclesData(this.productCycleId);
}

handleGridReady(params) {
  this.gridApi = params.api;
} 

addUsersToFund(_id:any) {
  const dialogRef = this.dialog.open(AssignUsersModalComponent, {
    id:'add-user-modal',
    width: '500px',
    data: {
      fundsAssign : this.rowData.filter(x => x.id === _id),
      header: "Update Assignment",
      idFund: _id,
      footer: {
        style: "start",
        YesButton: "Save",
        NoButton: "Cancel"
      }
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('add-user-modal was closed', result);
    if (result.button === "Save") {
      this.getCompletedProductCyclesData(this.productCycleId);
    } else {
      console.log('result afterClosed', result);
    }
  });
}

}
