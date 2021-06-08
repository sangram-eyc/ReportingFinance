import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SubmissionService } from '../../submission/services/submission.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import * as FileSaver from 'file-saver';



@Component({
  selector: 'lib-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {


  constructor(private service: SubmissionService) { }


  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  rowData;
  selectedRows = [];
  filingDetails;
  filingName;
  period;
  slectedFiles;
  downloadFilesRes = [];

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

  ngOnInit(): void {
   
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
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
  }

  onRowSelected() {
    this.selectedRows = this.gridApi.getSelectedRows();
  }

  

  approveSelected() {
    this.slectedFiles = [];
    const formData: any = new FormData();
    this.selectedRows.forEach((item) => {
    // formData.append("file", item['fileName']);
    this.slectedFiles.push(item['fileName']);
    });


    this.service.downloadXMl(this.slectedFiles, this.filingName, this.period).subscribe((res: any) => {
      this.downloadFilesRes = res['data'];
      this.downloadFilesRes.forEach((item: any) => {
        console.log("item", item);
        let data = new Blob([item.file], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(data, item.fileName);
      });
    });
  }


  receiveFilingDetails(event) {
    this.filingDetails = event;
    this.filingName = this.filingDetails.filingName;
    this.period = this.filingDetails.period;
    this.service.getXmlFilesList(this.filingName, this.period).subscribe(res => {
      this.rowData = res['data'];
    });

  }​​​​​​​​



}
