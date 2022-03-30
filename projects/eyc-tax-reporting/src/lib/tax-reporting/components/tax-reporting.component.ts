import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ManagementReportsService } from '../services/management-reports.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { InformationBarChartModalComponent } from '../information-bar-chart-modal/information-bar-chart-modal.component'
import { CustomGlobalService } from 'eyc-ui-shared-component';
import { ProductionCycleService } from '../services/production-cycle.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'lib-tax-reporting',
  templateUrl: './tax-reporting-component.html',
  styleUrls: ['./tax-reporting-component.scss']
})
export class TaxReportingComponent implements OnInit {

  tabIn;
  constructor(
    private reportService: ManagementReportsService,
    private customglobalService: CustomGlobalService,
    private productcyclesService: ProductionCycleService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  nameReport: string = 'Client ABC, Inc.';
  activeReport: any[] = [];
  activeReports: any[] = []
  completedReports: any[] = [];
  reportResp: any[] = [];

  noOfCompletdFilingRecords = 10;
  currentPage = 0;
  maxPages = 5;
  searchNoDataAvilable = false;
  activeReportsSearchNoDataAvilable = false;
  noCompletedDataAvilable = false;
  noActivatedDataAvilable = false;
  calledProductCyclesList = false;
  calledManagementReport = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData;
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
  @ViewChild('productTemplate')
  productTemplate: TemplateRef<any>;
  @ViewChild('statusTracker')
  statusTracker: TemplateRef<any>;
  @ViewChild('totalFunds')
  totalFunds: TemplateRef<any>;
  @ViewChild('cycleStatus')
  cycleStatus: TemplateRef<any>;

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
    value: 20,
    name: '20',
    id: 0
  };

  dataToChart: any[] = [];
  widthDivChart: number;
  colorsBarChart: string[] = [];
  labelsChart: string[] = [];
  statusIndicatorEv: any;


  ngOnInit(): void {
    this.widthDivChart = 950;
    this.colorsBarChart = ['#9C82D4', '#87D3F2', '#8CE8AD'];
    this.labelsChart = ['In EY tax preparation', 'In client review', 'Approved by client'];
    this.tabIn = 1;
    this.getCompletedProductCyclesData();
    this.statusIndicatorEv = setInterval(this.statusIndicatorEvclick.bind(this), 500);
  }

  statusIndicatorEvclick() {
    const cycleStatusBtn = document.getElementById('cycle-status-indicator-id');
    if (cycleStatusBtn != undefined) {
      cycleStatusBtn.setAttribute('style', 'display:flex')
      window.clearInterval(this.statusIndicatorEv)
      const clicks = fromEvent(cycleStatusBtn, 'click')
        .subscribe((event: MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
          this.openDialog();
        });
    }
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
    if (selectedTab == 1) {
      this.getCompletedProductCyclesData();
    }
    else if (selectedTab == 2) {
      this.getActiveFilingsData();
    }
  }

  getActiveFilingsData() {
    if (this.calledManagementReport === false) {
      this.calledManagementReport = true;
      this.activeReport = [];
      this.reportService.reportsData().subscribe(resp => {
        this.reportResp.push(resp);
        this.reportResp[0].data.length === 0 ? this.noActivatedDataAvilable = true : this.noActivatedDataAvilable = false;
        this.reportResp[0].data.forEach((item) => {
          const eachitem: any = {
            name: item.name,
            author: item.author,
            createdDate: item.createdDate,
            downloadUrl: item.downloadUrl
          };
          this.activeReport.push(eachitem);
          this.activeReports.push(eachitem);
        });
        this.activeReport = this.customglobalService.sortFilings(this.activeReport)
        this.createHistoryRowData();
      });
    }
  }

  getCompletedProductCyclesData() {
    if (this.calledProductCyclesList === false) {
      this.calledProductCyclesList = true;
      this.completedReports = [];
      this.productcyclesService.getProductionCycles().subscribe(resp => {
        resp['data'].length === 0 ? this.noCompletedDataAvilable = true : this.noCompletedDataAvilable = false;
        resp['data'].forEach((item) => {
          const eachitem: any = {
            name: item.name,
            id: item.id/* ,
            totalFunds: item.totalFunds,
            valor1: item.valor1,
            valor2: item.valor2,
            valor3: item.valor3,
            dataToChart: [
              {
                "in EY tax preparation": item.valor1,
                "in client review": item.valor2,
                "Approved by client": item.valor3,
              }
            ] */
          };
          this.completedReports.push(eachitem);
        });
        this.createHistoryRowData();
      });
    }
  }

  createHistoryRowData() {
    this.rowData = [];
    this.completedReports.forEach(filing => {
      this.rowData.push({
        name: filing.name,
        id: filing.id/* ,
        totalFunds: filing.totalFunds,
        valor1: filing.valor1,
        valor2: filing.valor2,
        valor3: filing.valor3,
        dataToChart: [
          {
            "in EY tax preparation": filing.valor1,
            "in client review": filing.valor2,
            "Approved by client": filing.valor3,
          }
        ] */
      })
    });
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.productTemplate,
        },
        headerName: 'Production cycle name',
        field: 'name',
        sortable: true,
        filter: true,
        resizeable: true,
        width: 500,
        sort: 'asc'
      },
/*       {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.totalFunds,
        },
        headerName: 'Total funds',
        field: 'name',
        sortable: true,
        filter: false,
        resizeable: true,
        width: 200,
        sort: 'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.cycleStatus,
        },
        headerName: "Cycle status indicator",
        field: "name",
        sortable: false,
        width: 400
      }, */
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.statusTracker,
        },
        headerName: 'Status tracker',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 500
      }
    ];
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

  getProdCycleDetail(row) {
    console.log("Show details->", row)
    this.router.navigate(['cycle-details', row.id, row.name]);
  }

  getStatusTracker(row) {
    let urlStatusTracker = '';
    this.productcyclesService.getStatusTrackerLink(row.id).subscribe(resp => {
      console.log("data Url-->", resp);
      urlStatusTracker = resp['data'].webUrl;
      window.open(urlStatusTracker);
    });
  }

  public openDialog(): void {
    const documentSaveDialogRef = this.dialog.open(InformationBarChartModalComponent, {
      id: 'info-modal',
      width: '600px',
      data: {
        header: "Information for cycle status indicator",
        description: "You can hover over each bar in the graph to see the progress. The below legend shows what stage the funds are in.",
        footer: {
          style: "start",
          YesButton: "Save",
          NoButton: "Close"
        }
      }
    });

    documentSaveDialogRef.afterClosed().subscribe(result => {
      if (!result)
        window.close()
    });
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  searchGrid(input){
    this.gridApi.setQuickFilter(input);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }
}
