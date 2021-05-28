import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SubmissionService } from '../../submission/services/submission.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';



@Component({
  selector: 'lib-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {


  constructor(private service:SubmissionService) { }

  ngOnInit(): void {
    this.service.getXmlFilesList().subscribe(res=> {
      this.rowData = res['data']      
    })
  }
  
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  rowData;
  selectedRows = [];

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
          headerName: 'Report Name',
          field: 'fileName',
          cellClass: 'custom-report-name',
          wrapText: true,
          autoHeight: true,
          width: 300
        }
      ];
    });
  }
  handleGridReady(params) {
    this.gridApi = params.api;
    console.log('GRID API: ', params);
  };


  onRowSelected(event: any): void {
    this.selectedRows = this.gridApi.getSelectedRows();
  }
  
  approveSelected() {​​​​​​​​
    console.log(this.selectedRows);

     this.selectedRows.forEach((item) => {
        const FileSaver = require('file-saver');
        this.service.downloadXMl(item.fileId).subscribe((res: any) => {
         
            const file = new Blob([res.body], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(res.body, item.fileName + '.xml');
          
        });

      });
  }​​​​​​​​

}
