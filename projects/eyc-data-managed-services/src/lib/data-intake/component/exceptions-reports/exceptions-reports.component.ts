import { formatDate } from '@angular/common';
import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { LoaderService } from '@default/services/loader.service';
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
export class ExceptionsReportsComponent implements OnInit, AfterViewInit {
  gridApi;
  curDate: string;
  presentDate: Date;

  searchNoDataAvailable: boolean;

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  noCompletedDataAvailable = false;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  rowData = [];
  rowClass = 'row-style';
  columnDefs = [];
  columnDefsFill = [];
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
  exceptionTableFillData = [];
  headerColumnName = [];
  exceptionReportDetails = "";
  exceptionFileName:string="";

  constructor(private dataManagedService: DataManagedService, private elementRef: ElementRef,
    private renderer: Renderer2, private customglobalService: CustomGlobalService, public loaderService: LoaderService) {
      this.exceptionReportDetails = this.dataManagedService.getExceptionDetails;
      this.exceptionFileName = this.dataManagedService.getExceptionFileName;
      this.loaderService.show();
  }

  capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  ngAfterViewInit(): void {
    if (this.headerColumnName && this.headerColumnName.length > 0) {
      const headerColumnNameUnique = new Set(this.headerColumnName);
      headerColumnNameUnique.forEach((key) => {
        this.columnDefsFill.push({
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: key,
          field: key,
          sortable: true
        });
      });
      const multiColumnData = [];
      for (let i = 0; i < this.exceptionTableFillData.length - 1;) {
        let headerColumnNameUniqueWithValue = {};
        let headerIndex = 0;
        for (const headerColumnNameUniqueKey of headerColumnNameUnique) {
          const currentValue = this.exceptionTableFillData[i + headerIndex];
            const currentValueKey = Object.keys(currentValue);
            if (currentValueKey == headerColumnNameUniqueKey) {
              headerColumnNameUniqueWithValue[`${Object.keys(currentValue)}`] = currentValue[`${Object.keys(currentValue)}`];
            } else {
              const currentValueNoMatch = this.exceptionTableFillData[i + headerIndex - 1];
              headerColumnNameUniqueWithValue[`${Object.keys(currentValue)}`] = currentValueNoMatch[`${Object.keys(currentValue)}`];
              i++;
              break;
            }
            headerIndex++;
         }
        if(headerColumnNameUnique.size === headerIndex) {
          i = i + headerColumnNameUnique.size;
        }
        multiColumnData.push(headerColumnNameUniqueWithValue);
      }
      this.exceptionTableData = multiColumnData;
      this.columnDefs = this.columnDefsFill;
    }
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
    this.exceptionTableFillData = [];
    this.headerColumnName = []
    this.columnDefs = [];
    this.columnDefsFill = [];
    if (this.exceptionReportDetails && this.exceptionReportDetails.length > 0) {
      const str = this.exceptionReportDetails.replace(/[{}]/g, '').replace('"["', '"').replace('"]"', '"');
      const prop = str.split(',');
      prop.forEach((props) => {
        const columnName = this.capitalizeFirstLetter(props.split(':')[0].trim().replace(/"/g, ''));
        const value = props.split(':')[1].trim().replace(/"/g, '');
        this.headerColumnName.push(columnName);
        this.exceptionTableFillData.push({ [`${columnName}`]: value });
      })
    }
  }

  // Table methods
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvailable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.loaderService.hide();
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
  }
}
