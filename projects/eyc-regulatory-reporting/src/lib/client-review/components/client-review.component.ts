import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ClientReviewService } from '../services/client-review.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent , PermissionService, DEFAULT_PAGE_SIZE } from 'eyc-ui-shared-component';
import { Router } from '@angular/router';
import { EycRrSettingsService } from './../../services/eyc-rr-settings.service';
import { DatePipe } from '@angular/common';
import { rr_module_name } from '../../config/rr-config-helper';

@Component({
  selector: 'lib-client-review',
  templateUrl: './client-review.component.html',
  styleUrls: ['./client-review.component.scss']
})
export class ClientReviewComponent implements OnInit, OnDestroy {

  filingDetails:any;
  commentsData;
  commentsName;
  commentEntityType
  showComments = false;
  currentEntityReviewLevel;
  moduleOriginated = rr_module_name;
  constructor(
    private service: ClientReviewService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog,
    private router: Router,
    public permissions: PermissionService,
    private settingsService: EycRrSettingsService,
    public datepipe: DatePipe
    ) { }

  tabs;
  exportURL;
  exportHeaders;
  entityId;
  selectedRows = [];
  selectedEntities = [];
  selectedExceptionIds = [];
  approveFilingEntitiesModal = false;
  showToastAfterApproveFilingEntities = false;
  showToastAfterApproveExceptionReports = false;
  showToastAfterUnApproveFilings = false;
  actionMenuModal = false;
  actionMenuModalEnabled = false;
  selectedEntityId;
  selectedExceptionId;
  @ViewChild('actionMenuTemp', { static: false }) actionMenuCard: ElementRef;
  modalMessage:any;

  status = {
    stage: 'Client Review',
    progress: 'in-progress'
  };

  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  exceptionDefs;
  exceptionData;
  exceptionDataForFilter = [];
  exceptionDefaultColDef;
  exceptionDetailCellRendererParams;
  exceptionReportRows;
  rowData = [];
  filingEntityRowData = [];
  exceptionRowData = [];
  submitFunction;
  submitException;
  submitEntities;

  currentPage = 0;
  totalRecords = 5;
  pageSize = DEFAULT_PAGE_SIZE;
  filter = '';
  sort = '';
  
