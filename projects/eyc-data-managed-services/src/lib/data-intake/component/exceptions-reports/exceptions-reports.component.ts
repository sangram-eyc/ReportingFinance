import { formatDate } from '@angular/common';
import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { ColDef } from 'ag-grid-community';
import { CustomGlobalService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { GridDataSet } from '../../models/grid-dataset.model';
import { DataManagedService } from '../../services/data-managed.service';

@Component({
  selector: 'lib-exceptions-reports',
  templateUrl: './exceptions-reports.component.html',
  styleUrls: ['./exceptions-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsReportsComponent implements OnInit {
  gridApi;
  curDate: string;
  presentDate: Date;

  searchNoDataAvilable: boolean;

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  noCompletedDataAvilable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  rowData = [];
  rowClass = 'row-style';
  columnDefs = [];
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';
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
  exceptionTableData = [];

  constructor(private dataManagedService: DataManagedService, private elementRef: ElementRef,
    private renderer: Renderer2, private customglobalService: CustomGlobalService) {
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
    this.getActiveFilingsData();
  }

  // Table methods
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
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

  getActiveFilingsData() {
    this.dataManagedService.getExceptionReportstable().subscribe(resp => {
      this.columnDefs = [
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Type',
          field: 'type',
          sortable: true
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Exposure',
          field: 'exposure',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Classification',
          field: 'classification',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Category',
          field: 'category',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Value',
          field: 'value',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Variance',
          field: 'variance',
          sortable: true,
        }
      ];
      this.exceptionTableData = resp['data']['rowData'];
    });
  }

}
