import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ClientReviewService } from '../services/client-review.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';

@Component({
  selector: 'lib-client-review',
  templateUrl: './client-review.component.html',
  styleUrls: ['./client-review.component.scss']
})
export class ClientReviewComponent implements OnInit {

  filingDetails:any;
  constructor(private service: ClientReviewService) { }

  tabs = 1;
  selectedRows = [];
  approveFilingEntitiesModal = false;
  showToastAfterApproveFilingEntities = false;

  status = {
    stage: 'Client Review',
    progress: 'in-progress'
  };

  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  rowData = [];

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

  ngOnInit(): void {
    
  }

  getFilingEntities(){
    this.service.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
    });
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approve === false);
      return thisIsFirstColumn;
    } else {
      const thisIsFirstColumn = (displayedColumns[0] === params.column)  && !(this.rowData.every(item => item.approve === true));
      return thisIsFirstColumn;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columnDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'template',
          headerName: '',
          width: 70,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Group',
          field: 'entityGroup',
          sortable: true,
          filter: true,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Name',
          field: 'entityName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 300
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Resolved/Exception',
          field: 'resolve_exception',
          sortable: true,
          filter: true,
          width: 210,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Review Level',
          field: 'reviewLevel',
          sortable: true,
          filter: true,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'My Tasks',
          field: 'myTasks',
          sortable: true,
          filter: true,
          width: 140
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Comments',
          field: 'comments',
          sortable: true,
          filter: true,
          width: 155
        },
      ];
    });
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  onRowSelected(event: any): void {
    this.selectedRows = this.gridApi.getSelectedRows();
  }

  receiveMessage($event) {
    this.tabs = $event;
  }

  receiveFilingDetails(event) {
    this.filingDetails = event;
    this.getFilingEntities();
  }

  onSubmitApproveFilingEntities() {
    // let selectedFiling = {
    //   "entityIds": this.selectedRows.map(({ entityId }) => entityId),
    //   "filingName": this.filingDetails.filingName,
    //   "period": this.filingDetails.period,
    //   "stage": "Client review"
    // };
    // this.service.approvefilingEntities(selectedFiling).subscribe(res => {
    //   res['data'].forEach(ele => {
    //     this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approve = true;
    //   });
    //   this.ngAfterViewInit();
    //   this.selectedRows = [];
    //   if (this.rowData.every(item => item.approve === true)) {
    //     this.status = {
    //       stage: 'Submission',
    //       progress: 'in-progress'
    //     };
    //   }
    //   this.approveFilingEntitiesModal = false;
    //   this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    //   setTimeout(() => {
    //     this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    //   }, 5000);
    // });

    this.selectedRows.forEach(ele => {
      this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approve = true;
    });
    this.ngAfterViewInit();
    this.selectedRows = [];
    if (this.rowData.every(item => item.approve === true)) {
      this.status = {
        stage: 'Submission',
        progress: 'in-progress'
      };
    }
    this.approveFilingEntitiesModal = false;
    this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    setTimeout(() => {
      this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    }, 5000);
  }
}
