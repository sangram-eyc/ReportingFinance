import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { IntakeLandingService } from './../services/intake-landing.service';
import { formatDate } from '@angular/common';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { AutoUnsubscriberService, CellRendererTemplateComponent, customComparator, CustomGlobalService, ModalComponent, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { GridDataSet } from './../models/grid-dataset.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ExceptionDataGrid } from './../models/data-grid.model';
import { sortCaseInsentitve,DATA_FREQUENCY, DATA_INTAKE_TYPE, DATA_INTAKE_TYPE_DISPLAY_TEXT, FILTER_TYPE, FILTER_TYPE_TITLE, ROUTE_URL_CONST, INPUT_VALIDATON_CONFIG } from './../../config/intake-config-helpers';
import { RowClickedEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntakeRoutingStateService } from './../services/intake-routing-state.service';
import { colorSets, Color } from 'eyc-charts-shared-library';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';


@Component({
  selector: 'lib-intake-exceptions',
  templateUrl: './intake-exceptions.component.html',
  styleUrls: ['./intake-exceptions.component.scss']
})
export class IntakeExceptionsComponent implements OnInit {
  previousRoute: string;
  routeHistory: any;
  fileName: string;
  filereviewUrl: string;
  isDataIntaketype: boolean = false;
  dataIntakeTypeDisplay: object;
  dataIntakeTypeDisplayText = DATA_INTAKE_TYPE_DISPLAY_TEXT;
  dataIntakeTypeUrl: string = '';
  routeUrlConst = ROUTE_URL_CONST;
  colorSchemeAll: Color = colorSets.find(s => s.name === 'all');
  /* @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
 */

  @ViewChild('reportNameTemplate')
  reportNameTemplate: TemplateRef<any>;
  @ViewChild('chipTemplate')
  chipTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;

  @ViewChild('nextButtonTemplate')
  nextButtonTemplate: TemplateRef<any>;


  presentDate: Date;
  curDate: string;
  calSelectedMonth: string;
  form: FormGroup;
  calSelectedDate: string;
  disabledDailyMonthlyButton: boolean = false;
  dailyMonthlyStatus: boolean = false;
  ExceptionFileName: string;
  ExceptionAuditGuidName: string;
  ExceptionFileNameAlias: string;
  FILTER_TYPE_TITLE = FILTER_TYPE_TITLE;
  FILTER_TYPE = FILTER_TYPE;
  noExceptionDataAvilable: boolean;
  searchNoDataAvilable: boolean = false;
  dataExplorer = false;
  httpDataGridParams: ExceptionDataGrid;
  columnGl = [];
  glRowdata = [];
  gridApi;
  domLayout = 'autoHeight';
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  dataset: GridDataSet[] = [{
    disable: false,
    value: 10,
    name: '10',
    id: 0
  },
  {
    disable: false,
    value: 25,
    name: '25',
    id: 1
  },
  {
    disable: false,
    value: 50,
    name: '50',
    id: 2
  }];

  currentlySelectedPageSize: GridDataSet = {
    disable: false,
    value: 10,
    name: '10',
    id: 0
  };
  commentEntityType;
  moduleOriginated;
  filingStatus=true;
  showComments = false;
  commentsName;
  entityId;

  lastMonthDate: Date;
  lastMonthDueDateFormat: string;
  presentDateFormat: string;
  filingName: string;
  period: string;
  exportName:string;
  constructor(
    private unsubscriber: AutoUnsubscriberService,
    private filingService: RegulatoryReportingFilingService,
    private dataManagedService: IntakeLandingService,
    private renderer: Renderer2, private customglobalService: CustomGlobalService,
    public dialog: MatDialog,
    private _activatedroute: ActivatedRoute, private _router: Router, private routingState: IntakeRoutingStateService) {
    this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true' ? true : false;
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth());
    this.lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    this.lastMonthDueDateFormat = `${formatDate(this.lastMonthDate, 'yyyy-MM-dd', 'en')}`;
    this._activatedroute.paramMap.subscribe(params => {
      this.ExceptionFileName = params.get('paramFilename');
      this.ExceptionAuditGuidName = params.get('paramguidName');
      this.ExceptionFileNameAlias = params.get('paramfileNameAlias');
    });

  }

  ngOnInit(): void {
    this.curDate = formatDate(this.lastMonthDate, 'MMMM  yyyy', 'en');
    const selectedDate = sessionStorage.getItem("selectedDate");
    this.filingName = this.filingService.getFilingData.filingName;
    this.period = this.filingService.getFilingData.period;
    if (selectedDate) {
      this.presentDate = new Date(new Date(selectedDate).toLocaleDateString());
    } else {
      this.presentDate = this.dataManagedService.businessDate(new Date());
    }
    this.presentDateFormat = `${formatDate(this.presentDate, 'yyyy-MM-dd', 'en')}`;
    this.form = new FormGroup({
      datepicker: new FormControl({
        isRange: false,
        singleDate: {
          date: {
            year: this.presentDate.getFullYear(),
            month: this.presentDate.getMonth() + 1,
            day: this.presentDate.getDate()
          }
        }
      }, [Validators.required])
    });
    this.previousRoute = this.routingState.getPreviousUrl();
    this.routeHistory = this.routingState.getHistory();

    const routeArray = this.previousRoute.split("/");
    const routePart = routeArray[routeArray.length - 2]

    if (routePart == DATA_INTAKE_TYPE.DATA_PROVIDER || routePart == DATA_INTAKE_TYPE.DATA_DOMAIN) {
      this.isDataIntaketype = true;
      this.fileName = decodeURIComponent(routeArray[routeArray.length - 1]);
      if (routePart == DATA_INTAKE_TYPE.DATA_PROVIDER) {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_PROVIDER;
        this.dataIntakeTypeUrl = ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL + '/' + DATA_INTAKE_TYPE.DATA_PROVIDER;
      }
      else {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_DOMAIN;
        this.dataIntakeTypeUrl = ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL + '/' + DATA_INTAKE_TYPE.DATA_DOMAIN;
      }
      // let filterRoutes = this.routeHistory.filter(url => url.includes(ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL));
      // this.dataIntakeTypeUrl = filterRoutes.pop()
    }
    else if (routePart == "files" || routeArray[2] == "files") {
      let filterRoutes = this.routeHistory.filter(url => url.includes(ROUTE_URL_CONST.FILE_REVIEW_URL))
      const urlPartArray = filterRoutes.pop()?.split("/");
      const urlPart = urlPartArray? urlPartArray[urlPartArray?.length - 2]: '';
      if (urlPart == DATA_INTAKE_TYPE.DATA_PROVIDER || urlPart == DATA_INTAKE_TYPE.DATA_DOMAIN) {
        this.isDataIntaketype = true;
        this.fileName = decodeURIComponent(urlPartArray[urlPartArray.length - 1]);
        if (urlPart == DATA_INTAKE_TYPE.DATA_PROVIDER) {
          this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_PROVIDER;
          this.dataIntakeTypeUrl = ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL + '/' + DATA_INTAKE_TYPE.DATA_PROVIDER;
        }
        else {
          this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_DOMAIN;
          this.dataIntakeTypeUrl = ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL + '/' + DATA_INTAKE_TYPE.DATA_DOMAIN;
        }

      }
      else {
        this.fileName = "Files";
        this.isDataIntaketype = false;
      }
    } else if ((routeArray[routeArray.length - 1]) == "files-review") {
      this.isDataIntaketype = false;
      this.fileName = "Files";
    }
    else {
      this.isDataIntaketype = false;
      this.fileName = "Files";
    }
    let filterRoutes = this.routeHistory.filter(url => url.includes(ROUTE_URL_CONST.FILE_REVIEW_URL));
    this.filereviewUrl = filterRoutes.pop()
  }

  ngAfterViewInit(): void {
    let dueDate;
    if (sessionStorage.getItem("selectedDate")) {
      dueDate = `${formatDate(new Date(sessionStorage.getItem("selectedDate")).toLocaleDateString(), 'yyyy-MM-dd', 'en')}`;
    } else if (this.dailyMonthlyStatus) {
      dueDate = this.lastMonthDueDateFormat;
      this.patchDatePicker(this.lastMonthDate);
    } else {
      dueDate = this.presentDateFormat;
    }

    this.httpDataGridParams = {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dueDate: dueDate,
      periodType: '',
      clientName: '',
      auditFileGuidName: this.ExceptionAuditGuidName,
      fileId: '',
      fileName: this.ExceptionFileNameAlias
    };
    this.getExceptionTableData();
  }

  // Table methods
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  }

  onPasteSearchActiveReports(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");
    pastedText.forEach((ele, index) => {
      if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getExceptionTableData() {
    this.exportName = this.filingName + "_" + this.period+"_data_intake_exception_report_";
    this.dataManagedService.getExceptionTableData(this.httpDataGridParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe(resp => {
      resp['data'].length === 0 ? this.noExceptionDataAvilable = true : this.noExceptionDataAvilable = false;
      this.glRowdata = resp['data'];
      this.columnGl = [
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
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
         
          headerName: 'Exception Report Type',
          field: 'type',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 150,
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
         
          cellRendererFramework: CellRendererTemplateComponent,
          headerName: 'Exception Report Name',
          field: 'name',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 400,
          cellRendererParams: {
            ngTemplate: this.reportNameTemplate
          },
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
         
          headerName: 'Exception Report Field',
          field: 'exceptionReportField',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 220,
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        {
         
          cellRendererFramework: CellRendererTemplateComponent,
          headerName: 'Exceptions Priority Level',
          field: 'priority',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 200,
          cellRendererParams: {
            ngTemplate: this.chipTemplate,
          },
          valueGetter: function (params) {
            switch (params.data.priority) {
              case FILTER_TYPE.NO_ISSUES:
                return FILTER_TYPE_TITLE.noIssues;
              case FILTER_TYPE.LOW:
                return FILTER_TYPE_TITLE.low;
              case FILTER_TYPE.MEDIUM:
                return FILTER_TYPE_TITLE.medium;
              case FILTER_TYPE.HIGH:
                return FILTER_TYPE_TITLE.high;
              case FILTER_TYPE.MISSING_FILES:
                return FILTER_TYPE_TITLE.missingFiles;
              case FILTER_TYPE.FILE_NOT_RECIEVED:
                return FILTER_TYPE_TITLE.fileNotReceived;
              default:
                break;
            }
          },
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          }
        },
        // {
         
        //   cellRendererFramework: CellRendererTemplateComponent,
        //   cellRendererParams: {
        //     ngTemplate: this.commentTemplate,
        //   },
        //   headerName: 'Comments',
        //   field: 'comments',
        //   filter: 'agSetColumnFilter',
        //   filterParams: {
        //     buttons: ['reset']
        //   },
        //   sortable: true,
        //   menuTabs: ['filterMenuTab', 'generalMenuTab'],
        //   width: 155,
        //   cellClass: params => {
        //     return this.checkException(params) ? 'is-exception' : '';
        //   }
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
          valueGetter: function (params) {
            if (params.data.exceptionCount) {
              return (params.data.exceptionCount).toString()
            } else {
              return '--'
            }
          },
          cellClass: params => {
            return this.checkException(params) ? 'is-exception' : '';
          },
          comparator: customComparator
        },
        // {
        //  
        //   cellRendererFramework: MotifTableCellRendererComponent,
        //   headerName: '',
        //   field: 'next',
        //   sortable: false,
        //   filter: false,
        //   minWidth: 100,
        //   cellRendererParams: {
        //     ngTemplate: this.nextButtonTemplate,
        //   }
        // },
      ];
    });
  }

  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.jsDate;
    if (this.calSelectedDate) {
      this.httpDataGridParams.dueDate = `${formatDate(new Date(this.calSelectedDate).toLocaleDateString(), 'yyyy-MM-dd', 'en')}`;
      sessionStorage.setItem("selectedDate", `${this.calSelectedDate}`);
      this.getExceptionTableData();
    }
  }

  patchDatePicker(patchDatePickerValue: Date) {
    const updateDatePicker = {
      isRange: false,
      singleDate: {
        date: {
          year: patchDatePickerValue.getFullYear(),
          month: patchDatePickerValue.getMonth() + 1,
          day: patchDatePickerValue.getDate()
        }
      }
    };
    this.form.patchValue({ datepicker: updateDatePicker });
  }

 

  
  onRowClicked(event: RowClickedEvent) {
    const exceptionReportDetail = event.data.exceptionReportDetails;
    const auditRuleTyp = event.data.auditRuleTyp;
    this.dataManagedService.setExceptionReportField = event.data.exceptionReportField;
    // FDF is not sending empty array. It is sending three type of values. 
    if (exceptionReportDetail == null || exceptionReportDetail == "\"[]\"" || exceptionReportDetail == '[]') {
      return false;
    } else if (event && event.data && auditRuleTyp == "row" && event.data.auditHashId != "") {
      this.dataManagedService.setExceptionFileName = event.data.name;
      this.dataManagedService.setTableName = event.data.tableName;
      this.dataManagedService.setAuditDate = event.data.auditIngestionDate;
      this.dataManagedService.setAuditHashID = event.data.auditHashId;
      this.dataManagedService.setAuditRuleType = "row";
      this._router.navigate([ROUTE_URL_CONST.FILE_EXCEPTION_DETAILS]);
    } else if (event && event.data && (auditRuleTyp == "file" || auditRuleTyp == "table")) {
      this.dataManagedService.setExceptionFileName = event.data.name;
      this.dataManagedService.setExceptionDetails = event.data.exceptionReportDetails;
      this.dataManagedService.setAuditRuleType = "fileOrTable";
      this._router.navigate([ROUTE_URL_CONST.FILE_EXCEPTION_DETAILS]);
    } else {
      console.log("Data (exceptionReportDetails) is not getting");
      // This console is use for QA live env (RouterLink is working in local system but not in QA Env)
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
  }

  openComments(row) {
    console.log(row);
    this.commentsName = "DMS - Data Intake";
    this.commentEntityType = 'DMS Exception';
    this.entityId = row.dataSetRuleId;
    this.moduleOriginated="Data Managed Services";
    this.filingStatus=false;
    this.showComments = true;
  }

  addComment(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.dataSetRuleId,
        entityType: "DMS Exception",
        moduleOriginated: "Data Managed Services",
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
        
        // this.glRowdata[this.glRowdata.findIndex(item => item.dataSetRuleId === row.dataSetRuleId)].commentsCount = 1;
        this.commentAdded();
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
      } else {
        console.log(result);
      }
    });
  }
  commentAdded() {
    this.getExceptionTableData();
  }

  checkException(params) {
    const exceptionReportDetail = params.data.exceptionReportDetails;
    if (exceptionReportDetail == null || exceptionReportDetail == "\"[]\"" || exceptionReportDetail == '[]') {
      return false;
    } else {
      return (params && params.data && params.data.auditRuleTyp == "row" && params.data.auditHashId != "") || (params && params.data && (params.data.auditRuleTyp == "file" || params.data.auditRuleTyp == "table"))
    }
  }
}