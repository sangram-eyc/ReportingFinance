import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { RrReportingService } from '../services/rr-reporting.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'eyc-ui-shared-component';
//import { GridComponent } from 'eyc-ui-shared-component';
import {customComparator} from '../../config/rr-config-helper';
import { Router } from '@angular/router';
import { PermissionService } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-rr-reporting',
  templateUrl: './rr-reporting.component.html',
  styleUrls: ['./rr-reporting.component.scss']
})
export class RrReportingComponent implements OnInit {

  constructor(
    private rrservice: RrReportingService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog,
    private router: Router,
    public permissions: PermissionService,
  ) { }

  tabs = 2;
  selectedRows = [];
  exceptionReportRows;
  approveFilingEntitiesModal = false;
  showToastAfterApproveFilingEntities = false;
  modalMessage:any;
  showComments = false;
  commentsData;
  commentsName;
  status = {
    stage: 'Reporting',
    progress: 'in-progress'
  };

  filingDetails: any;

  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  exceptionDefs;
  exceptionData;
  exceptionDataForFilter = [];
  exceptionDefaultColDef;
  exceptionDetailCellRendererParams;
  rowData = [];
  submitFunction;
  submitException;
  submitTest;
  exceptionModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected exception reports? This will advance them to the next reviewer.",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
      }
    }
  };

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

  
  
  ngOnInit(): void {

   this.submitFunction = this.onSubmitApproveFilingEntities.bind(this);
   this.submitException = this.onSubmitApproveExceptionReports.bind(this);
   this.submitTest = this.onSubmitTest.bind(this);
   console.log(this.filingDetails);
  }

  getExceptionReports() {
    this.rrservice.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.exceptionData = res['data'];
      this.exceptionDataForFilter = this.exceptionData;
      console.log(this.exceptionData);
      this.createEntitiesRowData();
      
    },error=>{
      this.exceptionData =[];
      console.log("Client Review error");
    });

  }

  getFilingEntities() {
    this.rrservice.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
      this.createEntitiesRowData();
    }, error => {
      this.rowData = [];
      console.log("Reporting error");
    });
  }


  createEntitiesRowData(): void {
      this.columnDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'approved',
          headerName: '',
          width: 70,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Group',
          field: 'entityGroup',
          sortable: true,
          filter: true,
          sort:'asc',
         comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Name',
          field: 'entityName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 300,
          sort:'asc',
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Resolved/Exception',
          field: 'resolve_exception',
          sortable: true,
          filter: true,
          width: 210,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Review Level',
          field: 'reviewLevel',
          sortable: true,
          filter: true,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'My Tasks',
          field: 'myTasks',
          sortable: true,
          filter: true,
          width: 140
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentTemplate,
          },
          headerName: 'Comments',
          field: 'comments',
          sortable: true,
          filter: true,
          width: 155,
        //   cellClass: params => {
        //     return params.value === '' ? '' :'comments-background';
        // }
        },
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
          width: 70,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exception Report Type',
          field: 'exceptionReportType',
          sortable: true,
          filter: true,
          sort:'asc',
         comparator: customComparator,
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
          sort:'asc',
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Resolved/Exception',
          field: 'resolveOrException',
          sortable: true,
          filter: true,
          width: 210,
        },
        {
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
        },
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
          width: 155
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
    console.log(this.filingDetails);
    if (this.tabs == 2) {
      this.modalMessage = 'Are you sure you want to approve the selected exception reports? This will move them to client review.';
      this.getFilingEntities();
    } else if (this.tabs == 1) {
      this.modalMessage = 'Are you sure you want to approve the selected exception reports? This will advance them to the next reviewer.';
      this.getExceptionReports();
    }
  }

  receiveFilingDetails(event) {
    console.log("receiveFilingDetails",event);
    
    this.filingDetails = event;
  /*   if (this.tabs == 1) {
      this.modalMessage = 'Are you sure you want to approve the selected exception reports? This will advance them to the next reviewer.';
      this.getExceptionReports();
    } */
    if (this.tabs == 2) {
      this.modalMessage = 'Are you sure you want to approve the selected exception reports? This will move them to client review.';
      this.getFilingEntities();
    }

  }

  onSubmitTest() {
    console.log('This is being called from the shared grid component');
    console.log(this);
  }

  onSubmitApproveFilingEntities() {
    const filingDetails = this.filingDetails;
    let selectedFiling = {
      "entityIds": this.selectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Reporting"
    };
    this.rrservice.approvefilingEntities(selectedFiling).subscribe(res => {
      res['data'].forEach(ele => {
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approved = true;
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
    // this.selectedRows.forEach(ele => {
    //   this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approved = true;
    // });
    // this.createEntitiesRowData();
    // this.selectedRows = [];

    // this.filingService.invokeFilingDetails();
    // this.approveFilingEntitiesModal = false;
    // this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    // setTimeout(() => {
    //   this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    // }, 5000);
  }

  onSubmitApproveExceptionReports() {
    console.log(this.exceptionReportRows);
    this.exceptionReportRows.forEach(ele => {
      this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
    });
    this.createEntitiesRowData();
  }

  exceptionReportRowsSelected(event) {
    console.log(event);
    this.exceptionReportRows = event;
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

  openComments() {
    this.commentsData = [];
    this.commentsName = this.filingDetails.filingName + ' // ' + this.filingDetails.period;
    this.rrservice.getComments('filing', 2).subscribe(res => {
      this.commentsData = res['data'];
    },error=>{
      this.commentsData =[];
      console.log("Comments error");
    });
    this.showComments = true;
  }

  routeToExceptionDetailsPage(event:any) {
    this.filingService.setExceptionData = event;
    this.router.navigate(['/view-exception-reports']);
  }
}