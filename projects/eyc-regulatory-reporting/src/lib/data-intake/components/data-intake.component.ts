import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ModalComponent } from 'eyc-ui-shared-component';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { DataIntakeService } from '../services/data-intake.service';
import { PermissionService } from 'eyc-ui-shared-component';
import { Router, NavigationExtras } from '@angular/router';
import { EycRrSettingsService } from './../../services/eyc-rr-settings.service';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';


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
  exceptionGridApi;
  rowData = [];
  datasetData = [];
  exceptionReportRows;
  exceptionDetailCellRendererParams;
  submitException;
  filesListArr;
  enableTabs = false;
  showComments = false;
  commentsData;
  commentsName;
  filingStatusStageId: any;
  bdFilesList = {};
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
      description: "Are you sure you want to approve the selected exception report(s)?",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
      }
    }
  };
  showToastAfterApproveExceptionReports = false;
  commentEntityType;
  entityId;
  exportHeaders: string;
  exportURL: string;
  lastFileDueDate;
  pageInfoException = {
    currentPage: 0,
    totalRecords: 5,
    pageSize: 10,
    filter: '',
    sort: '',
  }
  pageInfoData = {
    currentPage: 0,
    totalRecords: 5,
    pageSize: 10,
    filter: '',
    sort: '',
  }
  pageChangeFunc;

  constructor(
    private service: DataIntakeService,
    public dialog: MatDialog,
    private filingService: RegulatoryReportingFilingService,
    public permissions: PermissionService,
    private router: Router,
    private settingsService: EycRrSettingsService,
    @Inject('mockDataEnable') public mockDataEnable
  ) { }

  ngOnInit(): void {
    this.submitDatasets = this.onSubmitApproveDatasets.bind(this);
    this.submitException = this.onSubmitApproveExceptionReports.bind(this);
    this.pageChangeFunc = this.onPageChange.bind(this);
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
  @ViewChild('actionButtonTemplate')
  actionButtonTemplate: TemplateRef<any>;

  receiveFilingDetails(event) {
    this.filingDetails = event;
    console.log('FILING DETAILS', this.filingDetails);
    this.getFiles();
    if(sessionStorage.getItem("enableTabsIntake")) {
      this.enableTabs = true;
      this.getExceptionReports(true);
      this.tabs == 1;
    }
  }

  getExceptionReports(resetData = false) {
    this.pageInfoException.sort = resetData ? 'file:true' : this.pageInfoException.sort;
    this.service.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period, this.pageInfoException.currentPage, this.pageInfoException.pageSize, this.pageInfoException.filter, this.pageInfoException.sort).subscribe(res => {
      if(this.mockDataEnable) {
        this.exceptionData = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
        this.createEntitiesRowData();
      } else { 
        this.exceptionData = res['data']; 
        this.pageInfoException.totalRecords = res['totalRecords'];
        if (resetData) {
          this.createEntitiesRowData();
        } else {
          this.exceptionGridApi.setRowData(this.exceptionData);
          console.log('SET ROW DATA');
        }
      }
      console.log(this.exceptionData);
    }, error => {
      this.exceptionData = [];
      console.log("exception data error");
    });

  }

  getFiles() {
    console.log('FILING DETAILS', this.filingDetails);
    this.service.getfilesList(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      if(this.mockDataEnable) {
      this.filesListArr = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
      } else { this.filesListArr = res['data']; }
      console.log('EXCEPTION SUMMARY', this.filesListArr);
    }, error => {
      console.log("files list error");
    });

  }

  getDatasets(resetData = false) {
    this.pageInfoData.sort = resetData ? 'file:true' : this.pageInfoData.sort;
    this.service.getDatasetsrecords(this.filingDetails.filingName, this.filingDetails.period, this.pageInfoData.currentPage, this.pageInfoData.pageSize, this.pageInfoData.filter, this.pageInfoData.sort).subscribe(res => {
      if(this.mockDataEnable) {
        this.datasets = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
        this.createEntitiesRowData();
      } else {  
        this.datasets = res['data']; 
        this.pageInfoData.totalRecords = res['totalRecords'];
        if (resetData) {
          this.createEntitiesRowData();
        } else {
          this.gridApi.setRowData(this.datasets);
        }
      }
      console.log('DATASETS:', this.datasets);
    }, error => {
      this.datasets = [];
      console.log("Datasets error");
    });
  }

  getBDFilesList(event) {
    let index = event.index;
    let businessDay = this.filesListArr[index].exceptionDue;
    console.log('businessDay > ', businessDay);
    console.log('INDEX', event);
    this.lastFileDueDate = this.filesListArr[index].lastFileDueDate
    this.service.getBDFilesList(this.filingDetails.filingName, this.filesListArr[index].lastFileDueDate, this.filingDetails.period).subscribe(res => {
      if(this.mockDataEnable) {
        this.bdFilesList[index] = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName && item.exceptionDue == businessDay);
      } else {
        this.bdFilesList[index] = res['data'].filter((e, i) => res['data'].findIndex(a => a['fileName'] === e['fileName']) === i);
      }
    }, error => {
      this.bdFilesList[index] = [];
      console.log("Dataset error");
    });
  }

  receiveMessage($event) {
    this.tabs = $event;
    if (this.tabs == 2) {
      this.getDatasets(true);
    } else if (this.tabs == 1) {
      this.getExceptionReports(true);
    }
    console.log('TAB EVENT', $event);
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

  checkFilingCompletedStatus(){
    return this.filingService.checkFilingCompletedStatus(this.filingDetails);
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  handleExceptionGridReady(params) {
    this.exceptionGridApi = params.api;
  }

  onPageChange() {
    this.exceptionEntitySwitch();
  }

  disableComparator(data1, data2) {
    return 0; 
  }

  exceptionEntitySwitch() {
    if (this.tabs == 2) {
      this.getDatasets();
    } else if (this.tabs == 1) {
      this.getExceptionReports();
    }
  }

  currentPageChange(event) {
    console.log('CURRENT PAGE CHANGE', event - 1);
    this.tabs == 2 ? this.pageInfoData.currentPage = event - 1 : this.pageInfoException.currentPage = event - 1;
  }

  updatePageSize(event) {
    console.log('CURRENT PAGE SIZE', event);
    this.tabs == 2 ? this.pageInfoData.pageSize = event : this.pageInfoException.pageSize = event;
    this.exceptionEntitySwitch();
  }

  searchGrid(input) {
    if (this.tabs == 2) {
      this.pageInfoData.filter = input;
      this.pageInfoData.currentPage = 0;
    } else {
      this.pageInfoException.filter = input;
      this.pageInfoException.currentPage = 0;
    }
    this.exceptionEntitySwitch();
  }

  sortChanged(event) {
    this.tabs == 2 ? this.pageInfoData.sort = event : this.pageInfoException.sort = event;
    this.exceptionEntitySwitch();
  }

  createEntitiesRowData(): void {
    this.datasetsDefs = [];
    this.exceptionDefs = [];
    this.datasetData = [];
    this.rowData = [];
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
        headerName: 'Due',
        field: 'due',
        sortable: true,
        filter: true,
        comparator: this.disableComparator,
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
        field: 'file',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: this.disableComparator,
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
        comparator: this.disableComparator,
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
        comparator: this.disableComparator,
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
        width: 150,
        comparator: this.disableComparator,
      } ,
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resolveExceptionTemplate,
        },
        headerName: 'Resolved',
        field: 'resolvedCount',
        sortable: true,
        filter: true,
        width: 200,
        comparator: this.disableComparator,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptionCount',
        sortable: true,
        filter: true,
        width: 200,
        comparator: this.disableComparator,
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
      // {
      //   headerComponentFramework: TableHeaderRendererComponent,
      //   cellRendererFramework: MotifTableCellRendererComponent,
      //   cellRendererParams: {
      //     ngTemplate: this.datasetsDropdownTemplate,
      //   },
      //   field: 'approved',
      //   headerName: '',
      //   width: 70,
      //   sortable: false,
      //   pinned: 'left'
      // },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Due',
        field: 'due',
        sortable: true,
        filter: true,
        comparator: this.disableComparator,
        autoHeight: true,
        wrapText: true,
        width: 130
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'File',
        field: 'file',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: this.disableComparator,
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
        comparator: this.disableComparator,
        autoHeight: true,
        wrapText: true,
        width: 150
      },
      /*{
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
      } ,
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
      } */
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resolveDatasetsTemplate,
        },
        headerName: 'Resolved',
        field: 'resolved',
        sortable: true,
        filter: true,
        width: 150,
        comparator: this.disableComparator,
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
        comparator: this.disableComparator,
      }
    ];
    this.rowData = this.exceptionData;
    this.datasetData = this.datasets;
  }

  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.id,
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
        this.exceptionData[this.exceptionData.findIndex(item => item.id === row.id)].commentCount = 1;
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

  getFilingStatusDetails(event: any) {
    let stage = event.find(item => item.stageCode == "DATA_INTAKE")
    this.filingStatusStageId = stage.stageId
  }

  onSubmitApproveExceptionReports() {
    console.log("exceptionReportRows", this.exceptionReportRows);
    let selectedExceptionRows = this.exceptionReportRows
    let selectedFiling = {
      "exceptionReportIds": this.exceptionReportRows.map(({ ruleExceptionId }) => ruleExceptionId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Intake",
      "filingStageId": this.filingStatusStageId
    };
    this.service.approveExceptionReports(selectedFiling).subscribe(res => {
      console.log("approved response",res);
      console.log(this.exceptionReportRows);
      console.log(selectedExceptionRows);
      selectedExceptionRows.forEach(ele => {
        this.exceptionData[this.exceptionData.findIndex(item => item.ruleExceptionId === ele.ruleExceptionId)].approved = true;
        this.exceptionData[this.exceptionData.findIndex(item => item.ruleExceptionId === ele.ruleExceptionId)].resolvedCount = ele.exceptionCount;
      }); 
      console.log(this.exceptionData);
      this.createEntitiesRowData();
      this.exceptionReportRows = [];
      // this.filingService.invokeFilingDetails();
      this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
      setTimeout(() => {
        this.showToastAfterApproveExceptionReports = !this.showToastAfterApproveExceptionReports;
      }, 5000);
    });
    
  }

  datasetsReportRowsSelected(event) {
    console.log(event);
    this.datasetsSelectedRows = event;
  }

  ngOnDestroy() {
    this.enableTabs = false;
    sessionStorage.removeItem("enableTabsIntake");
  }

  
  openComments(row) {
    this.commentsName = this.filingDetails.filingName + ' // ' + this.filingDetails.period;
    if (this.tabs == 2) {
      this.commentEntityType = 'DATASET';
      this.entityId = row.entityId;
    } else {
      this.commentEntityType = 'DATA_EXCEPTION_REPORT'
      this.entityId = row.id;
    }
    this.showComments = true;

  }

  commentAdded() {
    if (this.tabs==2) {
      this.getFiles();
    } else {
      this.getExceptionReports();
    }
  }

  routeToExceptionDetailsPage(event:any) {
    event.exceptionReportName = event.file;
    console.log(event);
    const navigationExtras: NavigationExtras = {state: {dataIntakeData: {
      filingName: this.filingDetails.filingName,
      dueDate: this.filingDetails.dueDate,
      filingId: event.exceptionId,
      exceptionReportName: event.file,
      parentModule: 'Regulatory Reporting',
      period: this.filingDetails.period,
      ruleExceptionId: event.ruleExceptionId
    }}};
    this.router.navigate(['/view-exception-reports'], navigationExtras);
  }

  exportData(type) {
    if(type == 'exceptions') {
      this.exportHeaders = 'due:Due,file:File,exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,commentCount:Comments,resolvedCount:Resolved,exceptionCount:Exceptions';
      this.exportURL =  this.settingsService.regReportingFiling.di_exception_reports + "filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period  + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    } else if(type == 'dataset') {
      this.exportHeaders = 'due:Due,file:File,source:Source,resolved:Resolved,version:Version';
      this.exportURL =  this.settingsService.regReportingFiling.datasets_list + "filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period + "&stage=Reporting" + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    } else if(type == 'accordion') {
      this.exportHeaders = 'dataset:Dataset,fileName:File Name,status:Status,report:Report,source:Source,dataOwner:Data Owner,sourceType:Source Type,ownerEmail:Data Owner Email';
      this.exportURL =  this.settingsService.regReportingFiling.bd_files_list +"filingName=" +this.filingDetails.filingName+ "&lastFileDueDate="+ this.lastFileDueDate+"&period="+this.filingDetails.period + "&stage=Reporting" + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    }
    console.log("export URL > ", this.exportURL);

    this.service.exportIntakeData(this.exportURL).subscribe(resp => {
      console.log(resp);
    })

  }

}