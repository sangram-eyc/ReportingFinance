import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ModalComponent } from 'eyc-ui-shared-component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { DataIntakeService } from '../services/data-intake.service';
import { PermissionService } from 'eyc-ui-shared-component';
import { customComparator } from '../../config/rr-config-helper';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit, OnDestroy {
  status = {
    stage: 'Reporting',
    progress: 'in-progress'
  };
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  exceptionDefs;
  tabs = 1;
  filingDetails: any;
  exceptionData;
  rowData = [];
  exceptionReportRows;
  exceptionDetailCellRendererParams;
  submitException;
  filesListArr;
  enableTabs = false;
  showComments = false;
  commentsData;
  commentsName;

  filesDatasets = {};
  datasets = [];
  datasetsDefs;
  submitDatasets;
  datasetsSelectedRows;
  datasetsModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected datasets? This will advance them to the next reviewer.",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
      }
    }
  };
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

  constructor(
    private service: DataIntakeService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog,
    public permissions: PermissionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.submitDatasets = this.onSubmitApproveDatasets.bind(this);
    this.submitException = this.onSubmitApproveExceptionReports.bind(this);
    this.getFiles();
  }

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>;
  @ViewChild('resolveExceptionTemplate')
  resolveExceptionTemplate: TemplateRef<any>;
  @ViewChild('datasetsDropdownTemplate')
  datasetsDropdownTemplate: TemplateRef<any>;
  @ViewChild('commentDatasetsTemplate')
  commentDatasetsTemplate: TemplateRef<any>;
  @ViewChild('resolveDatasetsTemplate')
  resolveDatasetsTemplate: TemplateRef<any>;
  @ViewChild('viewDetTemplate')
  viewDetTemplate: TemplateRef<any>;
  @ViewChild('expandExceptionTemplate')
  expandExceptionTemplate: TemplateRef<any>;
  receiveFilingDetails(event) {
    this.filingDetails = event;
    console.log(this.filingDetails);

    /* if (this.tabs == 2) {
      this.getDatasets();
    } */
  }
  getExceptionReports() {
    this.service.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.exceptionData = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
      console.log(this.exceptionData);
      this.createEntitiesRowData();

    }, error => {
      this.exceptionData = [];
      console.log("Client Review error");
    });

  }

  getFiles() {
    this.service.getfilesList().subscribe(res => {
      this.filesListArr = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
    }, error => {
      console.log("files list error");
    });

  }

  getDatasets() {
    this.service.getDatasetsrecords().subscribe(res => {
      this.datasets = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
      console.log(this.datasets);
      this.createEntitiesRowData();

    }, error => {
      this.datasets = [];
      console.log("Datasets error");
    });
  }

  getFileDataSet(event) {
    let index = event.index;
    console.log('INDEX', index);
    this.service.getDatasetsrecords().subscribe(res => {
      this.filesDatasets[index] = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
    }, error => {
      this.filesDatasets[index] = [];
      console.log("Dataset error");
    });
  }

  receiveMessage($event) {
    this.tabs = $event;
    if (this.tabs == 2) {
      this.getDatasets();
    } else if (this.tabs == 1) {
      this.getExceptionReports();
    }
    /* else if (this.tabs == 3) {
      this.getDatasets();
    } */
  }

  getIntakeDetails($event) {
    this.enableTabs = $event;
    this.receiveMessage(this.tabs);
  }

  exceptionReportRowsSelected(event) {
    console.log(event);
    this.exceptionReportRows = event;
  }

  createEntitiesRowData(): void {

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
        headerName: 'Exception Report Type',
        field: 'exceptionReportType',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 250
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
      }/* ,
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
      } */,
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
        width: 200,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptions',
        sortable: true,
        filter: true,
        width: 200,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.viewDetTemplate,
        },
        width: 50
      } 
      /* ,
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Review Level',
        field: 'reviewLevel',
        sortable: true,
        filter: true,
      }, */

    ];

    this.datasetsDefs = [
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
        pinned: 'left'
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
        headerName: 'Source',
        field: 'source',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Client',
        field: 'client',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 150,
        sort: 'asc',
        comparator: customComparator
      }/* ,
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.commentDatasetsTemplate,
        },
        headerName: 'Comments',
        field: 'comments',
        sortable: true,
        filter: true,
        width: 150
      } */,
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
        width: 150,
      },
     /* {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptions',
        sortable: true,
        filter: true,
        width: 150,
      } ,
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Review Level',
        field: 'reviewLevel',
        sortable: true,
        filter: true,
      } */,
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Version',
        field: 'version',
        sortable: true,
        filter: true,
      }
    ];
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.exceptionId,
        entityType: "DATA_EXCEPTION_REPORT",
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
        this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === row.exceptionId)].comments = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  addCommentToDatasets(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.exceptionId,
        entityType: "DATASET",
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
        this.datasets[this.datasets.findIndex(item => item.exceptionId === row.exceptionId)].comments = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  onSubmitApproveDatasets() {
    this.datasetsSelectedRows.forEach(ele => {
      this.datasets[this.datasets.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
    });
    this.createEntitiesRowData();
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
      this.exceptionData[this.exceptionData.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
    }); 
    console.log(this.exceptionData);
    this.createEntitiesRowData();
    this.exceptionReportRows = [];
  }

  datasetsReportRowsSelected(event) {
    console.log(event);
    this.datasetsSelectedRows = event;
  }

  ngOnDestroy() {
    this.enableTabs = false;
  }

  openComments(event = null) {
    console.log('OPEN COMMENTS');
    this.commentsData = [];
    this.commentsName = this.filingDetails.filingName + ' // ' + this.filingDetails.period;
    this.service.getComments('filing', 2).subscribe(res => {
      this.commentsData = res['data'];
    }, error => {
      this.commentsData = [];
      console.log("Comments error");
    });
    this.showComments = true;
  }


  routeToExceptionDetailsPage(event:any) {
    event.exceptionReportName = event.exceptionFile;
    console.log(event);
    const navigationExtras: NavigationExtras = {state: {dataIntakeData: {
      filingName: event.reg_reporting,
      dueDate: this.filingDetails.dueDate,
      filingId: event.exceptionId,
      exceptionReportName: event.exceptionFile,
      parentModule: 'Regulatory Reporting',
      period: this.filingDetails.period
    }}};
    this.router.navigate(['/view-exception-reports'], navigationExtras);
  }

}