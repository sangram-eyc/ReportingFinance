import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ClientReviewService } from '../services/client-review.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent , PermissionService, DEFAULT_PAGE_SIZE, CellRendererTemplateComponent, customComparator } from 'eyc-ui-shared-component';
import { Router } from '@angular/router';
import { EycRrSettingsService } from './../../services/eyc-rr-settings.service';
import { DatePipe } from '@angular/common';
import { clientReviewStage, rr_module_name, tabsForRR } from '../../config/rr-config-helper';

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
  tabsData = tabsForRR;
  exportName: string;
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
  filingEntityApprovedSelectedRows = [];
  filingEntityUnaprovedSelectedRows = [];

  exceptionReportToApproveSelectedRows = [];
  exceptionReportToUnaproveSelectedRows = [];

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
  // columnDefs;
  columnDefsAgGrid;
  // exceptionDefs;
  exceptionDefsAgGrid;
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
  unapproveFilingEntities:any;
  unapproveExceptionReports:any;
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

  exceptionUnapproveModalConfig = {
    width: '500px',
    data: {
      type: "Confirmation",
      header: "Unapprove",
      description: "Are you sure you want to unapprove selected exception report(s)? This will move this back to the previous reviewer/step",
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
  
  filingUnapproveModalConfig = {
    width: '500px',
    data: {
      type: "Confirmation",
      header: "Unapprove",
      description: "Are you sure you want to unapprove selected entity? This will move this back to the previous reviewer/step",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
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
    this.unapproveFilingEntities = this.unApproveEntity.bind(this);
    this.submitException = this.onSubmitApproveExceptionReports.bind(this);
    this.unapproveExceptionReports = this.unApproveException.bind(this);
    this.pageChangeFunc = this.onPageChange.bind(this);
    sessionStorage.getItem("reportingTab") ? this.tabs = sessionStorage.getItem("reportingTab") : this.tabs = 2;
  }

  ngOnDestroy() {
    sessionStorage.removeItem("reportingTab");
    sessionStorage.removeItem("exceptionV3Stage");
  }

  resetData() {
    this.createEntitiesRowData();
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
  }

  getExceptionReports(resetData = false) {
    this.exceptionReportToApproveSelectedRows = [];
    this.exceptionReportToUnaproveSelectedRows = [];
    this.sort = resetData ? 'unresolved:false' : this.sort;
    this.exportName =   this.filingDetails.filingName + "_" + this.filingDetails.period+"_Client Review_Exception_Reports_";
    this.service.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period, 'Client review').subscribe(res => {
      this.exceptionData = res['data'];
      this.exceptionDataForFilter = this.exceptionData;
      this.totalRecords = res['totalRecords'];
      if (resetData) {
        this.resetData();
      } else {
        // const newColDefs = this.gridApi.getColumnDefs();
        // this.exceptionDefs = [];
        // this.exceptionDefsAgGrid = [];
        // this.exceptionDefs = newColDefs;
        // this.exceptionDefsAgGrid = newColDefs;
        this.exceptionRowData = [...this.exceptionData];
      }
      
    },error=>{
      this.exceptionData =[];
    });

  }

  getFilingEntities(resetData = false){
    this.filingEntityApprovedSelectedRows = [];
    this.filingEntityUnaprovedSelectedRows = [];
    this.sort = resetData ? 'entityName:true' : this.sort;
    this.exportName =   this.filingDetails.filingName + "_" + this.filingDetails.period+"_Client Review_Filing_Entities_";
    this.service.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
      this.totalRecords = res['totalRecords'];
      if (resetData) {
        this.resetData();
      } else {
        // const newColDefs = this.gridApi.getColumnDefs();
        // this.columnDefs = [];
        // this.columnDefsAgGrid = []
        // this.columnDefs = newColDefs;
        // this.columnDefsAgGrid = newColDefs;
        this.filingEntityRowData = [...this.rowData];
      }
    },error=>{
      this.rowData =[];
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
    
    // this.columnDefs = [];
    this.columnDefsAgGrid = []
    // this.exceptionDefs = [];
    this.exceptionDefsAgGrid = [];
    this.filingEntityRowData = [];
    this.exceptionRowData = [];
    setTimeout(() => {
      
      this.columnDefsAgGrid = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
          getQuickFilterText: function(params) {
            return '';
          },
          maxWidth: 120,
          sortable: false,
          menuTabs: [],
          filter:false,
          pinned: 'left',
        },
        {
          headerName: 'ID',
          field: 'fundId',
          comparator: customComparator,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 140,
        },
        {
          headerName: 'Code',
          field: 'externalEntityIdentifier',
          comparator: customComparator,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 140,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.expandEntityTemplate,
          },
          headerName: 'Entity Name',
          field: 'entityName',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 300,
          tooltipField: 'entityName'
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.unresolveFilingTemplate,
          },
          headerName: 'Unresolved',
          field: 'unResolvedException',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 155,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.resolveFilingTemplate,
          },
          headerName: 'Resolved',
          field: 'resolvedException',
          comparator: customComparator,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 155,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.commentTemplate,
          },
          headerName: 'Comments',
          field: 'commentsCount',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 155,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.lastUpdatedByTemplate,
          },
          headerName: 'Last Updated By',
          field: 'updatedBy',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 350,
        },
        {
          headerName: 'Adviser',
          field: 'filingAdvisor',
          minWidth: 180,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          headerName: 'Business Unit',
          field: 'businessUnitIdentifier',
          minWidth: 180,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          headerName: 'Review Level',
          field: 'reviewLevel',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth:155
        },
        {
          headerName: 'Filing Type',
          field: 'regulationFormType',
          minWidth: 180,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.viewFilingEntityTemplate,
          },
          maxWidth: 50
        }
      ];

      this.exceptionDefsAgGrid=  [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
          getQuickFilterText: function(params) {
            return '';
          },
          maxWidth: 120,
          sortable: false,
          menuTabs: [],
          filter:false,
          pinned: 'left',
        },
        {
          headerName: 'Exception Report Type',
          field: 'exceptionReportType',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 300,
          tooltipField: 'exceptionReportType'
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.expandExceptionTemplate,
          },
          headerName: 'Exception Report Name',
          field: 'exceptionReportName',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 300,
          tooltipField: 'exceptionReportName'
        },
        {
          headerName: 'Review Level',
          field: 'reviewLevel',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 155,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.unresolveExceptionTemplate,
          },
          headerName: 'Unresolved',
          field: 'unresolved',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 155,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.resolveExceptionTemplate,
          },
          headerName: 'Resolved',
          field: 'resolved',
          comparator: (valueA, valueB) => valueA - valueB,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 155,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.commentExceptionTemplate,
          },
          headerName: 'Comments',
          field: 'comments',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 155,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.lastUpdatedByTemplate,
          },
          headerName: 'Last Updated By',
          field: 'updateBy',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 350,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.viewDetTemplate,
          },
          maxWidth: 50
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
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
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

  receiveMessage($event) {
    this.tabs = $event;
    this.filter = '';
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
    if(this.tabs == 2){
      this.filingEntityUnaprovedSelectedRows = [];
      this.filingEntityApprovedSelectedRows = [];
      this.modalMessage = ' Are you sure you want to approve the selected entities? This will approve them for submission.';
      this.getFilingEntities(true);
    } else if (this.tabs == 1) {
      this.exceptionReportToApproveSelectedRows = [];
      this.exceptionReportToUnaproveSelectedRows = [];
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
      "currentReviewlevel": this.filingEntityApprovedSelectedRows.map(({ reviewLevel }) => reviewLevel)[0],
      "entityIds": this.filingEntityApprovedSelectedRows.map(({ entityId }) => entityId),
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
      this.filingEntityApprovedSelectedRows = [];
      this.filingEntityUnaprovedSelectedRows = [];
      this.filingService.invokeFilingDetails();
      this.approveFilingEntitiesModal = false;
      this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
      setTimeout(() => {
        this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
      }, 5000);
    }, error => {
      this.filingEntityApprovedSelectedRows = [];
      this.filingEntityUnaprovedSelectedRows = [];
    });
  }

  onSubmitApproveExceptionReports() {
    const filingDetails = this.filingDetails;
    let selectedFiling = {
      "exceptionReportIds": this.exceptionReportToApproveSelectedRows.map(({ exceptionId }) => exceptionId),
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
      });
      this.createEntitiesRowData();
      this.exceptionReportToApproveSelectedRows = [];
      this.exceptionReportToUnaproveSelectedRows = [];
      this.filingService.invokeFilingDetails();
      this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
      this.getExceptionReports();
      setTimeout(() => {
        this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
      }, 5000);
    }, error => {
      this.exceptionReportToApproveSelectedRows = [];
      this.exceptionReportToUnaproveSelectedRows = [];
    });
  }

  exceptionReportRowsSelected(event) {
    this.selectedRows = event;
    this.exceptionReportToApproveSelectedRows = this.selectedRows.filter(item => item.approved === false)
    this.exceptionReportToUnaproveSelectedRows = this.selectedRows.filter(item => item.approved === true)
  }

  filingEnitiesRowsSelected(event) {
    this.selectedRows = event;
    this.filingEntityApprovedSelectedRows = this.selectedRows.filter(item => item.approved === false);
    this.filingEntityUnaprovedSelectedRows = this.selectedRows.filter(item => item.approved === true);
  }

  addComment(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.entityId,
        entityType: "Filing Entity",
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
      if(result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        this.rowData[this.rowData.findIndex(item => item.entityId === row.entityId)].commentsCount = 1;
        this.createEntitiesRowData();
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
        entityType: "Answer Data Exception Report",
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
      if(result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === row.exceptionId)].comments = 1;
        this.createEntitiesRowData();
      } 
    });
  }

  onClickMyTask(event){
    if(event){
      this.exceptionData = this.exceptionDataForFilter.filter(item => item.mytask ==true);
    } else {
      this.exceptionData = this.exceptionDataForFilter
    }
  }


  openComments(row) {
     this.commentsName = this.filingDetails.filingName + ' // ' + this.filingDetails.period;
     if (this.tabs == 2) {
      this.commentEntityType = 'Filing Entity';
      this.entityId = row.entityId;
     } else {
      this.commentEntityType = 'Answer Data Exception Report'
      this.entityId = row.exceptionId;
     }
     this.showComments = true;
  }

