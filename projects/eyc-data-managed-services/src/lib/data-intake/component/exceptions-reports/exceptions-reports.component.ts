import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { ColDef } from 'ag-grid-community';
import { DataManagedService } from '../../services/data-managed.service';

@Component({
  selector: 'lib-exceptions-reports',
  templateUrl: './exceptions-reports.component.html',
  styleUrls: ['./exceptions-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsReportsComponent implements OnInit {

  MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;

  exceptionTableData = [];
  gridApi;
  columnDefs: Array<ColDef>;

  @ViewChild('motifTable') table: ElementRef;
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

  constructor(private dataManagedService: DataManagedService) {
  }

  ngOnInit(): void {
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };

  handleGridReady = (params) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
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
        },
      ];
      this.getExceptionReportstable();
    });

  }

  getExceptionReportstable() {
    // Mock API integration for exception reports table
    this.dataManagedService.getExceptionReportstable().subscribe(data => {
      this.exceptionTableData = data.data['rowData'];
    });
  }
}
