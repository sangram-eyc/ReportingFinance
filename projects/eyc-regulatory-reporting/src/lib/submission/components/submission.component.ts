import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SubmissionService } from '../../submission/services/submission.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import * as FileSaver from 'file-saver';
// import { SharedDownloadService } from './../../../../../eyc-ui-shared-component/src/lib/download/services/shared-download.service'
import {customComparator} from '../../config/rr-config-helper';
import { ModalComponent, PermissionService } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { DotsCardComponent } from './../../shared/dots-card/dots-card.component'
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';


@Component({
  selector: 'lib-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {


  constructor(
    private service: SubmissionService,
    private dialog: MatDialog,
    public permissions: PermissionService,
    private filingService: RegulatoryReportingFilingService
    ) { }


  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  rowData = [];
  selectedRows = [];
  slectedFiles: any[] = [];
  filingDetails;
  filingName;
  period;
  selectedFiles: any[] = [];
  downloadFilesRes = [];
  showToastAfterDownload = false;
  showToastAfterStatusChange = false;
  enableComplete = false;
  downloadMsg;
  filingStatusChangeMsg;

  @ViewChild(DotsCardComponent) private childDot: DotsCardComponent;

  ngOnInit(): void {
  }


  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column);
      return thisIsFirstColumn;
    } else {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && !(this.rowData.length === 0);
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
            // ngTemplate: this.dropdownTemplate,
          },
          field: 'template',
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
          width: 300,
          sort:'asc',
          comparator: customComparator
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

  

  

  /* donwloadFilesOnSelected(emitiedFiles) {
    
    emitiedFiles.forEach((item) => {
      this.selectedFiles.push(item['fileName']);
    })
    this.service.downloadXMl(this.selectedFiles, this.filingName, this.period).subscribe((res: any) => {
    this.sharedDownloadService.downloadAttachments(res.message, res.data);
    });
  } */

  approveSelected() {
    this.slectedFiles = [];
    const formData: any = new FormData();
    this.selectedRows.forEach((item) => {
    this.slectedFiles.push(item['fileName']);
    });


    this.service.downloadXMl(this.slectedFiles, this.filingName, this.period).subscribe((res: any) => {
      this.downloadFilesRes = res.data;
      this.downloadMsg = res.message;
      // console.log('download msg > ', this.downloadMsg);
      this.showToastAfterDownload = !this.showToastAfterDownload;
      this.downloadFilesRes.forEach((item: any) => {
        const data = this.base64ToBlob(item.file);
        FileSaver.saveAs(data, item.fileName);
      });
      setTimeout(() => {
        this.showToastAfterDownload = !this.showToastAfterDownload;
      }, 5000);
    });
  }


  public base64ToBlob(b64Data, contentType='text/xml', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }


  receiveFilingDetails(event) {
    this.filingDetails = event;
    console.log("filing details > ", this.filingDetails)
    this.filingName = this.filingDetails.filingName;
    this.period = this.filingDetails.period;
    this.service.getXmlFilesList(this.filingName, this.period).subscribe(res => {
      this.rowData = res['data'];
      this.ngAfterViewInit();
    });

  }​​​​​​​​

  getFileStatus(event){
    console.log(event);
    event === 'completed' ? this.enableComplete = false : this.enableComplete = true;
    console.log(this.enableComplete);
  }

  statusUpdateToComplete(){
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: "Confirmation",
        header: "Filing status confirmation",
        description: "Are you sure you want to complete this filing? This action cannot be undone.",
        footer: {
          style: "start",
          YesButton: "Yes",
          NoButton: "No"
        }
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button == 'Yes') {
        this.service.completeFiling(this.filingDetails.filingId).subscribe(resp => {
          this.filingService.invokeFilingDetails();
          this.filingStatusChangeMsg = 'Filing has been completed';
          this.enableComplete = true;
          this.showToastAfterStatusChange = !this.showToastAfterStatusChange;
          setTimeout(() => {
            this.showToastAfterStatusChange = !this.showToastAfterStatusChange;
          }, 5000);
        });
      }
    });
  
    
  }



}
