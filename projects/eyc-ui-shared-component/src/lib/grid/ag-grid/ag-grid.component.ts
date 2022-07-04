import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  PaginationNumberFormatterParams,
  SideBarDef,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

@Component({
  selector: 'lib-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit {
  @Input() columnDefs: ColDef[] = [];
  @Input() rowData!: any[];
  @Input() displayCheckBox: any;
  @Input() paginationPageSize = 20;
  @Input() pagination = true;
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  public rowSelection = 'multiple';
  isHideCheckBox: any;
  public sideBar: SideBarDef | string | string[] | boolean | null = 'filters';
  public gridOptions:GridOptions;

  
  constructor(private http: HttpClient) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = {
      sideBar: this.sideBar,
  }
}

  onGridReady(params: GridReadyEvent) {

  }

  ngOnInit(): void {
    
   }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if(this.isHideCheckBox) {
      if (params.data) {
        const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approved === false);
        return thisIsFirstColumn;
      } else {
        if(this.rowData){
          const thisIsFirstColumn = (displayedColumns[0] === params.column) && !(this.rowData.every(item => item.approved === true));
          return thisIsFirstColumn;
        } 
      }
    } else {
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return thisIsFirstColumn;
    }
  }

  public paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };
}