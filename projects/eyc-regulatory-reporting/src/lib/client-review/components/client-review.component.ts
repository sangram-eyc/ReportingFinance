import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ClientReviewService } from '../services/client-review.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent , PermissionService } from 'eyc-ui-shared-component';
import { Router } from '@angular/router';

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
  constructor(
    private service: ClientReviewService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog,
    private router: Router,
    public permissions: PermissionService
    ) { }

  tabs;
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
  submitFunction;
  submitException;
  submitEntities;
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

  ngOnInit(): void {
    this.submitEntities = this.onSubmitApproveFilingEntities.bind(this);
    this.submitException = this.onSubmitApproveExceptionReports.bind(this);
    sessionStorage.getItem("reportingTab") ? this.tabs = sessionStorage.getItem("reportingTab") : this.tabs = 2;

  }

  ngOnDestroy() {
    sessionStorage.removeItem("reportingTab");
  }

  getExceptionReports() {
    this.service.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period, 'Client review').subscribe(res => {
      this.exceptionData = res['data'];
      this.exceptionDataForFilter = this.exceptionData;
      console.log(this.exceptionData);
      this.createEntitiesRowData();
      
    },error=>{
      this.exceptionData =[];
      console.log("Client Review error");
    });

  }

  getFilingEntities(){
    this.service.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
      this.createEntitiesRowData();
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

  createEntitiesRowData(): void {
    const customComparator = (valueA, valueB) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    };
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
          cellClass: 'actions-button-cell'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'ID',
          field: 'fundId',
          sortable: true,
          filter: true,
          width: 140,
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
          field: 'resolveException',
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
          field: 'comments',
          sortable: true,
          filter: true,
          width: 155,
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
          cellClass: 'actions-button-cell'
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

  handleGridReady(params) {
    this.gridApi = params.api;
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
    if(this.tabs == 2){
      this.modalMessage = ' Are you sure you want to approve the selected entities? This will approve them for submission.';
      this.getFilingEntities();
    } else if (this.tabs == 1) {
      this.modalMessage = 'Are you sure you want to approve these exception reports?';
      this.getExceptionReports();
    }
  }
  

  receiveFilingDetails(event) {
    this.filingDetails = event;
    // this.getFilingEntities();
    if (this.tabs == 2) {
      this.getFilingEntities();
    }
    if (this.tabs == 1) {
      this.getExceptionReports();
    }
  }

  onSubmitApproveFilingEntities() {
    let selectedFiling = {
      "entityIds": this.selectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Client review"
    };
    this.service.approvefilingEntities(selectedFiling).subscribe(res => {
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
    console.log('Client Review > unapprove > entity');
    this.selectedEntityId = row.entityId;
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
    this.router.navigate(['/view-exception-reports']);
  }

  @HostListener('document:click', ['$event'])
  public outsideClick(event) {
    if( this.actionMenuCard && !this.actionMenuCard.nativeElement.contains(event.target) && this.actionMenuModalEnabled){
      this.actionMenuModal = false;
      this.actionMenuModalEnabled = false;
    }
  }
}
