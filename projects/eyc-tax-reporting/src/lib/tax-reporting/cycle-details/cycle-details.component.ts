import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { Location } from '@angular/common';
import { ProductionCycleService } from '../services/production-cycle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent, fileUploadHeading, PermissionService } from 'eyc-ui-shared-component';
import { AssignUsersModalComponent } from '../assign-users-modal/assign-users-modal.component'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LegendPosition,colorSets } from 'eyc-charts-shared-library';

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

    private router: Router,
    public permissions: PermissionService,
    private fb: FormBuilder
  ) { }

  pageName: string = 'Cycle Details';
  toggleLeftTitle: string = "View my assigned funds";
  disabledLeftToggle: boolean = true;
  showOnlyMyAssignedFunds: boolean = false;
  dropdownMessage: string = 'View summary details of all workbook deliverables. You can change the production cycle with the dropdown selection below.';
  activeFilings: any[] = [];
  activeReports: any[] = []
  completedFunds: any[] = [];
  filingResp: any[] = [];
  productCycleId;
  productCycleName;
  productCycleParams: string;
  permissionApproval = this.permissions.validatePermission('Production Cycles', 'Fund Approval');



  noOfCompletdFilingRecords = 10;
  currentPage = 0;
  maxPages = 5;
  searchNoDataAvilable = false;
  activeReportsSearchNoDataAvilable = false;
  iDs = "";
  cycleSelectForm: FormGroup;
  options: any[] = [];
  fileSummaries = [];

  //lib-donut-chart
  totalFilesText:string = 'OPEN'
  totalFilesNumberFontSize:number = 22;
  totalFilesTextFontSize:number = 16;
  totalExpected ='';
  colors: string[] = ["#FFB46A","#FF6D00"]
  colorScheme;
  colorScheme2;
  colorScheme3;
  openCommentsClientByProductCycle:number = 0;
  openCommentsEYByProductCycle:number = 0;

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
  toastSuccessMessage = '';
  showToastAfterSubmit = false;
  



  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productCycleName = params.name
      this.productCycleId = params.id
    });
    this.submitDatasets = this.onSubmitApproveDatasets.bind(this);
    this.getOptionsProductCycles();
    this.cycleSelectForm = this.fb.group({
      mySelect: [this.productCycleId]
    });
  }

  backtoCycleView() {
    //this.location.back();
    this.router.navigate(['app-tax-reporting']);
  }

  ngAfterViewInit(): void {
     this.getCompletedProductCyclesData(this.productCycleId)
  }

  showMyAssignedFunds() {
    if (this.completedFunds.length > 0) {
      this.showOnlyMyAssignedFunds = !this.showOnlyMyAssignedFunds
      if (this.showOnlyMyAssignedFunds) {
        let filterKey = sessionStorage.getItem('userEmail').toLowerCase()
        this.gridFilter(filterKey)
      } else {
        this.gridFilter('')
      }
    }
  }

  //Apply a filter to the grid
  gridFilter(filterKey: any) {
    if (filterKey.length > 0) {
      let arrfilterFunds = this.completedFunds.filter(fund => {
        let filterByFund = fund.assignedTo.find((assignedByFund) => {
          return assignedByFund.userEmail.toLowerCase() == filterKey
        })
        let res = (filterByFund == undefined) ? false : true;
        return res;
      })
      this.createFundRowData(arrfilterFunds)
    } else {
      this.createFundRowData(this.completedFunds)
    }
  }

  isToggleLeftDisabled() {
    if (this.completedFunds.length > 0) {
      //if have at less one assigned the button is enabled so return false.
      for (let fund of this.completedFunds) {
        if (fund.assignedTo.length > 0) this.disabledLeftToggle = false
      }
    }
  }


  getDownloadFile(row) {
    let urlDownloadfile = '';
    this.productcyclesService.getDownloadFile(row.id, row.name).subscribe(resp => {
      urlDownloadfile = resp['data'].downloadUrl;
      window.open(urlDownloadfile);
    });
  }

  createComment(row: any, type: any) {
    this.router.navigate(['comment-page', row.id, row.name, this.productCycleName, row.status, row.openCommentsEY, row.openCommentsClient, type, this.productCycleId]);
  }

  getCompletedProductCyclesData(id: any) {
    this.completedFunds = [];
    this.openCommentsClientByProductCycle = 0;
    this.openCommentsEYByProductCycle = 0;
    this.productcyclesService.getProductionCyclesDetails(id).subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.name,
          hasContent: item.hasContent,
          id: item.id,
          status: item.status,
          approved: this.isApproved(item.status) || !this.permissionApproval || item.openCommentsEY > 0 || item.openCommentsClient > 0 || !item.hasContent,
          approvedBack: this.isApproved(item.status),
          openCommentsEY: item.openCommentsEY,
          openCommentsClient: item.openCommentsClient,
          assignedTo: item.assignedUsers == null ? [] : item.assignedUsers
        };
        //total opens comments by product-cycle
        this.openCommentsClientByProductCycle = this.openCommentsClientByProductCycle + Number(item.openCommentsClient) ;
        this.openCommentsEYByProductCycle = this.openCommentsEYByProductCycle + Number(item.openCommentsEY) ;
        this.completedFunds.push(eachitem);
      });
      this.getFileSummuries();
      this.createFundRowData(this.completedFunds);
      this.router.navigate(['cycle-details', this.productCycleId, this.productCycleName]);
    });
  }

  isApproved(status: string): boolean {
    return status.toLowerCase() === 'approved';
  }

  createFundRowData(rowData: any) {
    let rowDatafunds = rowData
    this.rowData = [];
    rowDatafunds.forEach(fund => {
      this.rowData.push({
        name: fund.name,
        hasContent: fund.hasContent,
        id: fund.id,
        status: fund.status,
        approved: fund.approved,
        approvedBack: fund.approvedBack,
        openCommentsEY: fund.openCommentsEY,
        openCommentsClient: fund.openCommentsClient,
        assignedTo: fund.assignedTo
      })
    });
   this.isToggleLeftDisabled()


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
        sort: 'asc'
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
        sort: 'asc'
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
        sort: 'asc'
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
        sort: 'asc'
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
        sort: 'asc'
      }
    ];
  }

  datasetsReportRowsSelected(event) {
    this.datasetsSelectedRows = event;
  }

  onSubmitApproveDatasets() {
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
    this.getCompletedProductCyclesData(this.productCycleId);
  }


