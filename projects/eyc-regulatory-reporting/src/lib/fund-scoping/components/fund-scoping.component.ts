import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { FundScopingService } from '../services/fund-scoping.service';
import {INPUT_VALIDATON_CONFIG} from '../../config/rr-config-helper';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { PermissionService, DEFAULT_PAGE_SIZE, customComparator } from 'eyc-ui-shared-component';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';
import { EycRrSettingsService } from './../../services/eyc-rr-settings.service';
import { letProto } from 'rxjs-compat/operator/let';
import { CellRendererTemplateComponent } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-fund-scoping',
  templateUrl: './fund-scoping.component.html',
  styleUrls: ['./fund-scoping.component.scss'],
  providers: [AutoUnsubscriberService]
})
export class FundScopingComponent implements OnInit {
  filingName: string;

  constructor(
    private fundScopingService: FundScopingService,
    private filingService: RegulatoryReportingFilingService,
    public permissions: PermissionService,
    private unsubscriber: AutoUnsubscriberService,
    private settingsService: EycRrSettingsService
  ) { }

  filingDetails: any;
  selectedRows = [];
  exportURL;
  exportHeaders;
  fundScopingStatus = null;
  searchNoDataAvilable = false;
  approveModal = false;
  showToastAfterApproveFunds = false;
  status = {
    stage: 'Fund Scoping',
    progress: 'in-progress'
  };

  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData;
  columnDefs;
  columnDefsAgGrid=[];
  onSubmitApproveFund;
  currentPage = 0;
  totalRecords = 5;
  pageSize = DEFAULT_PAGE_SIZE;
  filter = '';
  sort = '';
  pageChangeFunc;
  scopingRowData = [];
  rowClass = 'row-style';
  domLayout = 'autoHeight';
  fundScopingModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve all",
      description: "Are you sure you want to approve all entities?",
      footer: {
        style: "start",
        YesButton: "Yes",
        NoButton: "No"
      }
    }
  };
  @ViewChild('headerFundsTemplate')
  headerFundsTemplate: TemplateRef<any>;
  @ViewChild('dropdownFundsTemplate')
  dropdownFundsTemplate: TemplateRef<any>;
  funds: any[] = [];

  ngOnInit(): void {
    this.onSubmitApproveFund = this.onSubmitApproveFunds.bind(this);
    this.pageChangeFunc = this.onPageChange.bind(this);
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  onPageChange() {
    this.getFundsData();
  }

  disableComparator(data1, data2) {
    return 0; 
  }

  currentPageChange(event) {
    console.log('CURRENT PAGE CHANGE', event - 1);
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    console.log('CURRENT PAGE SIZE', event);
    this.pageSize = event;
    this.getFundsData();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.getFundsData(true);
  }

  sortChanged(event) {
    this.sort = event;
    this.getFundsData();
  }

  resetData() {
    this.createFundRowData();
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
  }

  getFundsData(resetData = false) {
    this.funds = [];
    this.sort = resetData ? 'fundName:true' : this.sort;
    this.fundScopingService.getFundScopingDetails(this.getFillingCompletedStatus(),this.filingDetails.filingName, this.filingDetails.period).pipe(this.unsubscriber.takeUntilDestroy).subscribe(resp => {
      this.totalRecords = resp['totalRecords'];
      this.rowData = resp['data'];
      if (resetData) {
        this.resetData();
      } else {
        this.gridApi.setRowData(this.rowData);
      }
      this.fundScopingService.getFundScopingStatus(this.filingDetails.filingId).pipe(this.unsubscriber.takeUntilDestroy).subscribe(resp => {
        this.fundScopingStatus = resp['data'];
        console.log('FUND SCOPING STATUS', this.fundScopingStatus);
      });
    },error=>{
      this.funds= [];
      this.rowData =[];
      console.log("FUnd Scoping error");
    });
    this.filingName = this.filingDetails.filingName +"_"+this.filingDetails.period+"_Fund Scoping_"
  }

  receiveFilingDetails(event) {
    this.filingDetails = event;
    this.getFundsData(true);
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

  onPasteSearchValidation(event: ClipboardEvent) {
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
  createFundRowData() {
    this.columnDefs = [];
    this.scopingRowData = [];
    this.columnDefsAgGrid =[
      {
     /*  headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true, */
      valueGetter: "node.rowIndex + 1",
      getQuickFilterText: function(params) {
        return '';
      },
      maxWidth: 80,
      sortable: false,
      menuTabs: [],
      pinned: 'left'
      },
      {
      headerName: 'Action',
      field: 'Actions',
      maxWidth: 110,
      cellRendererFramework: CellRendererTemplateComponent,
      cellRendererParams: {
        ngTemplate: this.dropdownFundsTemplate,
      },
      menuTabs: ['generalMenuTab'],
    },
    {
      headerName: 'ID',
      field: 'fundId',
      comparator: customComparator,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      filterParams: {
        buttons: ['reset']
      },
      sortable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
    },
    {
      headerName: 'Code',
      field: 'fundCode',
      minWidth: 150,
      filter: 'agSetColumnFilter',
      filterParams: {
        buttons: ['reset']
      },
      sortable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
    },
    {
      headerName: 'Entity name',
      field: 'fundName',
      minWidth: 250,
      filter: 'agSetColumnFilter',
      filterParams: {
        buttons: ['reset']
      },
      sortable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
    },
    {
      headerName: 'Adviser',
      field: 'adviser',
      minWidth: 150,
      filter: 'agSetColumnFilter',
      filterParams: {
        buttons: ['reset']
      },
      sortable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
    },
    {
      headerName: 'Business Unit',
      field: 'businessUnit',
      minWidth: 250,
      filter: 'agSetColumnFilter',
      filterParams: {
        buttons: ['reset']
      },
      sortable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
    },
    {
      headerName: 'Filing Type',
      field: 'filerType',
      minWidth: 200,
      filter: 'agSetColumnFilter',
      filterParams: {
        buttons: ['reset']
      },
      sortable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
    }]
    this.scopingRowData = this.rowData;
  }

  searchFunds(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }

  onSubmitApproveFunds() {

    // console.log("selected rows > ",  this.selectedRows);
    const approveInfo = {
      filingId: this.filingDetails.filingId,
      stageId: this.fundScopingStatus[0].stageId
    }
    this.fundScopingService.approveFundScopingStatus(approveInfo).subscribe(resp => {
      const data = resp;
      this.status = {
        stage: 'Intake',
        progress: 'in-progress'
      }
      this.fundScopingStatus[0].progress = 'Completed';
      this.filingService.invokeFilingDetails();
      this.approveModal = false;
      this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;
          setTimeout(() => {
            this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;
          }, 5000);
    })
    // this.status = {
    //   stage: 'Intake',
    //   progress: 'in-progress'
    // }
    // this.fundScopingStatus[0].progress = 'Completed';
    // this.approveModal = false;
    // this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;
    //     setTimeout(() => {
    //       this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;
    //     }, 5000);
  }

  getFillingCompletedStatus(){
    let filingCompletedStatus = this.filingService.checkFilingCompletedStatus(this.filingDetails);
    let filingStatus = filingCompletedStatus ? 'completed' :'active'
    return filingStatus
  }

  approveRowsSelected(event) {
    console.log("selctedq > ", this.selectedRows);
    this.selectedRows = event;
  }

  exportScopeData() {
  this.exportHeaders = 'fundId:ID,fundCode:Code,fundName:Entity name,adviser:Adviser,businessUnit:Business Unit,filerType:Filing Type'
  this.exportURL =  this.settingsService.regReportingFiling.fund_scoping_details+ "fundScopingFilingStatus="+ this.getFillingCompletedStatus() + "&filingName=" + this.filingDetails.filingName + "&period=" + this.filingDetails.period + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
  console.log("exportRequestDetails > ", this.exportURL);

  this.fundScopingService.exportScopeData(this.exportURL).subscribe(resp => {
    console.log(resp);
  })

  }

}
