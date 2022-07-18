import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { RrReportingService } from '../services/rr-reporting.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent, DEFAULT_PAGE_SIZE, ErrorModalComponent, CellRendererTemplateComponent } from 'eyc-ui-shared-component';
import { customComparator, rr_module_name, tabsForRR } from '../../config/rr-config-helper';
import { Router } from '@angular/router';
import { PermissionService } from 'eyc-ui-shared-component';
import { EycRrSettingsService } from './../../services/eyc-rr-settings.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-rr-reporting',
  templateUrl: './rr-reporting.component.html',
  styleUrls: ['./rr-reporting.component.scss']
})
export class RrReportingComponent implements OnInit, OnDestroy {
  exportName: string;


  constructor(
    private rrservice: RrReportingService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog,
    private router: Router,
    public permissions: PermissionService,
    private settingsService: EycRrSettingsService,
    public datepipe: DatePipe
  ) { }

  moduleOriginated = rr_module_name;
  tabsData = tabsForRR;
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
  exceptionReportRows;
  approveFilingEntitiesModal = false;
  actionMenuModal = false;
  actionMenuModalEnabled = false;
  showToastAfterApproveFilingEntities = false;
  showToastAfterApproveExceptionReports = false;
  showToastAfterUnApproveFilings = false;
  modalMessage: any;
  showComments = false;
  commentsData;
  commentsName;
  commentEntityType;
  sort = '';
  status = {
    stage: 'Reporting',
    progress: 'in-progress'
  };

  filingDetails: any;
  currentEntityReviewLevel;
  submitEntities: any;
  unapproveFilingEntities: any;
  unapproveExceptionReports: any;
  selectedEntityId;
  selectedExceptionId;
  @ViewChild('actionMenuTemp', { static: false }) actionMenuCard: ElementRef;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnApi;
  columnDefs;
  exceptionDefs;
  exceptionDefsAgGrid;
  exceptionData;
  exceptionDataForFilter = [];
  exceptionDefaultColDef;
  exceptionDetailCellRendererParams;
  rowData = [];
  filingEntityRowData = [];
  exceptionRowData = [];
  submitFunction;
  submitException;
  pageChangeFunc;
  currentPage = 0;
  totalRecords = 5;
  pageSize = DEFAULT_PAGE_SIZE;
  filter = '';
  exceptionModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected exception report(s)? This will advance them to the next reviewer.",
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

  filingModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected entities? This will move them to client review.",
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
  myTasksExceptionTemplate: TemplateRef<any>;
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
    this.unapproveExceptionReports = this.unApproveException.bind(this);
    this.unapproveFilingEntities = this.unApproveEntity.bind(this);
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
    this.exportName =   this.filingDetails.filingName + "_" + this.filingDetails.period+"_Reporting_Exception_Reports_";
    this.rrservice.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period, 'Reporting').subscribe(res => {
      this.exceptionData = res['data'];
      this.exceptionDataForFilter = this.exceptionData;
      this.totalRecords = res['totalRecords'];
      if (resetData) {
        this.resetData();
      } else {
        // const newColDefs = this.gridApi.getColumnDefs();
        // this.exceptionDefs = [];
        // this.exceptionDefsAgGrid = []
        // this.exceptionDefs = newColDefs;
        // this.exceptionDefsAgGrid = newColDefs;
        this.exceptionRowData = [...this.exceptionData];
      }
    }, error => {
      this.exceptionData = [];
    });

  }

  getFilingEntities(resetData = false) {
    this.exportName =   this.filingDetails.filingName + "_" + this.filingDetails.period+"_Reporting_Filing_Entities_";
    this.filingEntityApprovedSelectedRows = [];
    this.filingEntityUnaprovedSelectedRows = [];
    this.rrservice.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
      this.totalRecords = res['totalRecords'];
      if (resetData) {
        this.resetData();
      } else {
        // const newColDefs = this.gridApi.getColumnDefs();
        // this.columnDefs = [];
        // this.columnDefs = newColDefs;
        this.filingEntityRowData = [...this.rowData];
      }
    }, error => {
      this.rowData = [];
    });
  }

  checkFilingCompletedStatus() {
    return this.filingService.checkFilingCompletedStatus(this.filingDetails);
  }

  createEntitiesRowData(): void {
    this.columnDefs = [];
    this.exceptionDefs = [];
    this.exceptionDefsAgGrid = []
    this.filingEntityRowData = [];
    this.exceptionRowData = [];
    setTimeout(() => {
      this.columnDefs = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
          maxWidth: 120,
          sortable: false,
          menuTabs: [],
          filter:false,
          pinned: 'left',
          },
          {
            headerName: 'ID',
            field: 'fundId',
            minWidth: 140,
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
            ngTemplate: this.expandEntityTemplate,
          },
          headerName: 'Entity Name',
          field: 'entityName',
          minWidth: 250,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          tooltipField: 'entityName',
        },
        {
          headerName: 'Review Level',
          field: 'reviewLevel',
          minWidth: 180,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset'],
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.unresolveFilingTemplate,
          },
          headerName: 'Unresolved',
          field: 'unResolvedException',
          minWidth: 150,
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
            ngTemplate: this.resolveFilingTemplate,
          },
          headerName: 'Resolved',
          field: 'resolvedException',
          minWidth: 150,
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
            ngTemplate: this.commentTemplate,
          },
          headerName: 'Comments',
          field: 'commentsCount',
          minWidth: 150,
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
            ngTemplate: this.lastUpdatedByTemplate,
          },
          headerName: 'Last Updated By',
          field: 'updatedBy',
          minWidth: 350,
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


      this.exceptionDefsAgGrid = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
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
          tooltipField: 'exceptionReportType',
          minWidth: 300
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
          tooltipField: 'exceptionReportName',
          minWidth: 300,
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
          minWidth: 150,
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
          minWidth: 150,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.resolveExceptionTemplate,
          },
          headerName: 'Resolved',
          field: 'resolved',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 150,
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
          minWidth: 150,
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: {
            ngTemplate: this.lastUpdatedByTemplate,
          },
          headerName: 'Last Updated By',
          field: 'updateBy',
          minWidth: 350,
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
            ngTemplate: this.viewDetTemplate,
          },
          maxWidth: 50,
        }
      ];

      this.filingEntityRowData = this.rowData;
      this.exceptionRowData = this.exceptionData;
    }, 1);
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approved === false);
      return thisIsFirstColumn;
    } else {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && !(this.rowData.every(item => item.approved === true));
      return thisIsFirstColumn;
    }
  }

  handleGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  onRowSelected(event: any): void {
    let selectedArr = [];
    selectedArr = this.gridApi.getSelectedRows();
    this.selectedRows = selectedArr.filter(item => item.approved === false);
    if (this.selectedRows.length === 0) {
      this.gridApi.deselectAll();
    }
    if (this.selectedRows.length === (this.rowData.filter(item => item.approved === false)).length) {
      this.gridApi.selectAll();
    }
  }

  receiveMessage($event) {
    this.tabs = $event;
    this.filter = '';
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
    if (this.tabs == 2) {
      this.filingEntityUnaprovedSelectedRows = [];
      this.filingEntityApprovedSelectedRows = [];
      this.modalMessage = 'Are you sure you want to approve the selected exception report(s)? This will move them to client review.';
      this.getFilingEntities(true);
    } else if (this.tabs == 1) {
      this.exceptionReportToApproveSelectedRows = [];
      this.exceptionReportToUnaproveSelectedRows = [];
      this.modalMessage = 'Are you sure you want to approve the selected exception report(s)? This will advance them to the next reviewer.';
      this.getExceptionReports(true);
    }
  }

  receiveFilingDetails(event) {
    this.filingDetails = event;
    if (this.tabs == 1) {
      this.modalMessage = 'Are you sure you want to approve the selected exception reports? This will advance them to the next reviewer.';
      this.getExceptionReports(true);
    }
    if (this.tabs == 2) {
      this.modalMessage = 'Are you sure you want to approve the selected exception reports? This will move them to client review.';
      this.getFilingEntities(true);
    }

  }

  onSubmitApproveFilingEntities() {
    const filingDetails = this.filingDetails;
    let selectedFiling = {
      // "currentReviewlevel": this.selectedRows.map(({ reviewLevel }) => reviewLevel),
      "currentReviewlevel": this.filingEntityApprovedSelectedRows.map(({ reviewLevel }) => reviewLevel)[0],
      "entityIds": this.filingEntityApprovedSelectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Reporting"
    };
    this.rrservice.approvefilingEntities(selectedFiling).subscribe(res => {
      res['data'].forEach(ele => {
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approved = true;
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].updatedBy = ele.updatedBy;
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].reviewLevel = ele.reviewLevel;
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

  onSubmitApproveExceptionReports() {
    const filingDetails = this.filingDetails;
    let selectedFiling = {
      "exceptionReportIds": this.exceptionReportToApproveSelectedRows.map(({ exceptionId }) => exceptionId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Reporting"
    };
    this.rrservice.approveAnswerExceptions(selectedFiling).subscribe(res => {
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
            data: [
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
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
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Submit") {
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
            data: [
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
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
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Submit") {
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

  onClickMyTask(event) {
    if (event) {
      this.exceptionData = this.exceptionDataForFilter.filter(item => item.mytask == true);
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

 

  unApproveEntity() {

    const filingDetails = this.filingDetails;
    let selectedFiling = {
      "currentReviewlevel": this.filingEntityUnaprovedSelectedRows.map(({ reviewLevel }) => reviewLevel)[0],
      "entityType": "Filing Entity",
      "entities": this.filingEntityUnaprovedSelectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Reporting"
    };

    let tempRowData = this.rowData;
    this.rowData = [];
    this.rrservice.unApprovefilingEntities(selectedFiling).subscribe(res => {
      res['data'].forEach(ele => {
        tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].approved = false;
        tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].reviewLevel = ele.reviewLevel;
        tempRowData[tempRowData.findIndex(item => item.entityId === ele.entityId)].updatedBy = ele.updatedBy;
      });
      if(res['error']) {
        const dialogRef = this.dialog.open(ErrorModalComponent, {
          width: '600px',
          data: {
            header: "Oops...",
            description: res['error']['message'],
            showClose:true,
            footer: {
              style: "start",
              YesButton: "OK"
            },
          }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
      this.rowData = tempRowData;
      this.createEntitiesRowData();
      this.selectedRows = [];
      this.filingEntityApprovedSelectedRows = [];
      this.filingEntityUnaprovedSelectedRows = [];
      this.filingService.invokeFilingDetails();
      if(res['data'] && res['data'].length) {
        this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
        setTimeout(() => {
          this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
        }, 5000);  
      }
    }, error => {
      this.rowData = tempRowData;
      this.filingEntityApprovedSelectedRows = [];
      this.filingEntityUnaprovedSelectedRows = [];
      this.createEntitiesRowData();
    });


  }

  unApproveException() {
    let selectedFiling = {
      "entityType": "Answer Exception Report",
      "entities": this.exceptionReportToUnaproveSelectedRows.map(({ exceptionId }) => exceptionId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Reporting"
    };

    let tempRowData = this.exceptionData;
    this.exceptionData = [];
    this.rrservice.unApproveAnswerExceptions(selectedFiling).subscribe(res => {
      res['data'].forEach(ele => {
        tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].approved = false;
        tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].updateBy = ele.updatedBy;
        tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].resolved = ele.resolved;
        tempRowData[tempRowData.findIndex(item => item.exceptionId === ele.entityId)].unresolved = ele.unresolved;
      });
      if(res['error']) {
        const dialogRef = this.dialog.open(ErrorModalComponent, {
          width: '600px',
          data: {
            header: "Oops...",
            description: res['error']['message'],
            showClose:true,
            footer: {
              style: "start",
              YesButton: "OK"
            },
          }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
      this.exceptionData = tempRowData;
      this.createEntitiesRowData();
      this.exceptionReportToUnaproveSelectedRows = [];
      this.exceptionReportToApproveSelectedRows = [];
      this.filingService.invokeFilingDetails();
      this.getExceptionReports();
      if (res['data'] && res['data'].length) {
        this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
        setTimeout(() => {
          this.showToastAfterUnApproveFilings = !this.showToastAfterUnApproveFilings;
        }, 5000);
      }
    }, error => {
      this.exceptionReportToUnaproveSelectedRows = [];
      this.exceptionReportToApproveSelectedRows = [];
      this.exceptionData = tempRowData;
      this.createEntitiesRowData();
    });

  }

  commentAdded() {
    if (this.tabs == 2) {
      this.getFilingEntities();
    } else {
      this.getExceptionReports();
    }
  }

  routeToExceptionDetailsPage(event: any) {
    this.filingService.setExceptionData = event;
    this.router.navigate(['/view-exception-reports'], { state: { componentStage: 'Reporting' } });
  }

  routeToFilingEntityExceptionPage(event: any) {
    this.filingService.setFilingEntityData = event;
    this.router.navigate(['/view-filing-entity-exception'], { state: { componentStage: 'Reporting' } });
  }

  @HostListener('document:click', ['$event'])
  public outsideClick(event) {
    if (this.actionMenuCard && !this.actionMenuCard.nativeElement.contains(event.target) && this.actionMenuModalEnabled) {
      this.actionMenuModal = false;
      this.actionMenuModalEnabled = false;
    }
  }

  exportData(type) {
    if (type == 'entities') {
      if (this.permissions.validatePermission('Reporting', 'View Comments')) {
        this.exportHeaders = 'fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,commentsCount:Comments,updatedBy:Last Updated By';
      } else {
        this.exportHeaders = 'fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,updatedBy:Last Updated By';
      }
      this.exportURL = this.settingsService.regReportingFiling.rr_filing_entities + "&filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period + "&export=" + true + "&headers=" + this.exportHeaders + "&reportType=csv";
    } else {
      if (this.permissions.validatePermission('Reporting', 'View Comments')) {
        this.exportHeaders = 'exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,comments:Comments,updateBy:Last Updated By';
      } else {
        this.exportHeaders = 'exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,updateBy:Last Updated By';
      }
      this.exportURL = this.settingsService.regReportingFiling.rr_exception_reports + "&filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period + "&stage=Reporting" + "&export=" + true + "&headers=" + this.exportHeaders + "&reportType=csv";
    }
    this.rrservice.exportRRData(this.exportURL).subscribe(resp => {
    })

  }

  onClickLastUpdatedByEntity(row) {
    let auditObjectId = row.entityId;
    let auditObjectType = 'Filing Entity'

    this.fileDetail = {
      "fileName": row.entityName
    }
    let auditList = []
    this.isAuditlogs = false;
    this.rrservice.getAuditlog(auditObjectId, auditObjectType).subscribe(res => {
      res['data'].length ? this.showAuditLog = true : this.isAuditlogs = true;

      let data = res['data'].filter(item => item.auditDetails.auditObjectAttribute == 'Stage')
      data.forEach((element, index) => {
        let item = this.copy(element)
        let item1 = this.copy(element)
        let item3 = this.copy(element)
        if (element.auditActionType == 'Approve') {

          if ((index == 0 && element.auditDetails.auditObjectCurValue != 'NA') && (index == 0 && element.auditDetails.auditObjectCurValue != 'Not Applicable')) {
            item1['auditActionType'] = 'Started'
            auditList.push(item1)
          }
          item.auditDetails['auditObjectCurValue'] = element.auditDetails.auditObjectPrevValue
          auditList.push(item)
          if ((index + 1) == data.length) {
            item3['subTitle'] = 'Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item3.auditDetails['auditObjectCurValue'] = 'Recording of events began on this date.';
            auditList.push(item3);
          }
        } else if (element.auditActionType == 'Unapprove') {
          if (index == 0) {
            item1['auditActionType'] = 'Started'
            auditList.push(item1)
          }
          auditList.push(item)
          if ((index + 1) == data.length) {
            item3['auditActionType'] = 'Approve';
            item3['subTitle'] = 'Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
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
            item['subTitle'] = 'System modified on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item['auditActionType'] = 'Approve'
            item.auditDetails['auditObjectCurValue'] = 'Filing entity ready for reporting'
            auditList.push(item)
          }
        }
      });
      this.auditLogs = this.groupbyMonth(auditList)
    });
  }

  onClickLastUpdatedByException(row) {
    let auditObjectId = row.exceptionId;
    let auditObjectType = 'Exception Report'

    this.fileDetail = {
      "fileName": row.exceptionReportName
    }
    let auditList = []
    this.isAuditlogs = false;
    this.rrservice.getAuditlog(auditObjectId, auditObjectType).subscribe(res => {
      res['data'].length ? this.showAuditLog = true : this.isAuditlogs = true;

      let data = res['data'].filter(item => item.auditDetails.auditObjectAttribute == 'Stage')
      data.forEach((element, index) => {
        let item = this.copy(element)
        let item1 = this.copy(element)
        let item3 = this.copy(element)
        if (element.auditActionType == 'Approve') {

          if ((index == 0 && element.auditDetails.auditObjectCurValue != 'NA') && (index == 0 && element.auditDetails.auditObjectCurValue != 'Not Applicable')) {
            item1['auditActionType'] = 'Started'
            auditList.push(item1)
          }
          item.auditDetails['auditObjectCurValue'] = element.auditDetails.auditObjectPrevValue
          auditList.push(item)

          if ((index + 1) == data.length) {
            item3['subTitle'] = 'Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item3.auditDetails['auditObjectCurValue'] = 'Recording of events began on this date.';
            auditList.push(item3);
          }
        } else if (element.auditActionType == 'Unapprove') {
          if (index == 0) {
            item1['auditActionType'] = 'Started'
            auditList.push(item1)
          }
          auditList.push(item)

          if ((index + 1) == data.length) {
            item3['auditActionType'] = 'Approve';
            item3['subTitle'] = 'Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
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
            item['subTitle'] = 'System modified on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            item['auditActionType'] = 'Approve'
            item.auditDetails['auditObjectCurValue'] = 'Exception ready for reporting'
            auditList.push(item)
          }
        }
      });
      this.auditLogs = this.groupbyMonth(auditList)
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