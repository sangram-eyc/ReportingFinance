import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RegulatoryReportingFilingService } from '../services/regulatory-reporting-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { customComparator } from '../../config/rr-config-helper';
import { CustomGlobalService, ErrorModalComponent, PermissionService, AutoUnsubscriberService, DEFAULT_PAGE_SIZE } from 'eyc-ui-shared-component';
import { OAuthService } from 'angular-oauth2-oidc';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';


@Component({
  selector: 'lib-regulatory-reporting-filing',
  templateUrl: './regulatory-reporting-filing.component.html',
  styleUrls: ['./regulatory-reporting-filing.component.scss'],
  providers: [AutoUnsubscriberService]
})
export class RegulatoryReportingFilingComponent implements OnInit, OnDestroy {

  tabIn;
  exportHeaders: string;
  exportURL;
  loaded :boolean=false;
  constructor(
    private route: ActivatedRoute,
    private filingService: RegulatoryReportingFilingService,
    private customglobalService: CustomGlobalService,
    private oauthservice: OAuthService,
    public permissions: PermissionService,
    public dialog: MatDialog,
    private router: Router,
    private unsubscriber: AutoUnsubscriberService,
    private settingsService: EycRrSettingsService
  ) { }

  activeFilings: any[] = [];
  activeReports: any[] = []
  completedFilings: any[] = [];
  filingResp: any[] = [];

  noOfCompletdFilingRecords = 10;
  maxPages = 5;
  searchNoDataAvilable = false;
  activeReportsSearchNoDataAvilable = false;
  noCompletedDataAvilable = false;
  noActivatedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData = [];
  rowClass = 'row-style';
  columnDefs;
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  @ViewChild('filingNameTemplate')
  filingNameTemplate: TemplateRef<any>;
  @ViewChild('dueDateTemplate')
  dueDateTemplate: TemplateRef<any>;
  @ViewChild('completedDateTemplate')
  completedDateTemplate: TemplateRef<any>;
  pageChangeFunc;

  dataset = [{
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
  currentlySelectedPageSize = {
    disable: false,
    value: 10,
    name: '10',
    id: 0
  };

  currentPage = 0;
  totalRecords = 5;
  pageSize = DEFAULT_PAGE_SIZE;
  filter = '';
  sort = '';
  filterName='';

  ngOnInit(): void {
    sessionStorage.getItem("regReportingLandingpageTab") ? this.tabIn = sessionStorage.getItem("regReportingLandingpageTab") : this.tabIn = 1;
    this.getActiveFilingsData();
    this.pageChangeFunc = this.onPageChange.bind(this);
    this.route.queryParams.subscribe(res => {
      if (res && res.open_comments_panel) {
        this.router.navigate(['/regulatory-reporting']);
      }
    });
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
    if (this.tabIn == 2) {
      this.filter = '';
      this.getCompletedFilingsData(true);
    }
    else{
      this.filterName='';
      this.getActiveFilingsData();
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    sessionStorage.removeItem("enableTabsIntake");
    sessionStorage.removeItem("regReportingLandingpageTab");
  }


  getActiveFilingsData() {
    this.filingService.getFilings().pipe(this.unsubscriber.takeUntilDestroy).subscribe(resp => {
      this.filingResp.push(resp);
      resp['data'].length === 0 ? this.noActivatedDataAvilable = true : this.noActivatedDataAvilable = false;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.filingName,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: [],
          status: item.filingStatus,
          filingName: item.filingName,
          period: item.period,
          filingId: item.filingId,
          totalFunds: item.totalFunds
        };
        this.activeFilings.push(eachitem);
        // this.activeReports.push(eachitem);
      });
      this.activeFilings = this.customglobalService.sortFilings(this.activeFilings)
      this.activeReports = this.activeFilings;
    }, error => {
      if (error['errorCode'].includes('RR-0023')) {
        this.errorModalActiveFiling(error);
      }
    });
  }

  resetData() {
    this.createHistoryRowData();
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
  }