handleGridReady(params) {
  this.gridApi = params.api;
}

addUsersToFund(_id: any) {
  const dialogRef = this.dialog.open(AssignUsersModalComponent, {
    id: 'add-user-modal',
    width: '500px',
    data: {
      fundsAssign: this.rowData.filter(x => x.id === _id),
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
      this.toastSuccessMessage = "Users added successfully";
      this.showToastAfterSubmit = true;
      setTimeout(() => {
        this.showToastAfterSubmit = false;
      }, 4000);
      this.getCompletedProductCyclesData(this.productCycleId);
    } else {
      console.log('result afterClosed', result);
    }
  });
}

closeToast() {
  this.showToastAfterSubmit = false;
}

getOptionsProductCycles() {
  this.productcyclesService.getProductionCycles().subscribe(resp => {
    this.options = resp['data'];
  });
}

onOptionsSelected(idCycle){
  let cycle = this.options.find(x => x.id === idCycle);
  if (this.productCycleId != idCycle) {
    this.productCycleName = cycle.name;
    this.productCycleId = idCycle;
    this.getCompletedProductCyclesData(this.productCycleId);
  }
}

getTooltip(){
 var element= document.querySelector('.motif-tooltip-active');
  if(element != null){
    document.querySelector('.motif-pagination-select-wrapper').appendChild(element);
    window.scrollTo( 0, window.scrollY + 1);
    window.scrollTo( 0, window.scrollY - 1);
  }
}

getFileSummuries() {
  this.fileSummaries = [
    {
      label: "Client comments",
      value: this.openCommentsClientByProductCycle
    },
    {
      label: "EY comments",
      value: this.openCommentsEYByProductCycle
    }
  ]
}

setColorScheme() {
  //this.selectedColorScheme = 'red';
  this.colorScheme = colorSets.find(s => s.name === 'red');
  this.colorScheme2 = colorSets.find(s => s.name === 'orange');
  this.colorScheme3 = colorSets.find(s => s.name === 'teal');
}

}
