import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { FundScopingService } from '../services/fund-scoping.service';

@Component({
  selector: 'lib-fund-scoping',
  templateUrl: './fund-scoping.component.html',
  styleUrls: ['./fund-scoping.component.scss']
})
export class FundScopingComponent implements OnInit {

  constructor(
    private fundScopingService: FundScopingService
  ) { }

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
    this.getFundsData();
  }

  onGridReady(params)  {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  getFundsData() {
    this.fundScopingService.getFilingFunds().subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.fundName,
          code: item.fundCode,
          id: item.id
        };
        this.funds.push(eachitem);
      });
      this.createFundRowData();
    });
  }

  createFundRowData() {
    this.rowData = [];
    this.funds.forEach( fund => {
      this.rowData.push({
        name: fund.name,
        id: fund.id,
        code: fund.code
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
        headerName: 'Fund name',
        field: 'name',
        sortable: true,
        filter: true,
      }
    ]; 
    // console.log('Completed Filings',this.completedFilings);
    // console.log(this.rowData);
  }

  searchFunds(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }

  onSubmitApproveFunds() {
    this.status = {
      stage: 'Fund Scoping',
      progress: 'completed'
    }
    this.approveModal = false;
    this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;

    // this.userService.addUser(obj).subscribe(resp => {
    //   this.approveModal = false;
    //   if (resp) {
    //     this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;
    //     setTimeout(() => {
    //       this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;
    //     }, 5000);
    //   }

    // }, error => {
    //   this.showToastAfterApproveFunds = !this.showToastAfterApproveFunds;
    // });
  }

}
