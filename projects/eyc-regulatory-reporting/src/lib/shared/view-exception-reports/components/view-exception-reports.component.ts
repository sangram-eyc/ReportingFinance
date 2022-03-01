import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RegulatoryReportingFilingService } from './../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from './../../table-header-renderer/table-header-renderer.component';
import { ViewExceptionReportsService } from './../services/view-exception-reports.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalComponent, PermissionService, ResolveModalComponent } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'lib-view-exception-reports',
  templateUrl: './view-exception-reports.component.html',
  styleUrls: ['./view-exception-reports.component.scss']
})
export class ViewExceptionReportsComponent implements OnInit {

  dueDate;
  filingId;
  period;
  filingName;
  exceptionReportName;
  stage;

  gridApi;
  exceptionAnswersDefs;
  exceptionAnswersData;
  dataIntakeData;
  parentModule;
  commentsCount;
  exportsHeader;

  showComments = false;
  commentsData;
  commentsName;
  commentEntityType;
  entityId;
  exceptionCnt = '';
  enableResolveButton: boolean;
  enableUnresolveButton: boolean;
  exceptionResolveRows = []
  exceptionDetailCellRendererParams;
  count = 0;
  dataIntakeExceptionsTable: boolean;
  answerExceptionTable: boolean

  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>;
  @ViewChild('exceptionResultTemplate')
  exceptionResultTemplate: TemplateRef<any>;
  @ViewChild('actionResolvedTemplate')
  actionResolvedTemplate: TemplateRef<any>;
  componentStage;
  filingDetails;
  constructor(
    private filingService: RegulatoryReportingFilingService,
    private viewService: ViewExceptionReportsService,
    private router: Router,
    private location: Location,
    public dialog: MatDialog,
    public permissions: PermissionService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      this.componentStage = navigation.extras.state.componentStage
      const state = navigation.extras.state as { dataIntakeData: string };
      this.dataIntakeData = state.dataIntakeData;
    }
  }

  ngOnInit(): void {
    if (this.dataIntakeData) {
      console.log('Date Intake Module', this.dataIntakeData);
      this.exceptionReportName = this.dataIntakeData.exceptionReportName;
      this.filingId = this.dataIntakeData.filingId;
      this.dueDate = this.dataIntakeData.dueDate;
      this.filingName = this.dataIntakeData.filingName;
      this.parentModule = this.dataIntakeData.parentModule;
      if (this.parentModule === 'Regulatory Reporting') {
        this.period = this.dataIntakeData.period;
        // this.formatDate();
      }
      this.stage = 'intake';
    }
    else if (this.filingService.getFilingData) {
      this.filingDetails = this.filingService.getFilingData;
      this.dueDate = this.filingService.getFilingData.dueDate;
      // this.formatDate();
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
      this.filingId = this.filingService.getFilingData.filingId;
      if (this.filingService.getExceptionData.resolveOrException && this.filingService.getExceptionData.resolveOrException.indexOf("/") !== -1) {
        let exceptionVal = this.filingService.getExceptionData.resolveOrException.split("/");
        this.exceptionCnt = exceptionVal[1];
      }
      this.exceptionReportName = this.filingService.getExceptionData.exceptionReportName;
      this.parentModule = 'Regulatory Reporting';
      this.stage = 'reporting'
      sessionStorage.setItem("reportingTab", '1');
    }
    if (this.dataIntakeData) {
      this.getExceptionResults();
      this.dataIntakeExceptionsTable = true;
    } else {
      this.getAnswerExceptionReports();
      this.answerExceptionTable = true;
    }
  }

  sortByUnresolvedException(){
    this.exceptionAnswersData.sort((a, b) => a.Status > b.Status ? -1 : (a.Status < b.Status ? 1 : 0))
  }
  getAnswerExceptionReports() {
    this.viewService.getAnswerExceptionReports(this.filingName, this.period, this.filingService.getExceptionData.exceptionId, this.exceptionCnt).subscribe(res => {
      this.exceptionAnswersData = res.data['exceptionResultJason'];
      this.exceptionAnswersData ? this.exceptionAnswersData.map(e => {
        e.Status == "Resolved" || e.Status == "Unresolved" ? e.approved = false : e.approved = true
        return;
      }) : '';
      this.sortByUnresolvedException()
      this.commentsCount = res.data['commentCountMap'];
      this.createEntitiesRowData();
    });
  }

  getExceptionResults() {
    this.viewService.getExceptionResults(this.dataIntakeData.ruleExceptionId).subscribe(res => {
      this.exceptionAnswersData = res.data;
      this.createDataIntakeExceptionsRowData();
    });
  }

  createDataIntakeExceptionsRowData() {
    this.exceptionAnswersDefs = [];
    for (const property in this.exceptionAnswersData[0]) {
      console.log(`${property}: ${this.exceptionAnswersData[0][property]}`);
      this.exceptionAnswersDefs.push({
        field: `${property}`,
        headerName: `${property}`,
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      });
    }
  }
  createEntitiesRowData(): void {
    this.exceptionAnswersDefs = [];

    this.exceptionAnswersDefs.push(
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
        pinned: 'left'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.exceptionResultTemplate,
        },
        headerName: 'Result',
        field: 'Status',
        minWidth: 70,
        width: 70,
        sortable: false,
        cellClass: 'actions-button-cell'
      },
      {
        field: 'AuditResultObjectID',
        headerName: 'AuditResultObjectID',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Entity Name',
        headerName: 'Entity Name',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Entity ID',
        headerName: 'Entity ID',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Report Date (Current)',
        headerName: 'Report Date (Current)',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: "Report Date (Previous)",
        headerName: "Report Date (Previous)",
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Context',
        headerName: 'Context',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Context Desc',
        headerName: 'Context Desc',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Field',
        headerName: 'Field',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Value (Current)',
        headerName: 'Value (Current)',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Value (Previous)',
        headerName: 'Value (Previous)',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Diff',
        headerName: 'Diff',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Diff Pct',
        headerName: 'Diff Pct',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Status',
        headerName: 'Status',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
      {
        field: 'Last Modified By',
        headerName: 'Last Modified By',
        headerComponentFramework: TableHeaderRendererComponent,
        sortable: true,
        autoHeight: true,
        width: 320,
        wrapText: true,
        filter: true
      },
    );

    // for (const property in this.exceptionAnswersData[0]) {
    //   console.log(`${property}: ${this.exceptionAnswersData[0][property]}`);
    //   this.exceptionAnswersDefs.push({
    //     field: `${property}`,
    //     headerName: `${property}`,
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     sortable: true,
    //     autoHeight: true,
    //     width: 320,
    //     wrapText: true,
    //     filter: true
    //   });
    // }
    this.exceptionAnswersDefs.push({
      headerName: 'Comments',
      headerComponentFramework: TableHeaderRendererComponent,
      cellRendererFramework: MotifTableCellRendererComponent,
      cellRendererParams: {
        ngTemplate: this.commentExceptionTemplate,
      }, sortable: false, autoHeight: true,
      wrapText: true
    });
  }


  formatDate() {
    const due = new Date(this.dueDate);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    this.dueDate = newdate;
  }

  redirecttoDataExplorer(event) {
    console.log('Data explorer');
  }
  backtoParent(stage) {
    this.count++;
    if (this.count == 1) {
      stage == 'intake' ? sessionStorage.setItem("enableTabsIntake", 'yes') : '';
      this.location.back();
    }
  }

  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.AuditResultObjectID,
        entityType: "ANSWER_EXCEPTION",
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
        this.commentsCount[row.AuditResultObjectID] = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  openComments(row) {
    this.commentsName = this.filingName + ' // ' + this.period;
    this.commentEntityType = 'ANSWER_EXCEPTION'
    this.entityId = row.AuditResultObjectID;
    this.showComments = true;
    console.log(this.entityId);
  }

  commentAdded() {
    this.getAnswerExceptionReports();
  }

  onClickMyTask(e) { }

  getResolveButtonPermission() {
    if (!this.exceptionAnswersData && !this.permissions.validatePermission(this.componentStage, 'Exception Status Change Resolve') &&
      (this.filingDetails.status[4].progress === null || this.filingDetails.status[4].progress === 'COMPLETED' || this.filingDetails.status[4].progress === 'Completed')) {
      return false
    } else return true;
  }

  getUnresolveButtonPermission() {
    if (!this.exceptionAnswersData && !this.permissions.validatePermission(this.componentStage, 'Exception unapproved') &&
      (this.filingDetails.status[4].progress === null || this.filingDetails.status[4].progress === 'COMPLETED' || this.filingDetails.status[4].progress === 'Completed')) {
      return false
    } else return true;
  }

  exceptionResolveRowsSelected(e) {
    this.exceptionResolveRows = [...e];
    let rowsArr = [...this.exceptionResolveRows]
    if (rowsArr.length > 0) {
      this.enableResolveButton = true;
      this.enableUnresolveButton = true;
      this.enableResolveButton = rowsArr.some((el) => el.Status == 'Unresolved'
      );
      this.enableUnresolveButton = rowsArr.some((el) => el.Status == 'Resolved'
      );
    } else {
      this.resetResolveUnresolveButtons()
    }
  }

  resetResolveUnresolveButtons() {
    this.enableResolveButton = false;
    this.enableUnresolveButton = false;
  }

  removeElementFromDataList(dataArr: any, prop: string) {
    dataArr.forEach((el) => {
      return delete el[prop]
    });
  }

  getEnitityIds(status: string) {
    let resultArr = this.exceptionResolveRows.filter((el) => {
      return el.Status == status
    })
    return resultArr.map(e => e.AuditResultObjectID);
  }
  actionResolvedClick(row) {
    const dialogRef = this.dialog.open(ResolveModalComponent, {
      width: '843px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Resolve selected",
        description: `<p>Are you sure you want to resolve the selected exception? If yes, you will need to add a general comment for this action. Please note, this will move these items to production review.</p><br><p><b style="font-weight: 800;">Note:</b> Resolved exceptions will be noted with this icon <svg style="display: inline;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 6H14V8H2V6ZM2 10H14V12H2V10ZM2 16H10V14H2V16ZM23 13L21.5 11.5L16.01 17L13 14L11.5 15.5L16.01 20L23 13Z" fill="#168736"/></svg> When clicked you can view resolution comments.</p>`,
        entityType: "ANSWER_EXCEPTION",
        entityId: this.getEnitityIds('Unresolved'),
        filingName: this.filingName,
        period: this.period,
        stage: this.stage,
        exceptionId: this.filingService.getExceptionData.exceptionId,
        statusTo: 'RESOLVE',
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
          YesButton: "Confirm",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Confirm") {
        let entityIds = this.getEnitityIds('Unresolved');
        entityIds.map((e) => {
          this.commentsCount[e] ? this.commentsCount[e] += 1 : this.commentsCount[e] = 1;
        })
        this.exceptionAnswersData = result.resolveResp.data['exceptionResultJason'];
        this.exceptionAnswersData.map(e => {
          e.Status == "Resolved" || e.Status == "Unresolved" ? e.approved = false : e.approved = true
          return;
        });
        this.sortByUnresolvedException();
        this.resetResolveUnresolveButtons();
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }


  actionUnResolvedClick(row) {
    const dialogRef = this.dialog.open(ResolveModalComponent, {
      width: '843px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Unresolve selected",
        description: `<p>Are you sure you want to unresolve the selected exception? If yes, you will need to add a general comment for this action. Please note, this will move these items to production review.</p><br><p><b style="font-weight: 800;">Note:</b>  Unesolved exceptions will be changed back to this icon <svg style="display: inline;" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.1667 17.4167L10.0833 0L0 17.4167H20.1667ZM9.16667 14.6667V12.8333H11V14.6667H9.16667ZM9.16667 11H11V7.33333H9.16667V11Z" fill="#FF9831"/></svg>.</p>`,
        entityType: "ANSWER_EXCEPTION",
        entityId: this.getEnitityIds('Resolved'),
        filingName: this.filingName,
        period: this.period,
        stage: this.stage,
        exceptionId: this.filingService.getExceptionData.exceptionId,
        statusTo: 'UNRESOLVE',
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
          YesButton: "Confirm",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Confirm") {
        let entityIds = this.getEnitityIds('Resolved');
        entityIds.map((e) => {
          this.commentsCount[e] ? this.commentsCount[e] += 1 : this.commentsCount[e] = 1;
        });
        this.exceptionAnswersData = result.resolveResp.data['exceptionResultJason'];
        this.exceptionAnswersData.map(e => {
          e.Status == "Resolved" || e.Status == "Unresolved" ? e.approved = false : e.approved = true
          return;
        });
        this.sortByUnresolvedException();
        this.resetResolveUnresolveButtons()
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  exportData() {
    this.exportsHeader = '';
    for (const property in this.exceptionAnswersData[0]) {
      let hedars = property;
      if(this.exportsHeader)
       this.exportsHeader = this.exportsHeader+","+hedars;
      else  
      this.exportsHeader = hedars;
    }
    this.exportsHeader =  this.exportsHeader+",Comments";
    this.viewService.exportData(this.filingName, this.period, this.filingService.getExceptionData.exceptionId, this.exceptionCnt, this.exportsHeader).subscribe(res => {
     
    });
    
  }

}
