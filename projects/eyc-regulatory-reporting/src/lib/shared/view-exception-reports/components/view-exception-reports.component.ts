import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RegulatoryReportingFilingService } from './../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from './../../table-header-renderer/table-header-renderer.component';
import { ViewExceptionReportsService } from './../services/view-exception-reports.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalComponent } from 'eyc-ui-shared-component';
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

  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>;


  constructor(
    private filingService: RegulatoryReportingFilingService,
    private viewService: ViewExceptionReportsService,
    private router: Router,
    private location: Location,
    public dialog: MatDialog,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      const state = navigation.extras.state as {dataIntakeData: string};
      this.dataIntakeData = state.dataIntakeData;
    }
   }

  ngOnInit(): void {
    if (this.dataIntakeData) {
      console.log('Date Intake Module',this.dataIntakeData);
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
      this.dueDate = this.filingService.getFilingData.dueDate;
      // this.formatDate();
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
      this.filingId = this.filingService.getFilingData.filingId;
      // console.log(this.filingService.getExceptionData);
      this.exceptionReportName = this.filingService.getExceptionData.exceptionReportName;
      this.parentModule = 'Regulatory Reporting';
      this.stage = 'reporting'
      sessionStorage.setItem("reportingTab", '1'); 
    }
    if(this.dataIntakeData) {
      this.getExceptionResults();
    } else {
      this.getAnswerExceptionReports();
    }
  }

  getAnswerExceptionReports() {
    this.viewService.getAnswerExceptionReports(this.filingName, this.period, this.filingService.getExceptionData.exceptionId).subscribe(res => {
     this.exceptionAnswersData = res.data;
      this.createEntitiesRowData();
    });
  }

  getExceptionResults() {
    this.viewService.getExceptionResults(this.dataIntakeData.ruleExceptionId).subscribe(res => {
      this.exceptionAnswersData = res.data;
      this.createEntitiesRowData();
    });
  }

  createEntitiesRowData(): void {
    this.exceptionAnswersDefs = [
    ];


    for (const property in this.exceptionAnswersData[0]) {
      // console.log(`${property}: ${this.exceptionAnswersData[0][property]}`);
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
    this.exceptionAnswersDefs.push({
      headerName: 'Comments',
      headerComponentFramework: TableHeaderRendererComponent,
      cellRendererFramework: MotifTableCellRendererComponent,
      cellRendererParams: {
        ngTemplate: this.commentExceptionTemplate,
      }, sortable: true, autoHeight: true,
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
    stage == 'intake' ? sessionStorage.setItem("enableTabsIntake", 'yes') : '';
    this.location.back();
  }

  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.AuditResultObjectID,
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
      if(result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
        
        // this.exceptionAnswersDefs[this.exceptionAnswersDefs.findIndex(item => item.AuditResultObjectID === row.AuditResultObjectID)].comments = 1;
        this.createEntitiesRowData(); 
      } else {
        console.log(result);
      }
    });
  }

}
