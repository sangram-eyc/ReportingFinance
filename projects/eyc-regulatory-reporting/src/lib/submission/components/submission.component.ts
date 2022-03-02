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
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';


@Component({
  selector: 'lib-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {

  @ViewChild('statusTemplate')
  statusTemplate: TemplateRef<any>;
  @ViewChild('lastUpdatedByTemplate')
  lastUpdatedByTemplate: TemplateRef<any>;
  updateStatusModal= false;
  updateStatusForm: FormGroup;
  updateSubmissionStatusList = [];
  updateStatusType = 'single;'
  isUpdateStatusError = false;
  updateStatusErrorMsg = '';
  showAuditLog = false;
  fileDetail;
  
  auditLogs = [];
  // auditLogs = [
  //   {
  //     "duration": "NOV",
  //     "progress": [
  //       {
  //         "title": "Client L2 review",
  //         "subtitle": "",
  //         "status": "NOT_STARTED"
  //       },
  //       {
  //         "title": "Client L1 review",
  //         "subtitle": "In progress.",
  //         "status": "IN_PROGRESS"
  //       },
  //       {
  //         "title": "EY L2 review",
  //         "subtitle": "Joseph Burrows approved on 11/18/2021 21:27",
  //         "status": "COMPLETED"
  //       },
  //       {
  //         "title": "EY L2 review",
  //         "subtitle": "Joseph Burrows unapproved on 11/18/2021 21:27",
  //         "status": "ERROR"
  //       },
  //       {
  //         "title": "EY L2 review",
  //         "subtitle": "Joseph Burrows approved on 11/18/2021 21:27",
  //         "status": "COMPLETED"
  //       },
  //       {
  //         "title": "EY L1 review",
  //         "subtitle": "Suzanne Little approved on 11/18/2021 21:27",
  //         "status": "COMPLETED"
  //       },
  //       {
  //         "title": "Exception report available for EY L1 review",
  //         "subtitle": "System modified on 11/18/2021 21:27",
  //         "status": "COMPLETED"
  //       }
  //     ]
  //   }
  // ]
  exportHeaders: string;
  exportURL;
  constructor(
    private service: SubmissionService,
    private dialog: MatDialog,
    public permissions: PermissionService,
    private filingService: RegulatoryReportingFilingService,
    private fb: FormBuilder,
    private settingsService: EycRrSettingsService
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

  sortAuditlogData(data) {
    let months = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec");
    data.forEach(element => {
      
    });
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
      if (res['data'] && res['data'].length) {
        this.noFilesDataAvilable = false;
        this.submittedFiles = res['data'];
        this.getSubmissionRowData();
      } else {
        this.noFilesDataAvilable = true;
      }
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
        headerName: 'File Name',
        field: 'fileName',
        cellClass: 'custom-report-name',
        wrapText: true,
        autoHeight: true,
        width: 300,
        sortable: true,
        filter:true,
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
        minWidth: 200
      },
      {
        headerComponentFramework:TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams:{
          ngTemplate:this.dateSubmittedTemplate
        },
        field:'dateSubmitted',
        headerName:'Status Changed',
        sortable: true,
        filter:true,
        minWidth: 220,
        cellClass:'date-submitted-class'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.lastUpdatedByTemplate,
        },
        headerName: 'Last updated by',
        field: 'updatedBy',
        wrapText: true,
        autoHeight: true,
        sortable: true,
        filter:true,
        width: 300,
        sort:'asc',
        comparator: customComparator
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
          this.filingDetails.status[4].progress = 'COMPLETED';
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
          this.filingStatusChangeMsg = "Status updated successfully";
          this.showToastAfterStatusChange = true;
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
          setTimeout(() => {
            this.showToastAfterStatusChange = false;
          }, 5000);
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

  onClickLastUpdatedBy(row) {
    console.log(row);
    this.showAuditLog = true;
    this.fileDetail = row;
    this.service.getAuditlog().subscribe(res => {
      this.groupbyMonth(res['data'])
      this.auditLogs= this.groupbyMonth(res['data'])
    });
  }
  exportSubmissionData(){
    this.exportHeaders = '';
    this.exportHeaders = 'fileName:File Name,status:Status,dateSubmitted:Status Chnaged,updatedBy: Last updated by';
    this.exportURL = this.settingsService.regReportingFiling.submission_xml_files + "?filing=" + this.filingName + "&period=" + this.period + "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    this.service.exportSubmissionData(this.exportURL).subscribe(resp => {
      console.log(resp);
    })
  }

  groupbyMonth(data) {
    let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    var results = [];
    data.forEach(element => {
      let date = new Date(element.modifiedDateTime);
      var month = date.getMonth();
      let checkMonth = results.filter(cls => cls.duration == months[month])
      if (checkMonth.length) {
        results[results.findIndex(item => item.duration == months[month])].progress.push(element)
      } else {
        results.push({
          "duration": months[month],
          "progress": [element]
        })
      }
    });
    console.log(results);
    return results
  }
}
