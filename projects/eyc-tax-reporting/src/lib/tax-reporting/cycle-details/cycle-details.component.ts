import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { Location } from '@angular/common';
import { ProductionCycleService } from '../services/production-cycle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent, fileUploadHeading, PermissionService } from 'eyc-ui-shared-component';
import { AssignUsersModalComponent } from '../assign-users-modal/assign-users-modal.component'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApproveFundModalComponent } from '../approve-fund-modal/approve-fund-modal.component';
import { colorSets } from 'eyc-charts-shared-library';
import { InformationBarChartModalComponent } from '../information-bar-chart-modal/information-bar-chart-modal.component'
import { BulkDownloadModalComponent } from '../bulk-download-modal/bulk-download-modal.component'
import { TaxCommentModalComponent } from '../../shared/tax-comment-modal/tax-comment-modal.component';
import { Subject } from 'rxjs';
import { WarningModalComponent } from '../../shared/warning-modal/warning-modal.component';
import { TaxLoaderService } from '../services/tax-loader.service';


@Component({
  selector: 'cycle-details',
  templateUrl: './cycle-details.component.html',
  styleUrls: ['./cycle-details.component.scss']
})
export class CycleDetailComponent implements OnInit {

  public openDocumentSaveDialog(): void {
    const documentSaveDialogRef = this.dialog.open(BulkDownloadModalComponent, {
      id: 'bulk-modal',
      width: '600px',
      data: {
        header: "Warning",
        description: "The selected files will be compressed into a zip file. You will receive an in-app notification alerting you when the files are ready for download.",
        important: "Please note that if you attempt to log out while the download is in progress, it will cancel the request and the download would not complete",
        question: "Are you sure want to cancel the request?",
        footer: {
          style: "start",
          YesButton: "Yes",
          NoButton: "No"
        }
      }
    });

    documentSaveDialogRef.afterClosed().subscribe(result => {
      if (!result)
        window.close()
    });
  }



  constructor(
    private productcyclesService: ProductionCycleService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    public permissions: PermissionService,
    private fb: FormBuilder,
    private LoaderService: TaxLoaderService
  ) { }

