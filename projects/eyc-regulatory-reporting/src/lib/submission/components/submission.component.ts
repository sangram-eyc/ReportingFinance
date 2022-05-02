import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SubmissionService } from '../../submission/services/submission.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import * as FileSaver from 'file-saver';
import {customComparator, rr_module_name} from '../../config/rr-config-helper';
import { ModalComponent, PermissionService, DEFAULT_PAGE_SIZE } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { DotsCardComponent } from './../../shared/dots-card/dots-card.component'
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';
import { DatePipe } from '@angular/common';


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
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>
  updateStatusModal= false;
  updateStatusForm: FormGroup;
  updateSubmissionStatusList = [];
  updateStatusType = 'single;'
  isUpdateStatusError = false;
  updateStatusErrorMsg = '';
  showAuditLog = false;
  isAuditlogs = false;
  fileDetail;
  showComments = false;
  commentsName;
  commentEntityType;
  entityId;
  
  auditLogs = [];

  moduleOriginated = rr_module_name;

  exportHeaders: string;
  exportURL;
  toastAfterExportInSubmission: boolean = false;
  previousStatus: any;
  constructor(
    private service: SubmissionService,
    private dialog: MatDialog,
    public permissions: PermissionService,
    private filingService: RegulatoryReportingFilingService,
    private fb: FormBuilder,
    private settingsService: EycRrSettingsService,
    public datepipe: DatePipe
    ) { }


  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  rowData = [];
  subRowData = [];
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
  downloadSubmit;
  filingStatusChangeMsg;
  submittedFiles = [];
  noFilesDataAvilable:boolean;
  pageChangeFunc;
  currentPage = 0;
  totalRecords = 5;
  pageSize = DEFAULT_PAGE_SIZE;
  filter = '';
  sort = '';
  defaultColDef;

  @ViewChild('dateSubmittedTemplate')
  dateSubmittedTemplate: TemplateRef<any>;
  @ViewChild(DotsCardComponent) private childDot: DotsCardComponent;

  ngOnInit(): void {
    this.pageChangeFunc = this.onPageChange.bind(this);
    this.downloadSubmit = this.onDownloadSelected.bind(this);
    this.updateStatusForm = this.fb.group({
      status: ['',[Validators.required]]
    });

    this.updateStatusForm.get('status').valueChanges.subscribe(res => {
      this.isUpdateStatusError = false;
      this.updateStatusErrorMsg = '';
    });
    this.defaultColDef = {
      headerCheckboxSelection: this.isFirstColumn,
      checkboxSelection: this.isFirstColumn
    };
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

  onRowSelected(event) {
    console.log(event);
    this.selectedRows = this.gridApi.getSelectedRows();
    console.log(this.selectedRows);
  }

  downloadRowsSelected(event) {
    console.log(event);
    this.selectedRows = event;
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

  onDownloadSelected() {
    console.log('DOWNLOADING SELECTED');
    this.selectedRows = this.gridApi.getSelectedRows();
    this.slectedFiles = [];
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

  checkFilingCompletedStatus(){
    return this.filingService.checkFilingCompletedStatus(this.filingDetails);
  }


  receiveFilingDetails(event) {
    this.submittedFiles = []
    this.filingDetails = event;
    console.log("filing details > ", this.filingDetails)
    this.filingName = this.filingDetails.filingName;
    this.period = this.filingDetails.period;
    this.getXmlFilesList(true);
  }

  resetData() {
    this.getSubmissionRowData();
    this.currentPage = 0;
    this.pageSize = DEFAULT_PAGE_SIZE;
  }

  getXmlFilesList(resetData = false) {
    this.sort = resetData ? 'fileName:true' : this.sort;
    this.service.getXmlFilesListTest(this.filingName, this.period, this.currentPage, this.pageSize, this.filter, this.sort).subscribe(res => {
      this.totalRecords = res['totalRecords'];
      this.noFilesDataAvilable = false;
      this.submittedFiles = res['data'];
      this.rowData = res['data'];
      console.log('GET XML FILES ROW DATA', this.rowData);
      if (resetData) {
        this.resetData();
      } else {
        this.gridApi.setRowData(this.rowData);
      }
    },
    error=>{
      this.rowData = [];
      console.log("Submission error");
    });
  }

  disableComparator(data1, data2) {
    return 0; 
  }

  getSubmissionRowData(){
    this.subRowData = [];
    this.columnDefs = [];
    setTimeout(() => {
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
          comparator: this.disableComparator
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
          width: 350,
          comparator: this.disableComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentTemplate,
          },
          headerName: 'Comments',
          field: 'commentsCount',
          sortable: true,
          filter: true,
          width: 155,
          comparator: this.disableComparator
        },
      ];
      this.subRowData = this.rowData;
    }, 1);
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
          let subStageIndex = this.filingDetails.status.findIndex(x => x.stageCode === "SUBMISSION");
          this.filingDetails.status[subStageIndex].progress = 'COMPLETED';
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

  onPageChange() {
    this.getXmlFilesList();
  }

  currentPageChange(event) {
    console.log('CURRENT PAGE CHANGE', event - 1);
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    console.log('CURRENT PAGE SIZE', event);
    this.pageSize = event;
    this.getXmlFilesList();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.getXmlFilesList(true);
  }

  sortChanged(event) {
    this.sort = event;
    this.getXmlFilesList();
  }

  enableUpdateStatusModal(row, typeSelected) {
    console.log(row);
    this.previousStatus  = row.status;

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
          "currStatus": ele.status,
          "prevStatus": this.previousStatus
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
    
    this.fileDetail = row;
    let auditObjectId = row.fileId;
    let auditObjectType = 'Submission File';
    let auditList = [];
    this.isAuditlogs = false;
    this.service.getAuditlog(auditObjectId,auditObjectType).subscribe(res => {
      console.log(res);
      let data = res['data'];
      res['data'].length ? this.showAuditLog = true : this.isAuditlogs = true;
      data.forEach((element, index) => {
        let item = this.copy(element);
        let item2 = this.copy(element);
        if (element.auditActionType == 'New') {
          if (element.auditDetails.auditObjectPrevValue == 'NA') {
            item['auditActionType'] = 'completed'
            item.auditDetails['auditObjectCurValue'] = 'Draft available for submission';
            item['subTitle'] ='System modified on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
            auditList.push(item)
          } else {
            item['auditActionType'] = 'completed';
            auditList.push(item);
            if((index+1) ==data.length){
              item2['auditActionType'] = 'Approve';
              item2['subTitle'] ='Activity prior to this date is not shown in audit history.     System generated note on' + ' ' + this.datepipe.transform(element.modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
              item2.auditDetails['auditObjectCurValue'] = 'Recording of events began on this date.';
              auditList.push(item2);
            }
          }
        }
      });
      this.auditLogs= this.groupbyMonth(auditList);
    });
  }

  copy(x) {
    return JSON.parse(JSON.stringify(x));
  }

  exportSubmissionData(){
    console.log('GRID API', this.gridApi);
    this.exportHeaders = '';
    if(this.permissions.validatePermission('Submission', 'View Comments')) {
      this.exportHeaders = 'fileName:File Name,status:Status,dateSubmitted:Status Changed,updatedBy:Last updated by,commentsCount:Comments';
    } else {
      this.exportHeaders = 'fileName:File Name,status:Status,dateSubmitted:Status Changed,updatedBy:Last updated by';
    }
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

  addComment(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.fileId,
        entityType: "SUBMISSION_FILE",
        moduleOriginated: rr_module_name,
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data:[
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails:{
            label:"Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
        this.rowData[this.rowData.findIndex(item => item.fileId === row.fileId)].commentsCount = 1;
        this.getSubmissionRowData();
      } else {
        console.log(result);
      }
    });
  }

  openComments(row) {
     this.commentsName = this.filingDetails.filingName + ' // ' + this.filingDetails.period;
      this.commentEntityType = 'SUBMISSION_FILE';
      this.entityId = row.fileId;
     this.showComments = true;
  }

  commentAdded() {
    this.getXmlFilesList();
  }

  reopenFilling(){
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: "Confirmation",
        header: `<svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 19H22L11 0L0 19ZM12 16H10V14H12V16ZM12 12H10V8H12V12Z" fill="#23232F"/>
        </svg>
         &nbsp; Reopen Filing`,
        description: "Are you sure you want to reopen this filing? <br> *This action will allow you to make updates to submission files",
        footer: {
          style: "start",
          YesButton: "Yes",
          NoButton: "Cancel"
        }
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button == 'Yes') {
        this.service.reopenFiling(this.filingDetails.filingId).subscribe(resp => {
          this.filingService.invokeFilingDetails();
          let subStageIndex = this.filingDetails.status.findIndex(x => x.stageCode === "SUBMISSION");
          this.filingDetails.status[subStageIndex].progress = 'In Progress';
          /* this.enableComplete = true;
          this.showToastAfterStatusChange = !this.showToastAfterStatusChange;
          setTimeout(() => {
            this.showToastAfterStatusChange = !this.showToastAfterStatusChange;
          }, 5000); */
        });
      }
    });

  }

}
