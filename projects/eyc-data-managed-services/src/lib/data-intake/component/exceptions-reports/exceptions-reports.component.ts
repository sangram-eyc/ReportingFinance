import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'lib-exceptions-reports',
  templateUrl: './exceptions-reports.component.html',
  styleUrls: ['./exceptions-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsReportsComponent implements AfterViewInit {

  MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;

  gridApi;
  columnDefs1: Array<ColDef>;
  rowData;
  rowData4;
  frameworkComponents;

  @ViewChild('motifTable') table: ElementRef;
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

  constructor () {
this.frameworkComponents = {
  
};
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
console.log(
  'Template Reference: ',
  this.headerTemplate,
  this.dropdownTemplate
);
setTimeout(() => {
  this.columnDefs1 = [
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

 

  this.rowData = [
    {
      type: 'Valuation',
      exposure: 'Listed Equity',
      classification: 'Financial',
      category: 'DiffLVL',
	    value: "(64,27,000)",
	    variance: "2.47%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity',
      classification: 'Non-financial',
      category: 'DiffLVL',
	    value: "(4,27,000)",
	    variance: "2.47%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity',
      classification: 'Financial',
      category: 'DiffLVL',
	    value: "(4,02,000)",
	    variance: "0.47%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity',
      classification: 'Non-financial',
      category: 'DiffLVL',
	    value: "(4,56,000)",
	    variance: "0.87%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity',
      classification: 'Non-financial',
      category: 'DiffLVL',
	    value: "(3,70,000)",
	    variance: "0.37%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity Derivatives',
      classification: 'Financial',
      category: 'DiffLVL',
	    value: "(2,27,000)",
	    variance: "0.10%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity Derivatives',
      classification: 'Non-financial',
      category: 'DiffLVL',
	    value: "(3,43,000)",
	    variance: "0.37%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity Derivatives',
      classification: 'Financial',
      category: 'DiffLVL',
	    value: "(2,27,000)",
	    variance: "0.56%",
    },
    {
      type: 'Valuation',
      exposure: 'Listed Equity Derivatives',
      classification: 'Financial',
      category: 'DiffLVL',
	    value: "(5,23,000)",
	    variance: "0.87%",
    },
  ];
});
  
  }
}