  getCompletedFilingsData(resetData = false) {
    this.sort = resetData ? 'filingName:true' : this.sort;
    this.filingService.getFilingsHistory(this.currentPage, this.pageSize,this.sort,this.filter).pipe(this.unsubscriber.takeUntilDestroy).subscribe(resp => {
      const data = [];
      resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.filingName + ' // ' + item.period,
          filingId: item.filingId,
          filingName: item.filingName,
          period: item.period,
          comments: [],
          dueDate: item.dueDate,
          startDate: item.startDate,
          status: item.filingStatus,
          totalFunds: item.totalFunds,
          subDate: '-',
          exceptions: 0,
          resolved: 0,
          completedDate: item.completedDate,
          completedBy: item.completedBy
        };
        data.push(eachitem);
      });
      this.rowData = data;
      console.log('REPORT HISTORY ROW DATA', this.rowData);
      // this.completedFilings = resp['data'];
      this.totalRecords = resp['totalRecords'];
      // this.rowData = this.completedFilings;
      if (resetData) {
        this.resetData();
      } else {
        this.gridApi.setRowData(this.rowData);
      }
      // this.updateData();
      // if(!this.loaded){
      //   this.createHistoryRowData();
      //   this.loaded=true;
      // }
    })
  }

  sortChanged(event) {
    this.sort = event;
    this.getCompletedFilingsData();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.getCompletedFilingsData(true);
  }

  currentPageChange(event) {
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    console.log('CURRENT PAGE SIZE', event);
    this.pageSize = event;
    this.getCompletedFilingsData();
  }

  disableComparator(data1, data2) {
    return 0; 
  }

  createHistoryRowData() {

    this.columnDefs = [];
    this.completedFilings = [];
    setTimeout(() => {
      this.columnDefs = [
        {
          headerName: '',
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'template',
          minWidth: 43,
          width: 43,
          sortable: false,
          cellClass: 'actions-button-cell',
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.filingNameTemplate,
          },
          headerName: 'Filing Report Name',
          field: 'filingName',
          sortable: true,
          filter: true,
          resizeable: true,
          minWidth: 300,
          sort: 'asc',
          wrapText: true,
          autoHeight: true,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Filing period',
          field: 'period',
          sortable: true,
          filter: true,
          resizeable: true,
          minWidth: 200,
          comparator: this.disableComparator
        },

        // Change for User story 288907 and keep this commented code for future US requirement -->

        // {
        //   headerComponentFramework: TableHeaderRendererComponent,
        //   cellRendererFramework: MotifTableCellRendererComponent,
        //   headerName: 'Comments',
        //   field: 'comments',domLayout
        //   sortable: true,
        //   filter: true,
        //   minWidth: 140,
        //   cellRendererParams: {
        //       ngTemplate: this.commentTemplate,
        //     }
        // },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Total entities',
          field: 'totalFunds',
          sortable: true,
          filter: true,
          minWidth: 180,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dueDateTemplate,
          },
          headerName: 'Due date',
          field: 'dueDate',
          sortable: true,
          filter: true,
          minWidth: 180,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Submission date',
          field: 'subDate',
          sortable: true,
          filter: true,
          minWidth: 180,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.completedDateTemplate,
          },
          headerName: 'Date marked complete',
          field: 'completedDate',
          sortable: true,
          filter: true,
          minWidth: 300,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Marked completed by',
          field: 'completedBy',
          sortable: true,
          filter: true,
          minWidth: 300,
          comparator: this.disableComparator
        }

        // Change for User story 288907 and keep this commented code for future US requirement -->
        // {
        //   headerComponentFramework: TableHeaderRendererComponent,
        //   headerName: 'Exceptions',
        //   field: 'exceptions',
        //   sortable: true,
        //   filter: true,
        //   minWidth: 140
        // },
        // {
        //   headerComponentFramework: TableHeaderRendererComponent,
        //   headerName: 'Resolved',
        //   field: 'resolved',
        //   sortable: true,
        //   filter: true,
        //   minWidth: 140
        // },
      ];
      // this.updateData();
      this.completedFilings = this.rowData;
    }, 1);
  }

  searchActiveReports(input) {
    this.activeFilings = this.activeReports.filter(item => item.name.toLowerCase().indexOf((input.el.nativeElement.value).toLowerCase()) !== -1)
    this.activeReportsSearchNoDataAvilable = !!(this.activeFilings.length === 0);
  }

  onPasteSearchActiveReports(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");
    pastedText.forEach((ele, index) => {
      if (/[A-Za-z0-9\-\_:/ ]+/.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  }

  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[A-Za-z0-9\-\_:/ ]+/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // sortByDueDate(a, b) {
  //   let date1 = new Date(a.dueDate)
  //   let date2 = new Date(b.dueDate)
  //   if (date1 > date2) {
  //     return 1;
  //   } else if (date1 < date2) {
  //     return -1;
  //   } else {
  //     let filing1 = a.filingName.toLowerCase();
  //     let filing2 = b.filingName.toLowerCase();
  //     if (filing1 > filing2) {
  //       return 1;
  //     } else if (filing1 < filing2) {
  //       return -1;
  //     } else {
  //     console.log(a, b);
  //     return 0;
  //     }
  //   }
  // }

  formatDate(timestamp) {
    let due = new Date(timestamp);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    return newdate;
  }

  isFirstColumn(params) {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
    this.getCompletedFilingsData();
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
    this.getCompletedFilingsData();
  }

  routeToViewFiling(row) {
    console.log(row);
    this.filingService.setfilingData = row;
    if (this.permissions.validatePermission('Submission', 'View Submission')) {
      this.router.navigate(['/submission']);
    } else {
      for (let i = row.status.length - 1; i >= 0; i--) {
        if (this.permissions.validatePermission(this.preapreStage(row.status[i].stageCode), this.preapreViewFeature(row.status[i].stageCode))) {
          this.preapreRouting(row.status[i].stageCode);
          return;
        }
        if (i === 0) {
          this.errorModalPopup();
        }
      }
    }
  }

  preapreStage(stageCode) {
    switch (stageCode) {
      case "FUND_SCOPING": return 'Fund Scoping';
      case "DATA_INTAKE": return 'Data Intake';
      case "REPORTING": return 'Reporting';
      case "CLIENT_REVIEW": return 'Client Review';
      case "SUBMISSION": return 'Submission';
    }
  }

  preapreViewFeature(stageCode) {
    switch (stageCode) {
      case "FUND_SCOPING": return 'View Fund Scoping';
      case "DATA_INTAKE": return 'View Data Intake';
      case "REPORTING": return 'View Reporting';
      case "CLIENT_REVIEW": return 'View Client Review';
      case "SUBMISSION": return 'View Submission';
    }
  }

  preapreRouting(stageCode) {
    switch (stageCode) {
      case "FUND_SCOPING":
        this.router.navigate(['/fund-scoping']);
        break;
      case "DATA_INTAKE":
        this.router.navigate(['/data-intake']);
        break;
      case "REPORTING":
        this.router.navigate(['/regulatory-reporting']);
        break;
      case "CLIENT_REVIEW":
        this.router.navigate(['/client-review']);
        break;
      case "SUBMISSION":
        this.router.navigate(['/submission']);
    }
  }

  errorModalPopup() {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: "Access Denied",
        description: "You do not have access to view the filing. Please contact an administrator.",
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  errorModalActiveFiling(errorMessage) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {

      disableClose: true,
      width: '400px',
      data: {
        header: errorMessage['errorCode'],
        description: errorMessage['message'],
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  exportReportHistoryData() {
    this.exportHeaders = '';
    this.exportHeaders = 'filingName:Filing Report Name,period:Filing period,totalFunds:Total entities,dueDate:Due date,subDate:Submission date,completedDate:Date marked complete,completedBy:Marked completed by';
    this.exportURL = this.settingsService.regReportingFiling.filing_history  +  "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    console.log("export URL > ", this.exportURL);
    this.filingService.exportReportsHistory(this.exportURL).subscribe(resp => {
      console.log(resp);
    })
  }

    onPageChange() {
      this.getCompletedFilingsData();
    }

    handleGridReady(params) {
      this.gridApi = params.api;
    }

    updateData(){
      let data=[];
      this.completedFilings.forEach(filing => {
        data.push({
          name: filing.filingName + ' // ' + filing.period,
          filingId: filing.filingId,
          filingName: filing.filingName,
          period: filing.period,
          comments: [],
          dueDate: filing.dueDate,
          startDate: filing.startDate,
          status: filing.filingStatus,
          totalFunds: filing.totalFunds,
          subDate: '-',
          exceptions: 0,
          resolved: 0,
          completedDate: filing.completedDate,
          completedBy: filing.completedBy
        })
      });
      this.rowData = data;
    }

}