  pageChangeFunc;
  exceptionModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve these exception report(s)?",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
      }
    }
  };

  entitiesModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected entities? This will approve them for submission.",
      footer: {
        style: "start",
        YesButton: "Yes",
        NoButton: "No"
      }
    }
  };
  showAuditLog = false;
  fileDetail;
  isAuditlogs = false;
  auditLogs = [];

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>
  @ViewChild('myTasksExceptionTemplate')
  myTasksExceptionTemplate: TemplateRef<any>
  @ViewChild('expandExceptionTemplate')
  expandExceptionTemplate: TemplateRef<any>;
  @ViewChild('viewDetTemplate')
  viewDetTemplate: TemplateRef<any>;
  @ViewChild('actionButtonTemplate')
  actionButtonTemplate: TemplateRef<any>;
  @ViewChild('viewFilingEntityTemplate')
  viewFilingEntityTemplate: TemplateRef<any>;
  @ViewChild('expandEntityTemplate')
  expandEntityTemplate: TemplateRef<any>;
  @ViewChild('lastUpdatedByTemplate')
  lastUpdatedByTemplate: TemplateRef<any>;
  @ViewChild('unresolveFilingTemplate')
  unresolveFilingTemplate: TemplateRef<any>;
  @ViewChild('unresolveExceptionTemplate')
  unresolveExceptionTemplate: TemplateRef<any>;
  @ViewChild('resolveFilingTemplate')
  resolveFilingTemplate: TemplateRef<any>;
  @ViewChild('resolveExceptionTemplate')
  resolveExceptionTemplate: TemplateRef<any>;
  

  ngOnInit(): void {
    this.submitEntities = this.onSubmitApproveFilingEntities.bind(this);
    this.submitException = this.onSubmitApproveExceptionReports.bind(this);
    this.pageChangeFunc = this.onPageChange.bind(this);
    sessionStorage.getItem("reportingTab") ? this.tabs = sessionStorage.getItem("reportingTab") : this.tabs = 2;

  }

  ngOnDestroy() {
    sessionStorage.removeItem("reportingTab");
  }

  resetData() {
    this.createEntitiesRowData();
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
  }

  getExceptionReports(resetData = false) {
    this.sort = resetData ? 'exceptionReportName:true' : this.sort;
    this.service.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period, 'Client review', this.currentPage, this.pageSize, this.filter, this.sort).subscribe(res => {
      this.exceptionData = res['data'];
      this.exceptionDataForFilter = this.exceptionData;
      this.totalRecords = res['totalRecords'];
      console.log(this.exceptionData);
      if (resetData) {
        this.resetData();
      } else {
        const newColDefs = this.gridApi.getColumnDefs();
        this.exceptionDefs = [];
        this.exceptionDefs = newColDefs;
        console.log('EXCEPTION DATA COL', this.exceptionData);
        this.exceptionRowData = [...this.exceptionData];
      }
      
    },error=>{
      this.exceptionData =[];
      console.log("Client Review error");
    });

  }

  getFilingEntities(resetData = false){
    this.sort = resetData ? 'entityName:true' : this.sort;
    this.service.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period, this.currentPage, this.pageSize, this.filter, this.sort).subscribe(res => {
      this.rowData = res['data'];
      this.totalRecords = res['totalRecords'];
      if (resetData) {
        this.resetData();
      } else {
        const newColDefs = this.gridApi.getColumnDefs();
        this.columnDefs = [];
        this.columnDefs = newColDefs;
        this.filingEntityRowData = [...this.rowData];
      }
    },error=>{
      this.rowData =[];
      console.log("Client Review error");
    });
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approved === false);
      return thisIsFirstColumn;
    } else {
      const thisIsFirstColumn = (displayedColumns[0] === params.column)  && !(this.rowData.every(item => item.approved === true));
      return thisIsFirstColumn;
    }
  }

  checkFilingCompletedStatus(){
    return this.filingService.checkFilingCompletedStatus(this.filingDetails);
  }

  
  createEntitiesRowData(): void {
    const customComparator = (valueA, valueB) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    };
    this.columnDefs = [];
    this.exceptionDefs = [];
    this.filingEntityRowData = [];
    this.exceptionRowData = [];
    setTimeout(() => {
      this.columnDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'template',
          headerName: '',
          width: 20,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.actionButtonTemplate,
          },
          headerName: 'Action',
          field: 'template',
          minWidth: 70,
          width: 70,
          sortable: false,
          cellClass: 'actions-button-cell',
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'ID',
          field: 'fundId',
          sortable: true,
          filter: true,
          width: 140,
          comparator: this.disableComparator
        },
        /* {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Group',
          field: 'entityGroup',
          sortable: true,
          filter: true,
          sort:'asc',
          comparator: customComparator
        }, */
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.expandEntityTemplate,
          },
          headerName: 'Entity Name',
          field: 'entityName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 300,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Review Level',
          field: 'reviewLevel',
          sortable: true,
          filter: true,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.unresolveFilingTemplate,
          },
          headerName: 'Unresolved',
          field: 'unResolvedException',
          sortable: true,
          filter: true,
          width: 210,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.resolveFilingTemplate,
          },
          headerName: 'Resolved',
          field: 'resolvedException',
          sortable: true,
          filter: true,
          width: 210,
          comparator: this.disableComparator
        },
         /*,
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'My Tasks',
          field: 'myTasks',
          sortable: true,
          filter: true,
          width: 140
        }, */
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentTemplate,
          },
          headerName: 'Comments',
          field: 'commentsCount',
          sortable: true,
          filter: true,
          width: 155,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.lastUpdatedByTemplate,
          },
          headerName: 'Last Updated By',
          field: 'updatedBy',
          wrapText: true,
          autoHeight: true,
          sortable: true,
          filter:true,
          width: 300,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.viewFilingEntityTemplate,
          },
          width: 50
        }
      ];

      this.exceptionDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'approved',
          headerName: '',
          width: 20,
          sortable: false,
          pinned: 'left',
          filter: false,
          cellStyle: params => 
          (this.filingDetails.status[4].progress === null || this.filingDetails.status[4].progress === 'COMPLETED' || this.filingDetails.status[4].progress === 'Completed') ?  
              {'pointer-events': 'none'}
              : ''
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.actionButtonTemplate,
          },
          headerName: 'Action',
          field: 'template',
          minWidth: 70,
          width: 70,
          sortable: false,
          cellClass: 'actions-button-cell',
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exception Report Type',
          field: 'exceptionReportType',
          sortable: true,
          filter: true,
          comparator: this.disableComparator,
          autoHeight: true,
         wrapText: true,
         width: 300
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.expandExceptionTemplate,
          },
          headerName: 'Exception Report Name',
          field: 'exceptionReportName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 300,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.unresolveExceptionTemplate,
          },
          headerName: 'Unresolved',
          field: 'unresolved',
          sortable: true,
          filter: true,
          width: 210,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.resolveExceptionTemplate,
          },
          headerName: 'Resolved',
          field: 'resolved',
          sortable: true,
          filter: true,
          width: 210,
          comparator: this.disableComparator
        },
       /*  {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Review Level',
          field: 'reviewLevel',
          sortable: true,
          filter: true,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.myTasksExceptionTemplate,
          },
          headerName: 'My Tasks',
          field: 'mytask',
          sortable: true,
          filter: true,
        }, */
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentExceptionTemplate,
          },
          headerName: 'Comments',
          field: 'comments',
          sortable: true,
          filter: true,
          width: 155,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.lastUpdatedByTemplate,
          },
          headerName: 'Last Updated By',
          field: 'updatedBy',
          wrapText: true,
          autoHeight: true,
          sortable: true,
          filter:true,
          width: 300,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.viewDetTemplate,
          },
          width: 50
        }
      ];
      this.filingEntityRowData = this.rowData;
      this.exceptionRowData = this.exceptionData;
    }, 1);
      
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  disableComparator(data1, data2) {
    return 0; 
  }
  
  exceptionEntitySwitch(resetData = false) {
    if (this.tabs == 2) {
      this.getFilingEntities(resetData);
    } else if (this.tabs == 1) {
      this.getExceptionReports(resetData);
    }
  }

  onPageChange() {
    this.exceptionEntitySwitch();
  }

  currentPageChange(event) {
    console.log('CURRENT PAGE CHANGE', event - 1);
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    console.log('CURRENT PAGE SIZE', event);
    this.pageSize = event;
    this.exceptionEntitySwitch();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.exceptionEntitySwitch(true);
  }

  sortChanged(event) {
    this.sort = event;
    this.exceptionEntitySwitch();
  }

  /* onRowSelected(event: any): void {
    let selectedArr = [];
    selectedArr = this.gridApi.getSelectedRows();
    this.selectedRows =selectedArr.filter(item => item.approved === false);
    if(this.selectedRows.length === 0){
      this.gridApi.deselectAll();
    }
    if(this.selectedRows.length === (this.rowData.filter(item => item.approved === false)).length){
      this.gridApi.selectAll();
    }
  }
 */
  receiveMessage($event) {
    this.tabs = $event;
    this.filter = '';
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
    if(this.tabs == 2){
      this.modalMessage = ' Are you sure you want to approve the selected entities? This will approve them for submission.';
      this.getFilingEntities(true);
    } else if (this.tabs == 1) {
      this.modalMessage = 'Are you sure you want to approve these exception reports?';
      this.getExceptionReports(true);
    }
  }
  

  receiveFilingDetails(event) {
    this.filingDetails = event;
    // this.getFilingEntities();
    if (this.tabs == 2) {
      this.getFilingEntities(true);
    }
    if (this.tabs == 1) {
      this.getExceptionReports(true);
    }
  }

  onSubmitApproveFilingEntities() {
    let selectedFiling = {
      "currentReviewlevel": this.selectedRows.map(({ reviewLevel }) => reviewLevel)[0],
      "entityIds": this.selectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Client review"
    };
    this.service.approvefilingEntities(selectedFiling).subscribe(res => {
      res['data'].forEach(ele => {
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approved = true;
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].updatedBy =  ele.updatedBy;
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].reviewLevel =  ele.reviewLevel;
      });
      this.createEntitiesRowData();
      this.selectedRows = [];
      this.filingService.invokeFilingDetails();
      this.approveFilingEntitiesModal = false;
      this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
      setTimeout(() => {
        this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
      }, 5000);
    });
  }

  onSubmitApproveExceptionReports() {
    console.log(this.exceptionReportRows);
    const filingDetails = this.filingDetails;
    let selectedFiling = {
      "exceptionReportIds": this.exceptionReportRows.map(({ exceptionId }) => exceptionId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Client review"
    };
    this.service.approveAnswerExceptions(selectedFiling).subscribe(res => {
      res['data']['answerExceptions'].forEach(ele => {
        this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
        this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].updateBy = ele.updatedBy;
        this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].resolved = ele.resolved;
        this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].unresolved = ele.unresolved;
        /* let selectedException = this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)];
        console.log('resolve exception val >', selectedException);
        if(selectedException.resolveOrException.indexOf("/") !== -1){ 
          let exceptionVal = selectedException.resolveOrException.split("/");
          console.log('excpetion val > ', exceptionVal);
          let updatedExceptionVal = exceptionVal[1]+'/'+exceptionVal[1];
          this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].resolveOrException = updatedExceptionVal;
        } */
      });
      this.createEntitiesRowData();
      this.exceptionReportRows = [];
      this.filingService.invokeFilingDetails();
      this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
      setTimeout(() => {
        this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
      }, 5000);
    });

    /* console.log(this.exceptionReportRows);
    this.exceptionReportRows.forEach(ele => {
      this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
    });
    this.createEntitiesRowData(); */
  }

  exceptionReportRowsSelected(event) {
    console.log(event);
    this.exceptionReportRows = event;
  }

  filingEnitiesRowsSelected(event) {
    console.log(event);
    this.selectedRows = event;
  }

  addComment(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.entityId,
        entityType: "FILING_ENTITY",
        moduleOriginated: rr_module_name,
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data:[
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails:{
            label:"Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
        this.rowData[this.rowData.findIndex(item => item.entityId === row.entityId)].commentsCount = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.exceptionId,
        entityType: "ANSWER_EXCEPTION_REPORT",
        moduleOriginated: rr_module_name,
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data:[
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails:{
            label:"Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      if(result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
        this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === row.exceptionId)].comments = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  onClickMyTask(event){
    console.log(event);
    if(event){
      this.exceptionData = this.exceptionDataForFilter.filter(item => item.mytask ==true);
    } else {
      this.exceptionData = this.exceptionDataForFilter
    }
  }


  openComments(row) {
     this.commentsName = this.filingDetails.filingName + ' // ' + this.filingDetails.period;
     if (this.tabs == 2) {
      this.commentEntityType = 'FILING_ENTITY';
      this.entityId = row.entityId;
     } else {
      this.commentEntityType = 'ANSWER_EXCEPTION_REPORT'
      this.entityId = row.exceptionId;
     }
     this.showComments = true;
    /*this.rrservice.getComments('filing', 2).subscribe(res => {
      this.commentsData = res['data'];
    },error=>{
      this.commentsData =[];
      console.log("Comments error");
    }); */
    
  }

  actionMenuEnableforEntity(row) {
    this.currentEntityReviewLevel = '';
    console.log('Client Review > unapprove > entity');
    this.selectedEntityId = row.entityId;
    this.currentEntityReviewLevel = row.reviewLevel;
  setTimeout(() => {
    this.actionMenuModalEnabled = true;
    this.actionMenuModal = true;
  }, 1);
  }

actionMenuEnableforException(row) {
  console.log('Client Review > unapprove > exception');
    this.selectedExceptionId = row.exceptionId;
  setTimeout(() => {
    this.actionMenuModalEnabled = true;
    this.actionMenuModal = true;
  }, 1);
}

  unApproveEntity(){
    this.actionMenuModal = false;
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: "Confirmation",
        header: "Unapprove",
        description: "Are you sure you want to unapprove this entity? This will move this back to the previous reviewer/step",
        footer: {
          style: "start",
          YesButton: "Continue",
          NoButton: "Cancel"
        }
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button == 'Continue') {
        this.selectedEntities = [];
        this.selectedEntities.push(this.selectedEntityId);
        const filingDetails = this.filingDetails;
        let selectedFiling = {
          "currentReviewlevel": this.currentEntityReviewLevel,
          "entityType": "Filing Entity",
          "entities": this.selectedEntities,
          "filingName": this.filingDetails.filingName,
          "period": this.filingDetails.period,
          "stage": "Client review"
          };

          let tempRowData = this.rowData;
          this.rowData = [];
          this.service.unApprovefilingEntities(selectedFiling).subscribe(res => {
            res['data'].forEach(ele => {
              tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].approved = false;
              tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].reviewLevel =  ele.reviewLevel;
              tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].updatedBy =  ele.updatedBy;
          });
          this.rowData = tempRowData;
          this.createEntitiesRowData();
          this.selectedRows = [];
          this.filingService.invokeFilingDetails();
          this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
          setTimeout(() => {
            this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
          }, 5000);
        },error=>{
          this.rowData = tempRowData;
          this.createEntitiesRowData();
        });

      }
    });
  
    
  }

  unApproveException(){
    this.actionMenuModal = false;
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: "Confirmation",
        header: "Unapprove",
        description: "Are you sure you want to unapprove this exception report(s)? This will move this back to the previous reviewer/step",
        footer: {
          style: "start",
          YesButton: "Continue",
          NoButton: "Cancel"
        }
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button == 'Continue') {
        this.selectedExceptionIds = [];
        this.selectedExceptionIds.push(this.selectedExceptionId);
        const filingDetails = this.filingDetails;
        let selectedFiling = {
        "entityType": "Answer Exception Report",
        "entities":  this.selectedExceptionIds,
        "filingName": this.filingDetails.filingName,
        "period": this.filingDetails.period,
        "stage": "Client Review"
        };

        let tempRowData = this.exceptionData;
        this.exceptionData = [];
        this.service.unApproveAnswerExceptions(selectedFiling).subscribe(res => {
          res['data'].forEach(ele => {
            tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].approved = false;
            tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].updateBy = ele.updatedBy;
            tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].resolved = ele.resolved;
            tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].unresolved = ele.unresolved;
          });
          this.exceptionData = tempRowData;
          this.createEntitiesRowData();
          this.exceptionReportRows = [];
          this.filingService.invokeFilingDetails();
          this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
          setTimeout(() => {
            this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
          }, 5000);
        },error=>{
          this.exceptionData = tempRowData;
          this.createEntitiesRowData();
        });

      }
    });
  
    
  }


  commentAdded() {
    if (this.tabs==2) {
      this.getFilingEntities();
    } else {
      this.getExceptionReports();
    }
  }
  
  routeToExceptionDetailsPage(event:any) {
    this.filingService.setExceptionData = event;
    this.router.navigate(['/view-exception-reports'],{ state: { componentStage: 'Client Review' }});
  }

  routeToFilingEntityExceptionPage(event:any) {
    this.filingService.setFilingEntityData = event;
    this.router.navigate(['/view-filing-entity-exception'],{ state: { componentStage: 'Client Review' }});
  }

  @HostListener('document:click', ['$event'])
  public outsideClick(event) {
    if( this.actionMenuCard && !this.actionMenuCard.nativeElement.contains(event.target) && this.actionMenuModalEnabled){
      this.actionMenuModal = false;
      this.actionMenuModalEnabled = false;
    }
  }
  exportData(type) {
    if(type == 'entities') {
      if(this.permissions.validatePermission('Client Review', 'View Comments')) { 
        this.exportHeaders = 'fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,commentsCount:Comments,updatedBy:Last Updated By';
      } else {
        this.exportHeaders = 'fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,updatedBy:Last Updated By';
      }
      this.exportURL =  this.settingsService.regReportingFiling.client_review_filing_entities + "&filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period  + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    } else {
      if(this.permissions.validatePermission('Client Review', 'View Comments')) { 
        this.exportHeaders = 'exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,unresolved:Unresolved,resolved:Resolved,comments:Comments,updateBy:Last Updated By';
      } else {
        this.exportHeaders = 'exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,unresolved:Unresolved,resolved:Resolved,updateBy:Last Updated By';
      }
      this.exportURL =  this.settingsService.regReportingFiling.rr_exception_reports + "filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period + "&stage=Client Review" + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    }
    console.log("export URL > ", this.exportURL);

    this.service.exportCRData(this.exportURL).subscribe(resp => {
      console.log(resp);
    })
    
  }

  onClickLastUpdatedByEntity(row) {
    console.log(row);
    
    let auditObjectId = row.entityId;
    let auditObjectType = 'Filing Entity'

    this.fileDetail={
      "fileName": row.entityName
    }
    let auditList = []
    this.isAuditlogs = false;
    this.service.getAuditlog(auditObjectId, auditObjectType).subscribe(res => {
      res['data'].length ? this.showAuditLog = true : this.isAuditlogs = true;

      let data = res['data'].filter(item => item.auditDetails.auditObjectAttribute =='Stage')
      data.forEach((element, index) => {
        let item = this.copy(element)
        let item1 = this.copy(element)
        let item3 = this.copy(element)
        if(element.auditActionType == 'Approve') {
          
          if(index==0 && element.auditDetails.auditObjectCurValue !='NA') {
            item1['auditActionType'] = 'Started'
              auditList.push(item1)
          }
          item.auditDetails['auditObjectCurValue'] = element.auditDetails.auditObjectPrevValue
          auditList.push(item)

          if((index+1) ==data.length){
            item3['subTitle'] ='Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item3.auditDetails['auditObjectCurValue'] = 'Recording of events began on this date.';
            auditList.push(item3);
          }

        } else if (element.auditActionType == 'Unapprove') {
          if(index==0) {
            item1['auditActionType'] = 'Started'
              auditList.push(item1)
          }
          auditList.push(item)

          if((index+1) ==data.length){
            item3['auditActionType'] = 'Approve';
            item3['subTitle'] ='Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item3.auditDetails['auditObjectCurValue'] = 'Recording of events began on this date.';
            auditList.push(item3);
          }

        } else if (element.auditActionType == 'New') {
          if (element.auditDetails.auditObjectPrevValue == 'NA') {
            if (data.length == 1) {
              item1['auditActionType'] = 'Started'
              item1.auditDetails['auditObjectCurValue'] = element.auditDetails.auditObjectCurValue
              auditList.push(item1)
            }
            item['subTitle'] ='System modified on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item['auditActionType'] = 'Approve'
            item.auditDetails['auditObjectCurValue'] = 'Filing entity ready for reporting'
            auditList.push(item)
          } 
        }
      });
      this.auditLogs= this.groupbyMonth(auditList)
    });
  }

  onClickLastUpdatedByException(row) {
    console.log(row);
    
    let auditObjectId = row.exceptionId;
    let auditObjectType = 'Exception Report'
    
    this.fileDetail={
      "fileName": row.exceptionReportName
    }
    let auditList = []
    this.isAuditlogs = false;
    this.service.getAuditlog(auditObjectId, auditObjectType).subscribe(res => {
      res['data'].length ? this.showAuditLog = true : this.isAuditlogs = true;

      let data = res['data'].filter(item => item.auditDetails.auditObjectAttribute =='Stage')
      data.forEach((element, index) => {
        let item = this.copy(element)
        let item1 = this.copy(element)
        let item3 = this.copy(element)
        if(element.auditActionType == 'Approve') {
          
          if(index==0 && element.auditDetails.auditObjectCurValue !='NA') {
            item1['auditActionType'] = 'Started'
              auditList.push(item1)
          }
          item.auditDetails['auditObjectCurValue'] = element.auditDetails.auditObjectPrevValue
          auditList.push(item)

          if((index+1) ==data.length){
            item3['subTitle'] ='Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item3.auditDetails['auditObjectCurValue'] = 'Recording of events began on this date.';
            auditList.push(item3);
          }

        } else if (element.auditActionType == 'Unapprove') {
          if(index==0) {
            item1['auditActionType'] = 'Started'
              auditList.push(item1)
          }
          auditList.push(item)

          if((index+1) ==data.length){
            item3['auditActionType'] = 'Approve';
            item3['subTitle'] ='Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item3.auditDetails['auditObjectCurValue'] = 'Recording of events began on this date.';
            auditList.push(item3);
          }

        } else if (element.auditActionType == 'New') {
          if (element.auditDetails.auditObjectPrevValue == 'NA') {
            if (data.length == 1) {
              item1['auditActionType'] = 'Started'
              item1.auditDetails['auditObjectCurValue'] = element.auditDetails.auditObjectCurValue
              auditList.push(item1)
            }
            item['subTitle'] ='System modified on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item['auditActionType'] = 'Approve'
            item.auditDetails['auditObjectCurValue'] = 'Exception ready for reporting'
            auditList.push(item)
          } 
        }
      });
      this.auditLogs= this.groupbyMonth(auditList)
    });
  }

  groupbyMonth(data) {
    let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    var results = [];
    data.forEach(element => {
      let date = new Date(element.modifiedDateTime);
      var month = date.getMonth();
      let checkMonth = results.filter(cls => cls.duration == months[month])
      if (checkMonth.length) {
        results[results.findIndex(item => item.duration == months[month])].progress.push(element)
      } else {
        results.push({
          "duration": months[month],
          "progress": [element]
        })
      }
    });
    return results
  }

  copy(x) {
    return JSON.parse(JSON.stringify(x));
  }
}
