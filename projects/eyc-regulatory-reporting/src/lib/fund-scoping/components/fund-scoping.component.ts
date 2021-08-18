import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { FundScopingService } from '../services/fund-scoping.service';
import {INPUT_VALIDATON_CONFIG} from '../../config/rr-config-helper';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import {customComparator} from '../../config/rr-config-helper';

@Component({
  selector: 'lib-fund-scoping',
  templateUrl: './fund-scoping.component.html',
  styleUrls: ['./fund-scoping.component.scss']
})
export class FundScopingComponent implements OnInit {

  constructor(
    private fundScopingService: FundScopingService,
    private filingService: RegulatoryReportingFilingService
  ) { }

  filingDetails: any;
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
  rowClass = 'row-style';
  domLayout = 'autoHeight';
  @ViewChild('headerFundsTemplate')
  headerFundsTemplate: TemplateRef<any>;
  @ViewChild('dropdownFundsTemplate')
  dropdownFundsTemplate: TemplateRef<any>;
  funds: any[] = [];

  ngOnInit(): void {
    
  }

  onGridReady(params)  {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  getFundsData() {
    this.fundScopingService.getFundScopingDetails(this.filingDetails.filingName, this.filingDetails.period).subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.fundName,
          code: item.fundCode,
          id: item.fundId,
          adviser: item.adviser,
          businessUnit: item.businessUnit,
          filerType: item.filerType
        };
        this.funds.push(eachitem);
      });
      this.createFundRowData();
      this.fundScopingService.getFundScopingStatus(this.filingDetails.filingId).subscribe(resp => {
        this.fundScopingStatus = resp['data'];
        console.log('FUND SCOPING STATUS', this.fundScopingStatus);
      });
    },error=>{
      this.funds= [];
      this.rowData =[];
      console.log("FUnd Scoping error");
    });
    
  }

  receiveFilingDetails(event) {
    this.filingDetails = event;
    this.getFundsData();
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
    this.rowData = [];
    this.funds.forEach( fund => {
      this.rowData.push({
        name: fund.name,
        id: fund.id,
        code: fund.code,
        adviser: fund.adviser,
        businessUnit: fund.businessUnit,
        filerType: fund.filerType
      })
    });
    this.columnDefs = [
      {
        headerName: 'Action',
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.dropdownFundsTemplate,
        },
        field: 'template',
        minWidth: 43,
        width: 85,
        maxWidth: 85,
        sortable: false,
        cellClass: 'actions-button-cell',
        pinned: 'left'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'ID',
        field: 'id',
        sortable: true,
        filter: true,
        resizeable: true,
        maxWidth: 140
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Code',
        field: 'code',
        sortable: true,
        filter: true,
        maxWidth: 140
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Entity name',
        field: 'name',
        sortable: true,
        filter: true,
        sort:'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Adviser',
        field: 'adviser',
        sortable: true,
        filter: true,
        sort:'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Business Unit',
        field: 'businessUnit',
        sortable: true,
        filter: true,
        sort:'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Filing Type',
        field: 'filerType',
        sortable: true,
        filter: true,
        sort:'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true
      }
    ]; 
  }

  searchFunds(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }

  onSubmitApproveFunds() {
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

}
