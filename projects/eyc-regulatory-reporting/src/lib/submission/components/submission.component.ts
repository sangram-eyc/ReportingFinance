import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SubmissionService } from '../../submission/services/submission.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import * as FileSaver from 'file-saver';
import {customComparator} from '../../config/rr-config-helper';
import { ModalComponent, PermissionService } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { DotsCardComponent } from './../../shared/dots-card/dots-card.component'
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'lib-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {

  @ViewChild('statusTemplate')
  statusTemplate: TemplateRef<any>;
  updateStatusModal= false;
  updateStatusForm: FormGroup;
  updateSubmissionStatusList = [];
  updateStatusType = 'single;'
  isUpdateStatusError = false;
  updateStatusErrorMsg = '';
  constructor(
    private service: SubmissionService,
    private dialog: MatDialog,
    public permissions: PermissionService,
    private filingService: RegulatoryReportingFilingService,
    private fb: FormBuilder
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
  submittedFiles = [];
  noFilesDataAvilable:boolean;
  @ViewChild('dateSubmittedTemplate')
  dateSubmittedTemplate: TemplateRef<any>;
  @ViewChild(DotsCardComponent) private childDot: DotsCardComponent;

  ngOnInit(): void {
    this.updateStatusForm = this.fb.group({
      status: ['',[Validators.required]]
    });

    this.updateStatusForm.get('status').valueChanges.subscribe(res => {
      this.isUpdateStatusError = false;
      this.updateStatusErrorMsg = '';
    })
  }


  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column);
      return thisIsFirstColumn;
    } else {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && !(this.rowData?.length === 0);
      return thisIsFirstColumn;
    }
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
    this.slectedFiles.push(item['fileName']);
    });


    this.service.downloadXMl(this.slectedFiles, this.filingName, this.period).subscribe((res: any) => {
      this.downloadFilesRes = res.data;
      this.downloadMsg = res.message;
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
    this.submittedFiles = []
    this.filingDetails = event;
    console.log("filing details > ", this.filingDetails)
    this.filingName = this.filingDetails.filingName;
    this.period = this.filingDetails.period;
    this.service.getXmlFilesList(this.filingName, this.period).subscribe(res => {
      res['data'].length === 0 ? this.noFilesDataAvilable = true: this.noFilesDataAvilable=false
      this.submittedFiles = res['data'];
      this.getSubmissionRowData();
    });

  }​​​​​​​​

  getSubmissionRowData(){
    this.rowData = [];
    this.submittedFiles.forEach(filing=>{
      this.rowData.push({
        fileId:filing.fileId,
        fileName : filing.fileName,
        status: filing.status,
        addedBy: filing.addedBy,
        dateAdded: filing.dateAdded,
        dateSubmitted: filing.dateSubmitted,
        updatedBy: filing.updatedBy
      })
    });

    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
        
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
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.statusTemplate,
        },
        headerName: 'Status',
        field:'status',
        sortable: true,
        filter:true,
        minWidth: 300
      },
      {
        headerComponentFramework:TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams:{
          ngTemplate:this.dateSubmittedTemplate
        },
        field:'dateSubmitted',
        headerName:'Date submitted',
        sortable: true,
        filter:true,
        minWidth: 180,
        cellClass:'date-submitted-class'
      }
    ];

  }

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

  enableUpdateStatusModal(row, typeSelected) {
    console.log(row);

    this.updateStatusType = typeSelected;
    if (typeSelected == 'single') {
      this.updateSubmissionStatusList = [{
        "fileId": row.fileId,
        "fileName": row.fileName,
        "filingId": this.filingDetails.filingId,
        "status": row.status
      }];
      console.log(this.updateSubmissionStatusList);

      this.updateStatusForm.patchValue({
        status: row.status
      });
      this.updateStatusModal = true;
    }
  }

  onSaveChangeStatus() {
    console.log(this.updateStatusForm.value);
    if (this.updateStatusType == 'single') {
      console.log(this.updateSubmissionStatusList);
      if (this.updateSubmissionStatusList[0].status == this.updateStatusForm.get('status').value) {
        this.isUpdateStatusError = true;
        this.updateStatusErrorMsg = "Can not update status for " + this.updateSubmissionStatusList[0].fileName + "  as its match with previous status"
        return;
      } else {
        this.updateSubmissionStatusList[0].status = this.updateStatusForm.get('status').value;
        this.updateSubmissionStatusList = this.updateSubmissionStatusList.map(ele => ({
          "fileId": ele.fileId,
          "filingId": this.filingDetails.filingId,
          "status": ele.status
        }));
        const obj = {
          "submissionFileRequestList": this.updateSubmissionStatusList
        };
        this.service.updateStatus(obj).subscribe(res => {
          for (let i in res['data']) {
            for (let j in this.submittedFiles) {
              if (this.submittedFiles[j].fileName == res['data'][i].fileName) {
                this.submittedFiles[j].status = res['data'][i].status;
                this.submittedFiles[j].dateSubmitted = res['data'][i].updatedDate;
                this.submittedFiles[j].updatedBy = res['data'][i].updatedBy;
                break;
              }
            }
          }
          setTimeout(() => {
            this.getSubmissionRowData();
          }, 100);
        });
      }
      this.updateStatusModal = false;
    }
  }

  onCancelChangeStatus() {
    this.updateSubmissionStatusList = [];
    this.updateStatusModal = false;
    this.isUpdateStatusError = false;
    this.updateStatusErrorMsg = '';
  }
}
