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

  tabs = 1
  constructor(private service:ClientReviewService) { }

  ngOnInit(): void {
    this.service.getfilingEntities().subscribe(res=> {
      this.rowData = res['data']      
    })
  }
  
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  rowData;

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };

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
          // headerComponentParams: {
          //   dataColumn: false,
          //   ngTemplate: this.headerTemplate,
          // },
          headerName: '',
          width: 70,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Group',
          field: 'entityGroup',
          // width: 350,
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
    console.log('GRID API: ', params);
  };


  onRowSelected(event: any): void {
    console.log('Row Selected: ', event);
  }

  receiveMessage($event) {
    this.tabs = $event
  }

}
