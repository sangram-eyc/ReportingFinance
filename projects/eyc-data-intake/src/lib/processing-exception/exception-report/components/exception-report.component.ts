import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProcessingExceptionService } from '../../services/processing-exception.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { ModalComponent , customComparator} from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'lib-exception-report',
  templateUrl: './exception-report.component.html',
  styleUrls: ['./exception-report.component.scss']
})
export class ExceptionReportComponent implements OnInit {

  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  exceptionDefs;
  filingDetails: any;
  rowData = [];
  submitException;
  exceptionReportRows;
  exceptionDetailCellRendererParams;
  exceptionModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected exception reports?",
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
  commentExceptionTemplate: TemplateRef<any>;
  @ViewChild('unresolveExceptionTemplate')
  unresolveExceptionTemplate: TemplateRef<any>;
  @ViewChild('resolveExceptionTemplate')
  resolveExceptionTemplate: TemplateRef<any>;
  @ViewChild('resultTemplate')
  resultTemplate: TemplateRef<any>;
  @ViewChild('viewDetTemplate')
  viewDetTemplate: TemplateRef<any>;
  @ViewChild('expandExceptionTemplate')
  expandExceptionTemplate: TemplateRef<any>;

  constructor(
    private service: ProcessingExceptionService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.submitException = this.onSubmitApproveExceptionReports.bind(this);
    this.getExceptionReports();
  }

  getExceptionReports() {
    this.service.getExceptionReports().subscribe(res => {
      console.log(res);
      this.rowData = res['data'];
      this.createEntitiesRowData();
    })
  }

  createEntitiesRowData(): void {
    /* const customComparator = (valueA, valueB) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    }; */

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
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resultTemplate,
        },
        headerName: 'Result',
        field: 'result',
        sortable: false,
        filter: false,
        width: 100,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Due',
        field: 'exceptionDue',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 130
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.expandExceptionTemplate,
        },
        headerName: 'File',
        field: 'exceptionFile',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 300
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Reg Report',
        field: 'reg_reporting',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 170
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exception Report Type',
        field: 'exceptionReportType',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 250,
        
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exception Report Name',
        field: 'exceptionReportName',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 250,
        sort: 'asc',
        comparator: customComparator
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
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.unresolveExceptionTemplate,
        },
        headerName: 'Unresolved',
        field: 'unresolve_exception',
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resolveExceptionTemplate,
        },
        headerName: 'Resolved',
        field: 'resolve_exception',
        sortable: true,
        filter: true,
        width: 140,
      },
      
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Review Level',
        field: 'reviewLevel',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.viewDetTemplate,
        },
        width: 50
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: '',
        field: 'exceptionId',
        hide: true
      } 
    ];
  }

  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.exceptionId,
        entityType: "Data Exception Report",
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
      // console.log('The dialog was closed', result);
      if (result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
        this.rowData[this.rowData.findIndex(item => item.exceptionId === row.exceptionId)].comments = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  routeToExceptionDetailsPage(event:any) {
    event.exceptionReportName = event.exceptionFile;
    console.log(event);
    const navigationExtras: NavigationExtras = {state: {dataIntakeData: {
      filingName: event.reg_reporting,
      dueDate: event.exceptionDue,
      filingId: event.exceptionId,
      exceptionReportName: event.exceptionFile,
      parentModule: 'Data Intake',
      period: null
    }}};
    this.router.navigate(['/view-exception-reports'], navigationExtras);
  }
  exceptionReportRowsSelected(event) {
    console.log(event);
    this.exceptionReportRows = event;
  }

  onSubmitApproveExceptionReports() {
    console.log(this.exceptionReportRows);
    // const filingDetails = this.filingDetails;
    // let selectedFiling = {
    //   "exceptionReportIds": this.exceptionReportRows.map(({ exceptionId }) => exceptionId),
    //   "filingName": this.filingDetails.filingName,
    //   "period": this.filingDetails.period,
    //   "stage": "Reporting"
    // };
    // this.rrservice.approveAnswerExceptions(selectedFiling).subscribe(res => {
    //   res['data']['answerExceptions'].forEach(ele => {
    //     this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
    //   });
    //   this.createEntitiesRowData();
    //   this.exceptionReportRows = [];
    //   this.filingService.invokeFilingDetails();
    //   this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
    //   setTimeout(() => {
    //     this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
    //   }, 5000);
    // });

    this.exceptionReportRows.forEach(ele => {
      this.rowData[this.rowData.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
    }); 
    console.log(this.rowData);
    this.createEntitiesRowData();
    this.exceptionReportRows = [];
  }

}