actionMenuEnableforException(row) {
    this.selectedExceptionId = row.exceptionId;
  setTimeout(() => {
    this.actionMenuModalEnabled = true;
    this.actionMenuModal = true;
  }, 1);
}

  unApproveEntity() {
    const filingDetails = this.filingDetails;
    let selectedFiling = {
      "currentReviewlevel": this.filingEntityUnaprovedSelectedRows.map(({ reviewLevel }) => reviewLevel)[0],
      "entityType": "Filing Entity",
      "entities": this.filingEntityUnaprovedSelectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Client review"
    };

    let tempRowData = this.rowData;
    this.rowData = [];
    this.service.unApprovefilingEntities(selectedFiling).subscribe(res => {
      res['data'].forEach(ele => {
        tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].approved = false;
        tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].reviewLevel = ele.reviewLevel;
        tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].updatedBy = ele.updatedBy;
      });
      this.rowData = tempRowData;
      this.createEntitiesRowData();
      this.selectedRows = [];
      this.filingEntityApprovedSelectedRows = [];
      this.filingEntityUnaprovedSelectedRows = [];
      this.filingService.invokeFilingDetails();
      this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
      setTimeout(() => {
        this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
      }, 5000);
    }, error => {
      this.rowData = tempRowData;
      this.filingEntityApprovedSelectedRows = [];
      this.filingEntityUnaprovedSelectedRows = [];
      this.createEntitiesRowData();
    });
  }

  unApproveException(){
    this.selectedExceptionIds = [];
    this.selectedExceptionIds.push(this.selectedExceptionId);
    let selectedFiling = {
      "entityType": "Answer Exception Report",
      "entities":  this.exceptionReportToUnaproveSelectedRows.map(({ exceptionId }) => exceptionId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": clientReviewStage
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
      this.exceptionReportToUnaproveSelectedRows = [];
      this.exceptionReportToApproveSelectedRows = [];
      this.filingService.invokeFilingDetails();
      this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
      this.getExceptionReports();
      setTimeout(() => {
        this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
      }, 5000);
    },error=>{
      this.exceptionReportToUnaproveSelectedRows = [];
      this.exceptionReportToApproveSelectedRows = [];
      this.exceptionData = tempRowData;
      this.createEntitiesRowData();
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
    this.router.navigate(['/view-exception-reports'],{ state: { componentStage: clientReviewStage }});
  }

  routeToFilingEntityExceptionPage(event:any) {
    this.filingService.setFilingEntityData = event;
    this.router.navigate(['/view-filing-entity-exception'],{ state: { componentStage: clientReviewStage }});
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
        this.exportHeaders = 'exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,comments:Comments,updateBy:Last Updated By';
      } else {
        this.exportHeaders = 'exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,updateBy:Last Updated By';
      }
      this.exportURL =  this.settingsService.regReportingFiling.rr_exception_reports + "filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period + "&stage=Client review" + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    }

    this.service.exportCRData(this.exportURL).subscribe(resp => {
    })
    
  }

  onClickLastUpdatedByEntity(row) {
 
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
          
          if((index==0 && element.auditDetails.auditObjectCurValue !='NA') && (index==0 && element.auditDetails.auditObjectCurValue !='Not Applicable')) {
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
          if (element.auditDetails.auditObjectPrevValue == 'NA' || 'Not Applicable') {
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
          
          if((index==0 && element.auditDetails.auditObjectCurValue !='NA') && (index==0 && element.auditDetails.auditObjectCurValue !='Not Applicable')) {
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
          if (element.auditDetails.auditObjectPrevValue == 'NA' || 'Not Applicable') {
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