  isLoading: Subject<boolean> = this.LoaderService.isLoading;
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
  //permissionApproval = true



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
  totalFilesText: string = 'OPEN'
  totalFilesNumberFontSize: number = 22;
  totalFilesTextFontSize: number = 16;
  totalExpected = '';
  colors: string[] = ["#FF6D00", "#FFB46A"]
  colorScheme;
  colorScheme2;
  colorScheme3;
  openCommentsClientByProductCycle: number = 0;
  openCommentsEYByProductCycle: number = 0;

  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData;
  rowClass = 'row-style';
  columnDefs;
  columnDefsAgGrid;
  exportName;
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
  @ViewChild('status')
  status: TemplateRef<any>;
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
  @ViewChild('totalComments')
  totalComments: TemplateRef<any>;
  @ViewChild('statusChangedToTemplate')
  statusChangedToTemplate: TemplateRef<any>;


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
      description: "Are you sure that you want to approve this workbook deliverables? This indicates that you have no further comments.",
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
  showToastAfterSubmitBulk = false;
  widthDivChart;
  dataToChart;
  taxPreparationCount;
  clientReviewCount;
  approvedClientCount;
  colorsBarChart: any[] = [];
  labelsChart: any[] = [];
  downloadBtn = ''
  statusColors: string[] = ["#4EBEEB", "#57E188", '#724BC3']
  approveBtn: any;
  cancelbtn: any;
  blockApprovalProcess: boolean = false;
  waitApproval: boolean = false;
  processingCheck: any = '';
  setClickApproveButton = false;
  downloadButton: HTMLElement = document.createElement('button');
  fakeApproveButton: HTMLElement = document.createElement('div');
  isArchived: boolean = false;

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
    this.colorsBarChart = ['#9C82D4', '#87D3F2', '#8CE8AD'];
    this.labelsChart = ['In EY tax preparation', 'In client review', 'Approved by client'];
    this.widthDivChart = 950;
  }

  backtoCycleView() {
    this.router.navigate(['app-tax-reporting', this.isArchived]);
  }

  ngAfterViewInit(): void {
    this.getCompletedProductCyclesData(this.productCycleId)
    this.downloadButton = document.querySelector('.second-button') === null ? this.downloadButton : document.querySelector('.second-button');
    this.downloadButton.insertAdjacentHTML('beforeend', '<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.25 4.75H8.25V0.25H3.75V4.75H0.75L6 10L11.25 4.75ZM0.75 11.5V13H11.25V11.5H0.75Z" fill="#23232F"/></svg> Download');
    this.downloadButton.addEventListener('click', this.onClickSecondButton.bind(this));
    //this.setTooltips();
  }

  setTooltips(){
    setTimeout(()=>{
      const arrayTooltips = document.querySelectorAll('.motif-tooltip');
      arrayTooltips.forEach((userItem) => {
        document
          .querySelector('.ag-theme-material')
          .appendChild(userItem);
      });
        window.scrollTo(0, window.scrollY + 1);
    }, 500)
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
    var downloadButton: any = document.querySelector('.second-button');
    downloadButton.disabled = true;
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
      console.log("isToogleDisa: " + this.completedFunds.length)
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
    this.router.navigate(['comment-page', row.id, row.name, this.productCycleName, row.status, row.openCommentsEY, row.openCommentsClient, type, this.productCycleId, this.isArchived]);
  }

  getCompletedProductCyclesData(id: any, toast?: boolean, msgToast?: any) {
    this.completedFunds = [];
    this.openCommentsClientByProductCycle = 0;
    this.openCommentsEYByProductCycle = 0;
    this.productcyclesService.getProductionCyclesDetails(id).subscribe(resp => {
      (resp.data.isArchived != undefined) ? this.isArchived = resp.data.isArchived : this.isArchived = false;
      resp.data.productionCycleDetails.forEach((item) => {
        const eachitem: any = {
          name: item.name,
          hasContent: item.hasContent,
          id: item.id,
          status: this.setStatus(item.status, item.hasContent),
          approved: (!this.isApproved(item.status) && !item.hasContent) || !this.permissionApproval,
          approvedBack: this.isApproved(item.status),
          openCommentsEY: item.openCommentsEY,
          openCommentsClient: item.openCommentsClient,
          totalComments: item.totalComments,
          statusChangedDate: item.statusChangedDate,
          assignedTo: item.assignedUsers == null ? [] : item.assignedUsers
        };
        //total opens comments by product-cycle
        this.openCommentsClientByProductCycle = this.openCommentsClientByProductCycle + Number(item.openCommentsClient);
        this.openCommentsEYByProductCycle = this.openCommentsEYByProductCycle + Number(item.openCommentsEY);
        this.completedFunds.push(eachitem);
      });
      this.getOptionsProductCycles();
      this.getStatusCount();
      this.getFileSummuries();
      this.createFundRowData(this.completedFunds);
      this.router.navigate(['cycle-details', this.productCycleId, this.productCycleName]);
      if (toast) {
        this.toastSuccessMessage = msgToast;
        this.showToastAfterSubmit = true;
        setTimeout(() => {
          this.showToastAfterSubmit = false;
        }, 5000);
      }
      let existFakeBtn = document.querySelector('.fake-approved-btn')
      if(this.isArchived && (existFakeBtn == undefined || existFakeBtn == null)){
        this.fakeApproveButton.insertAdjacentHTML('beforeend', '<button _ngcontent-ase-c208="" motifbutton="" color="secondary" size="large" class="motif-button fake-approved-btn ng-star-inserted" disabled="">Approve selected</button>');
        document.querySelector('.buttons').prepend(this.fakeApproveButton)
      }
    });
  }

  //Set the state for showing in the grid table--
  setStatus(status: any, deliverables: any): string {
    //Is not undefined, null or empty
    if (status == undefined || status == null || status == '') {
      return 'error'
    }
    else if (status.toLowerCase() == 'open' && deliverables == true) {
      return 'In client review'
    }
    else if (status.toLowerCase() == 'open' && deliverables == false) {
      return 'In EY tax preparation'
    }
    else if (status.toLowerCase() == 'approved') {
      return 'Approved by client'
    }
  }

  isApproved(status: string): boolean {
    return status.toLowerCase() === 'approved';
  }

  createFundRowData(rowData: any) {
    let rowDatafunds = rowData
    console.log(rowData)
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
        totalComments: fund.totalComments,
        statusChangedDate: fund.statusChangedDate,
        assignedTo: fund.assignedTo,
        assignedToSearch: fund.assignedTo.length > 0 ? this.splitAssignedUser(fund.assignedTo) : ''
      })
    });
    this.isToggleLeftDisabled();
    setTimeout(() =>{
      this.columnDefsAgGrid = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.datasetsDropdownTemplate,
          },
          headerName: '',
          field: 'template',
          width: 70,
          pinned: 'left',
          menuTabs: [],
          headerCheckboxSelection: this.rowData.some(item => item.approved == false),
          checkboxSelection: params=>params.data.approved == false,
        },
        {
          valueGetter: 'node.rowIndex + 1',
          sortable: false,
          menuTabs: [],
          pinned: 'left',
          width: 70,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.fundName,
          },
          headerName: 'Fund name',
          field: 'name',
          sortable: true,
          filter: true,
          resizeable: true,
          minWidth: 250,
          maxWidth: 400,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.status,
          },
          headerName: 'Status',
          field: 'status',
          sortable: true,
          filter: true,
          resizeable: false,
          minWidth: 150,
          maxWidth: 200,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.assignedToTemplate,
          },
          headerName: 'Assigned to',
          field: 'assignedToSearch',
          sortable: true,
          filter: true,
          resizeable: true,
          minWidth: 170,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.statusChangedToTemplate,
          },
          headerName: 'Status changed',
          field: 'statusChangedDate',
          sortable: true,
          filter: true,
          resizeable: true,
          minWidth: 220,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
  
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.totalComments,
          },
          headerName: 'Total comments',
          field: 'totalComments',
          sortable: true,
          filter: 'agNumberColumnFilter',
          resizeable: true,
          minWidth: 220,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.openCommentEY,
          },
          headerName: 'Open comments (EY)',
          field: 'openCommentsEY',
          sortable: true,
          filter: 'agNumberColumnFilter',
          resizeable: true,
          minWidth: 220,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.openCommentClient,
          },
          headerName: 'Open comments (Client)',
          field: 'openCommentsClient',
          sortable: true,
          filter: 'agNumberColumnFilter',
          resizeable: true,
          minWidth: 220,
          sort: 'asc'
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.urlDownload,
          },
          headerName: 'Actions',
          suppressMenu:true,
          resizeable: true,
          minWidth: 150,
          maxWidth: 200
        }
      ];
    }, 100)
    this.exportName = this.productCycleName + '_cycle_details_';
  }

  filterByOpenC(fund) {
    if (fund.status == 'In client review' && (fund.openCommentsClient > 0 || fund.openCommentsEY > 0)) {
      return true
    }
  }

  checkDataProcess(data) {
    console.log('click', data)
    this.processingCheck = data;
  }

  approveClickEv(e) {
    e.stopPropagation();
    this.LoaderService.show();
    //I check that the datasetsSelectedRows is complete before processing the execution of the approve
    let timerId = setInterval(() => {
      if (this.processingCheck === 'finished' || this.processingCheck === 'init') {
        clearInterval(timerId)
        this.processingCheck = 'init'
        console.log('datasetsSelectedRows after processing', this.datasetsSelectedRows)
        if (this.datasetsSelectedRows.length == 0) {
          this.LoaderService.hide();
          this.openErrorModal("Warning",
            "You must select at least one fund in order to submit an approval request");
        }
        else {
          let arrFilterOpenC = this.datasetsSelectedRows.filter(this.filterByOpenC)
          this.LoaderService.hide();
          if (arrFilterOpenC.length > 0) {
            //Comments are open, an alert message is displayed
            this.openWarningDialog();
          } else {
            this.openApprovalDialog();
          }
        }
      }
    }, 100);
  }

  openWarningDialog() {
    const warningDialog = this.dialog.open(WarningModalComponent, {
      id: 'warning-modal',
      width: '639px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        header: "Warning",
        footer: {
          style: "start",
          NoButton: "Close"
        }
      }
    });
  }
  openApprovalDialog() {
    const fundsSelected = this.datasetsSelectedRows.length;
    const approvalDialog = this.dialog.open(ApproveFundModalComponent, {
      width: '550px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        type: "Confirmation",
        header: "Approve (" + fundsSelected + " selected)",
        description: "Are you sure want to approve this workbook deliverables? This indicates that you have no further comments.",
        footer: {
          style: "start",
          YesButton: "Continue",
          NoButton: "Cancel"
        }
      }
    });

    approvalDialog.afterClosed().subscribe(result => {
      console.log('AproveFundModal was closed', result);
      if (result.button === "Continue") {
        this.onSubmitApproveDatasets();
      } else {
        console.log('result afterClosed', result);
      }
    });
  }

  openErrorModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: header,
        description: description,
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
  }

  datasetsReportRowsSelected(event) {
    if (this.setClickApproveButton === false) {
      this.setClickApproveButton = true;
      this.cancelbtn = document.querySelector('.second-button');
      if (!this.isArchived) {
        this.approveBtn = document.querySelector('.approve-button button');
        this.approveBtn.addEventListener("click", this.approveClickEv.bind(this), true);
        this.approveBtn.disabled = true;
      }
    }
    this.cancelbtn.disabled = true;
    this.datasetsSelectedRows = event;
    if (this.datasetsSelectedRows.length > 0) {
      (this.approveBtn != null || this.approveBtn != undefined ) ? this.approveBtn.disabled = false : '';
      this.cancelbtn.disabled = false;
    } else {
      (this.approveBtn != null || this.approveBtn != undefined ) ? this.approveBtn.disabled = true : '';
      this.cancelbtn.disabled = true;
    }
  }

  onSubmitApproveDatasets() {
    this.iDs = "";
    this.datasetsSelectedRows.forEach(ele => {
      this.iDs = this.iDs === "" ? ele.id : this.iDs + "," + ele.id;
    });
    const body = {
      "status": "approved",
      "fundIds": this.iDs.split(',')
    }
    this.productcyclesService.putApproveEntities(body).subscribe(resp => {
      this.getCompletedProductCyclesData(this.productCycleId, true, "Fund approved successfully");
    });
    this.cancelbtn.disabled = true;
  }


  handleGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('paginationChanged', this.resetPaginationSelection.bind(this));
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
      if (result.button === "Save") {
        this.getCompletedProductCyclesData(this.productCycleId, true, "Users added successfully");
      } else {
        console.log('result afterClosed', result);
      }
    });
  }

  approveFund(_id: any) {
    const dialogRef = this.dialog.open(ApproveFundModalComponent, {
      id: 'approve-fund-modal',
      width: '550px',
      data: {
        header: "Approve Fund",
        footer: {
          style: "start",
          YesButton: "Continue",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Continue") {
        let funds = [];
        funds.push(_id);
        const body = {
          "status": "approved",
          "fundIds": funds
        }
        this.productcyclesService.putApproveEntities(body).subscribe(resp => {
          this.getCompletedProductCyclesData(this.productCycleId, true, "Fund approved successfully");
        });
      }
    });
  }

  addCommentToFund(_id: any, _name: string) {
    const dialogRef = this.dialog.open(TaxCommentModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "New comment",
        description: ``,
        entityId: _id,
        entityType: "funds",
        forms: {
          isSelect: true,
          selectDetails: {
            label: "Scope",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: _name, id: '1' },
            ]
          },
          isTextarea: true,
          textareaDetails: {
            label: "Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Post",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Post") {
        this.getCompletedProductCyclesData(this.productCycleId, true, "Comment added successfully");
      } else {
        console.log('result afterClosed', result);
      }
    });

  }

  closeToast() {
    this.showToastAfterSubmit = false;
    this.showToastAfterSubmitBulk = false;
  }

  getOptionsProductCycles() {
    if (this.isArchived) {
      this.options = JSON.parse(sessionStorage.getItem('archivedProdCyclesList'));
    } else {
      this.options = JSON.parse(sessionStorage.getItem('productionCyclesList'));
    }

  }

  onOptionsSelected(idCycle) {
    let cycle = this.options.find(x => x.id === idCycle);
    if (this.productCycleId != idCycle && cycle != undefined) {
      this.productCycleName = cycle.name;
      this.productCycleId = idCycle;
      this.cycleSelectForm.patchValue({ mySelect: idCycle });
      this.getCompletedProductCyclesData(this.productCycleId);

      //To clean de selected option class
      let allElements: any = document.querySelectorAll('#selectNewCycle .motif-select-field-list button');
      if (allElements.length > 0) {
        allElements.forEach(element => {
          element.classList.remove('checked');
        });
      }
      //this.setTooltips();
    }
  }

  getTooltip() {
    var element = document.querySelector('.motif-tooltip-active');
    if (element != null) {
      document.querySelector('.ag-status-bar').appendChild(element);
      window.scrollTo(0, window.scrollY + 1);
      setTimeout(()=>{
        element.classList.add('motif-tooltip-clicked-cycle-details');
        window.scrollTo(0, window.scrollY - 1); 
      },500)         
    }
  }

  getFileSummuries() {
    this.fileSummaries = [
      {
        label: "Open client comments",
        value: this.openCommentsClientByProductCycle
      },
      {
        label: "Open EY comments",
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

  getStatusCount() {
    this.taxPreparationCount = this.completedFunds.filter(item => item.hasContent === false).length;
    this.clientReviewCount = this.completedFunds.filter(item => (item.hasContent === true && item.approvedBack === false)).length;
    this.approvedClientCount = this.completedFunds.filter(item => item.approvedBack === true).length;
    this.dataToChart = [
      {
        "in EY tax preparation": this.taxPreparationCount,
        "in client review": this.clientReviewCount,
        "Approved by client": this.approvedClientCount
      }
    ];
  }

  informationModal() {
    const dialogRef = this.dialog.open(InformationBarChartModalComponent, {
      id: 'info-modal',
      width: '600px',
      data: {
        header: "Information for cycle status indicator",
        description: "You can hover over each bar in the graph to see the progress. The below legend shows what stage the funds are in.",
        footer: {
          style: "start",
          YesButton: "Save",
          NoButton: "Close"
        }
      }
    });
  }

  unApproveFund(row: any) {
    let funds = [];
    funds.push(row.id);
    const body = {
      "status": "open",
      "fundIds": funds
    }
    this.productcyclesService.putApproveEntities(body).subscribe(resp => {
      this.getCompletedProductCyclesData(this.productCycleId, true, "Fund unapproved successfully");
    });
  }

  getMoreDetailsPage() {
    this.router.navigate(['comments-details', this.productCycleId, this.productCycleName, this.isArchived]);
  }

  removeEvCloseSession(e: Event) {
    e.stopPropagation();
  }

  onClickSecondButton() {
    this.LoaderService.show();
    let timerId = setInterval(() => {
      if (this.processingCheck === 'finished' || this.processingCheck === 'init') {
        clearInterval(timerId)
        this.processingCheck = 'init'
        let fundsSelected = this.datasetsSelectedRows.length;
        console.log('Selected rows after processing', this.datasetsSelectedRows)
        this.LoaderService.hide();
        const dialogRef = this.dialog.open(BulkDownloadModalComponent, {
          id: 'bulk-modal',
          width: '600px',
          disableClose: true,
          hasBackdrop: true,
          data: {
            header: "Download (" + fundsSelected + " selected)",
            description: "The selected files will be compressed into a zip file. You will receive an in-app notification alerting you when the files are ready for download.",
            important: "Please note that logging out of the application before files are finished processing will cancel this request.",
            question: "Are you sure want to download the selected files?",
            funds: this.datasetsSelectedRows,
            footer: {
              style: "start",
              YesButton: "Yes",
              NoButton: "No"
            }
          }
        });

        dialogRef.beforeClosed().subscribe(result => {
          if (result.button === "Yes") {
            console.log('YES')
          }
        });

        dialogRef.componentInstance.bulkprocesed.subscribe(result => {
          this.toastSuccessMessage = "Download in progress. This may take a few minutes.";
          this.showToastAfterSubmitBulk = true;
          setTimeout(() => {
            this.showToastAfterSubmitBulk = false;
          }, 4000);
        });
      }
    }, 100);
  }

  // Set text-legend color
  setClasses(row) {

    if (row.status == 'In client review') {
      return this.statusColors[0]
    }
    else if (row.status == 'In EY tax preparation') {
      return this.statusColors[2]
    }
    else if (row.status == 'Approved by client') {
      return this.statusColors[1]
    }
  }

  splitAssignedUser(arrayUsers: any) {
    var result: string[] = [];
    if (arrayUsers) {
      arrayUsers.forEach(user => {
        let name = user.userFirstName + " " + user.userLastName
        let initials = user.userFirstName.charAt(0) + user.userLastName.charAt(0)
        result.push(name);
        result.push(initials);
      });
    }
    return result.join(",");
  }

  OptionsClassSelected() {
    let optionSelected = document.querySelector('#selectNewCycle .motif-select-field-list button[data-value="' + this.productCycleId + '"]');
    if (optionSelected != null) {
      optionSelected.classList.remove('unchecked');
      optionSelected.classList.add('checked');
    }
  }

  searchGrid(input) {
    this.gridApi.setQuickFilter(input);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }

  resetPaginationSelection() {
    //Initialize pagination data
    let paginationSize = this.gridApi.paginationGetPageSize();
    let currentPageNum = this.gridApi.paginationGetCurrentPage();
    let totalRowsCount = this.gridApi.getDisplayedRowCount();

    //Calculate current page row indexes
    let currentPageRowStartIndex = (currentPageNum * paginationSize);
    let currentPageRowLastIndex = (currentPageRowStartIndex + paginationSize);
    if (currentPageRowLastIndex > totalRowsCount) currentPageRowLastIndex = (totalRowsCount);

    for (let i = 0; i < totalRowsCount; i++) {
      //Set isRowSelectable=true attribute for current page rows, and false for other page rows
      let isWithinCurrentPage = (i >= currentPageRowStartIndex && i < currentPageRowLastIndex);
      this.gridApi.getDisplayedRowAtIndex(i).setRowSelectable(isWithinCurrentPage);
    }
  }

}


