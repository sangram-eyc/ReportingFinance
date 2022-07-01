import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
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

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  public rowSelection = 'multiple';
  
  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {

  }

  ngOnInit(): void {
  }

}