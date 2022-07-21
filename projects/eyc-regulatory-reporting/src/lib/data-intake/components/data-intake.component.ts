import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CellRendererTemplateComponent, ModalComponent } from 'eyc-ui-shared-component';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { DataIntakeService } from '../services/data-intake.service';
import { PermissionService, DEFAULT_PAGE_SIZE } from 'eyc-ui-shared-component';
import { Router, NavigationExtras } from '@angular/router';
import { EycRrSettingsService } from './../../services/eyc-rr-settings.service';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { rr_module_name } from '../../config/rr-config-helper';


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
  // exceptionDefs;
  exceptionDefsAgGrid;
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
  // datasetsDefs;
  datasetsDefsAgGrid;
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
    pageSize: DEFAULT_PAGE_SIZE,
    filter: '',
    sort: '',
  }
  pageInfoData = {
    currentPage: 0,
    totalRecords: 5,
    pageSize: DEFAULT_PAGE_SIZE,
    filter: '',
    sort: '',
  }
  pageChangeFunc;
  moduleOriginated = rr_module_name;
  showIntakeModal = false;
  intakeStageCompleted = false;
  exportName: string;
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
    this.exportName = this.filingDetails.filingName+"_"+this.filingDetails.period+"_Intake_Exception Reports_"
    this.pageInfoException.sort = resetData ? 'file:true' : this.pageInfoException.sort;
    this.service.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      if(this.mockDataEnable) {
        this.exceptionData = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
        this.createEntitiesRowData();
      } else { 
        this.exceptionData = res['data'];
        this.rowData = this.exceptionData
        this.pageInfoException.totalRecords = res['totalRecords'];
        if (resetData) {
          this.createEntitiesRowData();
        } else {
          this.rowData = [...this.exceptionData];
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
    this.exportName = this.filingDetails.filingName+"_"+this.filingDetails.period+"_Intake_"
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
    console.log("getDatasets");
    this.exportName = this.filingDetails.filingName+"_"+this.filingDetails.period+"_Intake_Dataset_Data_"
    this.pageInfoData.sort = resetData ? 'file:true' : this.pageInfoData.sort;
    this.service.getDatasetsrecords(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      if(this.mockDataEnable) {
        this.datasets = res['data'].filter(item => item.reg_reporting == this.filingDetails.filingName);
        this.createEntitiesRowData();
      } else { 

        this.datasets = res['data']; 
        // this.datasetData = this.datasets;
        // this.pageInfoData.totalRecords = res['totalRecords'];
        if (resetData) {
          console.log("resetData");
          
          this.createEntitiesRowData();
        } else {
          this.datasetData = [...this.datasets];
        }
      }
      console.log('DATASETS:', this.datasets);
    }, error => {
      this.datasets = [];
      console.log("Datasets error");
    });
    this.exportName = this.filingDetails.filingName+"_"+this.filingDetails.period+"_Intake_Datasets_"
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
    console.log("receiveMessage")
    this.tabs = $event;
    
    if (this.tabs == 2) {
      this.getDatasets(true);
      this.pageInfoException.filter = '';
      this.pageInfoException.currentPage = 0;
      this.pageInfoException.pageSize = DEFAULT_PAGE_SIZE;
    } else if (this.tabs == 1) {
      this.getExceptionReports(true);
      this.pageInfoData.filter = '';
      this.pageInfoData.currentPage = 0;
      this.pageInfoData.pageSize = DEFAULT_PAGE_SIZE;
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
    // this.datasetsDefs = [];
    this.datasetsDefsAgGrid = []
    // this.exceptionDefs = [];
    this.exceptionDefsAgGrid = [];
    this.datasetData = [];
    this.rowData = [];
// this.exceptionDefs = [
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.dropdownTemplate,
    //     },
    //     field: 'approved',
    //     headerName: '',
    //     width: 20,
    //     sortable: false,
    //     pinned: 'left',
    //     cellStyle: params => 
    //     (this.checkFilingCompletedStatus()) ?  
    //         {'pointer-events': 'none'}
    //         : ''
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.actionButtonTemplate,
    //     },
    //     headerName: 'Action',
    //     field: 'template',
    //     minWidth: 70,
    //     width: 70,
    //     sortable: false,
    //     cellClass: 'actions-button-cell'
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Due',
    //     field: 'due',
    //     sortable: true,
    //     filter: true,
    //     comparator: this.disableComparator,
    //     autoHeight: true,
    //     wrapText: true,
    //     width: 130
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.expandExceptionTemplate,
    //     },
    //     headerName: 'File',
    //     field: 'file',
    //     sortable: true,
    //     filter: true,
    //     comparator: this.disableComparator,
    //     autoHeight: true,
    //     wrapText: true,
    //     width: 300
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Exception Report Type',
    //     field: 'exceptionReportType',
    //     sortable: true,
    //     filter: true,
    //     comparator: this.disableComparator,
    //     autoHeight: true,
    //     wrapText: true,
    //     width: 250
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Exception Report Name',
    //     field: 'exceptionReportName',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 250,
    //     comparator: this.disableComparator,
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.commentExceptionTemplate,
    //     },
    //     headerName: 'Comments',
    //     field: 'commentCount',
    //     sortable: true,
    //     filter: true,
    //     width: 150,
    //     comparator: this.disableComparator,
    //   } ,
    //   // {
    //   //   headerComponentFramework: TableHeaderRendererComponent,
    //   //   cellRendererFramework: MotifTableCellRendererComponent,
    //   //   cellRendererParams: {
    //   //     ngTemplate: this.resolveExceptionTemplate,
    //   //   },
    //   //   headerName: 'Resolved',
    //   //   field: 'resolvedCount',
    //   //   sortable: true,
    //   //   filter: true,
    //   //   width: 200,
    //   //   comparator: this.disableComparator,
    //   // },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Exceptions',
    //     field: 'exceptionCount',
    //     sortable: true,
    //     filter: true,
    //     width: 200,
    //     comparator: this.disableComparator,
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.viewDetTemplate,
    //     },
    //     width: 50
    //   } 
    //   /* ,
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Review Level',
    //     field: 'reviewLevel',
    //     sortable: true,
    //     filter: true,
    //   }, */

    // ];

    this.exceptionDefsAgGrid = [
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.datasetsDropdownTemplate,
        },
        headerCheckboxSelection: this.exceptionData.some(item => item.approved == false),
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: params=>params.data.approved == false,
        maxWidth: 70,
        sortable: false,
        menuTabs: [],
        filter:false,
        pinned: 'left',
        cellClass: 'approved_icon'
      },
      {
        maxWidth: 80,
        hide: true,
        pinned: 'left',
        field: 'approved',
        headerName: 'Status',
      },
      {
        valueGetter: "node.rowIndex + 1",
        getQuickFilterText: function(params) {
          return '';
        },
        maxWidth: 70,
        sortable: false,
        menuTabs: [],
        filter:false,
        pinned: 'left',
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtonTemplate,
        },
        headerName: 'Action',
        field: 'Actions',
        minWidth: 100,
        sortable: false,
        menuTabs: ['generalMenuTab'],
        filter:false,
        cellClass: 'actions-button-cell'
      },
      {
        headerName: 'Due',
        field: 'due',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 130
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.expandExceptionTemplate,
        },
        headerName: 'File',
        field: 'file',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 300,
        tooltipField: 'file'
        
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
        minWidth: 250
      },
      {
        headerName: 'Exception Report Name',
        field: 'exceptionReportName',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 250,
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.commentExceptionTemplate,
        },
        headerName: 'Comments',
        field: 'commentCount',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 150,
      } ,
      // {
      //   headerComponentFramework: TableHeaderRendererComponent,
      //   cellRendererFramework: MotifTableCellRendererComponent,
      //   cellRendererParams: {
      //     ngTemplate: this.resolveExceptionTemplate,
      //   },
      //   headerName: 'Resolved',
      //   field: 'resolvedCount',
      //   sortable: true,
      //   filter: true,
      //   width: 200,
      //   comparator: this.disableComparator,
      // },
      {
        headerName: 'Exceptions',
        field: 'exceptionCount',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 200,
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.viewDetTemplate,
        },
        maxWidth: 50
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
    // this.datasetsDefs = [
    //   // {
    //   //   headerComponentFramework: TableHeaderRendererComponent,
    //   //   cellRendererFramework: MotifTableCellRendererComponent,
    //   //   cellRendererParams: {
    //   //     ngTemplate: this.datasetsDropdownTemplate,
    //   //   },
    //   //   field: 'approved',
    //   //   headerName: '',
    //   //   width: 70,
    //   //   sortable: false,
    //   //   pinned: 'left'
    //   // },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Due',
    //     field: 'due',
    //     sortable: true,
    //     filter: true,
    //     comparator: this.disableComparator,
    //     autoHeight: true,
    //     wrapText: true,
    //     width: 130
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'File',
    //     field: 'file',
    //     sortable: true,
    //     filter: true,
    //     comparator: this.disableComparator,
    //     autoHeight: true,
    //     wrapText: true,
    //     width: 300
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Source',
    //     field: 'source',
    //     sortable: true,
    //     filter: true,
    //     comparator: this.disableComparator,
    //     autoHeight: true,
    //     wrapText: true,
    //     width: 150
    //   },
    //   /*{
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Client',
    //     field: 'client',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 150,
    //     sort: 'asc',
    //     comparator: customComparator
    //   } ,
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.commentDatasetsTemplate,
    //     },
    //     headerName: 'Comments',
    //     field: 'comments',
    //     sortable: true,
    //     filter: true,
    //     width: 150
    //   } */
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.resolveDatasetsTemplate,
    //     },
    //     headerName: 'Resolved',
    //     field: 'resolved',
    //     sortable: true,
    //     filter: true,
    //     width: 150,
    //     comparator: this.disableComparator,
    //   },
    //  /* {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Exceptions',
    //     field: 'exceptions',
    //     sortable: true,
    //     filter: true,
    //     width: 150,
    //   } ,
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Review Level',
    //     field: 'reviewLevel',
    //     sortable: true,
    //     filter: true,
    //   } */,
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Version',
    //     field: 'version',
    //     sortable: true,
    //     filter: true,
    //     comparator: this.disableComparator,
    //   }
    // ];
    this.datasetsDefsAgGrid = [
      {
        valueGetter: "node.rowIndex + 1",
        getQuickFilterText: function(params) {
          return '';
        },
        maxWidth: 70,
        sortable: false,
        menuTabs: [],
        filter:false,
        pinned: 'left',
      },
      {
        headerName: 'Due',
        field: 'due',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 150
      },
      {
        headerName: 'File',
        field: 'file',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 300,
        tooltipField: 'file'
      },
      {
        headerName: 'Source',
        field: 'source',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 200,
        tooltipField: 'source'
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.resolveDatasetsTemplate,
        },
        headerName: 'Resolved',
        field: 'resolved',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 155,
      },
      {
        headerName: 'Version',
        field: 'version',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 155
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
        entityId: row.datasetRuleId,
        entityType: "Data Exception Report",
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
      // console.log('The dialog was closed', result);
      if (result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
        this.exceptionData[this.exceptionData.findIndex(item => item.datasetRuleId === row.datasetRuleId)].commentCount = 1;
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
        entityType: "DataSet",
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
    this.intakeStageCompleted = stage.progress == "COMPLETED" ? true : false;
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
      this.commentEntityType = 'DataSet';
      this.entityId = row.entityId;
    } else {
      this.commentEntityType = 'Data Exception Report'
      this.entityId = row.datasetRuleId;
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
      ruleExceptionId: event.ruleExceptionId,
      ruleType: event.ruleType,
      tableName: event.tableName,
      filename: event.filename
    }}};
    this.filingService.setExceptionData = event;
    this.router.navigate(['/view-exception-reports'], navigationExtras);
  }

  exportData(type) {
    if(type == 'exceptions') {
      if(this.permissions.validatePermission('Data Intake', 'View Comments')) { 
        this.exportHeaders = 'due:Due,file:File,exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,commentCount:Comments,exceptionCount:Exceptions';
      } else {
        this.exportHeaders = 'due:Due,file:File,exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,exceptionCount:Exceptions';
      }
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

  markAsCompleteClick(){
    let filingName  =this.filingDetails.filingName;
    let period = this.filingDetails.period;
    let stage = 'Intake';
   this.service.markDatantakeComplete(filingName,period,stage).subscribe((resp)=>{
    this.filingService.invokeFilingDetails();
    this.showIntakeModal = false;
   }, error => {
    this.showIntakeModal = false;
    console.log("mark Intake sign off error");
  });
  }  

}