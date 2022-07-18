import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from './../../table-header-renderer/table-header-renderer.component';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { EntityExceptionDetailsService } from './../services/entity-exception-details.service';
import { ModalComponent, PermissionService,  IndividualExceptionsResolveComponent, CellRendererTemplateComponent} from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { rr_module_name } from '../../../config/rr-config-helper';

@Component({
  selector: 'lib-entity-exception-details',
  templateUrl: './entity-exception-details.component.html',
  styleUrls: ['./entity-exception-details.component.scss']
})
export class EntityExceptionDetailsComponent implements OnInit {
  
  componentStage: any;
  filingDetails: any;
  dueDate: any;
  filingName: any;
  period: any;
  filingId: any;
  exceptionCnt: number;
  exceptionReportName: any;
  parentModule: string;
  exceptionDetails;
  exceptionAnswersData;
  // exceptionAnswersDefs;
  exceptionAnswersDefsAgGrid = [];
  commentsCount;
  answerExceptionTable: boolean
  moduleOriginated = rr_module_name;

  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>;
  @ViewChild('exceptionResultTemplate')
  exceptionResultTemplate: TemplateRef<any>;
  @ViewChild('actionResolvedTemplate')
  actionResolvedTemplate: TemplateRef<any>;
  exceptionResolveRows: any[];
  enableResolveButton: boolean;
  enableUnresolveButton: boolean;
  commentsName: string;
  commentEntityType: string;
  entityId: any;
  showComments: boolean = false;
  exportsHeader: string;
  permissionStage: any;
  pageList = [100,200,300];
  pageSize =100;
  exportName: any;


  constructor(
    private filingService: RegulatoryReportingFilingService,
    private router: Router,
    private location: Location,
    private viewService: EntityExceptionDetailsService,
    public permissions: PermissionService,
    public dialog: MatDialog,
  ) { 
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      this.componentStage = navigation.extras.state.componentStage;
    }
  }

  ngOnInit(): void {
  if (this.filingService.getFilingData) {
      this.filingDetails = this.filingService.getFilingData;
      this.dueDate = this.filingService.getFilingData.dueDate;
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
      this.filingId = this.filingService.getFilingData.filingId;
      this.exceptionCnt = parseInt(this.filingService.getExceptionData?.Unresolved) + parseInt(this.filingService.getExceptionData?.Resolved);
      this.exceptionReportName = this.filingService.getExceptionData?.exceptionReportName;
    } ; 
    this.permissionStage = (this.componentStage == "Client review") ? "Client Review" : this.componentStage;
    this.answerExceptionTable = true;
    this.exceptionDetails = this.filingService.getExceptionData;
    this.exceptionReportName = this.filingService.getExceptionData?.exceptionReportName;
    this.getAnswerExceptionReports();
    sessionStorage.setItem("exceptionV3Stage", this.componentStage);
    sessionStorage.setItem("detailExcepStage",  this.componentStage);
  }

  sortByUnresolvedException(){
    this.exceptionAnswersData.sort((a, b) => a.Status > b.Status ? -1 : (a.Status < b.Status ? 1 : 0))
  }

  getAnswerExceptionReports() {
    this.exportName =   this.filingDetails.filingName + "_" + this.filingDetails.period+"_"+this.componentStage+"_Filing_Entities_Exception_Reports_Individual_Exception_Report_";
    this.viewService.getAnswerExceptionReports(this.filingService.getFilingEntityData.fundId, this.filingName, this.period, this.filingService.getExceptionData.AuditFilingID, this.exceptionCnt, this.componentStage).subscribe(res => {
      this.exceptionAnswersData = res.data['exceptionResultJason'];
      this.exceptionAnswersData ? this.exceptionAnswersData.map(e => {
        e.Status == "Resolved" || e.Status == "Unresolved" ? e.approved = false : e.approved = true
        return;
      }) : '';
      if (this.exceptionAnswersData) {
        this.sortByUnresolvedException();
        this.createEntitiesRowData();
      } else {
        // this.exceptionAnswersDefs = [];
        this.exceptionAnswersDefsAgGrid = [];
      }
      this.commentsCount = res.data['commentCountMap'];
    });
  }


  createEntitiesRowData(): void {
    // this.exceptionAnswersDefs = [];

    this.exceptionAnswersDefsAgGrid = [];

    // this.exceptionAnswersDefs.push(
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.dropdownTemplate,
    //     },
    //     field: 'approved',
    //     headerName: '',
    //     width: 20,
    //     sortable: false,
    //     pinned: 'left'
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.exceptionResultTemplate,
    //     },
    //     headerName: 'Result',
    //     field: 'Status',
    //     minWidth: 70,
    //     width: 70,
    //     sortable: false,
    //     cellClass: 'actions-button-cell'
    //   }
    // );
    this.exceptionAnswersDefsAgGrid.push(
      {
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        valueGetter: "node.rowIndex + 1",
        maxWidth: 120,
        sortable: false,
        menuTabs: [],
        filter:false,
        pinned: 'left',
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.exceptionResultTemplate,
        },
        headerName: 'Result',
        field: 'Status',
        maxWidth: 120,
        sortable: false,
        menuTabs: [],
        filter:false,
        cellClass: 'actions-button-cell'
      }
    );
    
    for (const property in this.exceptionAnswersData[0]) {
      console.log(`${property}: ${this.exceptionAnswersData[0][property]}`);
      if(property != 'approved') {
        // this.exceptionAnswersDefs.push({
        //   field: `${property}`,
        //   headerName: `${property}`,
        //   headerComponentFramework: TableHeaderRendererComponent,
        //   sortable: true,
        //   autoHeight: true,
        //   width: 320,
        //   wrapText: true,
        //   filter: true
        // });
        if (property == 'Entity Name') {
          this.exceptionAnswersDefsAgGrid.push({
            field: `${property}`,
            headerName: `${property}`,
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            minWidth: 300,
            tooltipField: `${property}`
          });
        } else {
          this.exceptionAnswersDefsAgGrid.push({
            field: `${property}`,
            headerName: `${property}`,
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            minWidth: 300,
          });
        }
      }
    }
    // this.exceptionAnswersDefs.push({
    //   headerName: 'Comments',
    //   headerComponentFramework: TableHeaderRendererComponent,
    //   cellRendererFramework: MotifTableCellRendererComponent,
    //   cellRendererParams: {
    //     ngTemplate: this.commentExceptionTemplate,
    //   }, sortable: false, autoHeight: true,
    //   wrapText: true
    // });
    this.exceptionAnswersDefsAgGrid.push({
      headerName: 'Comments',
      cellRendererFramework: CellRendererTemplateComponent,
      cellRendererParams: {
        ngTemplate: this.commentExceptionTemplate,
      }, 
      filter: 'agSetColumnFilter',
      filterParams: {
        buttons: ['reset']
      },
      sortable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
      minWidth: 155
    });
  }

  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.AuditResultObjectID,
        entityType: "Answer Exception",
        moduleOriginated: rr_module_name,
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails: {
            label: "Comment (required)",
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
      if (result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        this.commentsCount[row.AuditResultObjectID] = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  openComments(row) {
    this.commentsName = this.filingName + ' // ' + this.period;
    this.commentEntityType = 'Answer Exception'
    this.entityId = row.AuditResultObjectID;
    this.showComments = true;
    console.log(this.entityId);
  }

  checkFilingCompletedStatus(){
    return this.filingService.checkFilingCompletedStatus(this.filingDetails);
  }

  getResolveButtonPermission() {
    if (this.exceptionAnswersData && this.permissions.validatePermission(this.permissionStage, 'Exception Status Change Resolve') && !this.checkFilingCompletedStatus()){
      return true
    } else return false
  }

  getUnresolveButtonPermission() {
    if (this.exceptionAnswersData && this.permissions.validatePermission(this.permissionStage, 'Exception Unapprove') && !this.checkFilingCompletedStatus()){
      return true;
    } else return false;
  }

  exceptionResolveRowsSelected(e) {
    this.exceptionResolveRows = [...e];
    let rowsArr = [...this.exceptionResolveRows]
    if (rowsArr.length > 0) {
      this.enableResolveButton = true;
      this.enableUnresolveButton = true;
      this.enableResolveButton = rowsArr.some((el) => el.Status == 'Unresolved'
      );
      this.enableUnresolveButton = rowsArr.some((el) => el.Status == 'Resolved'
      );
    } else {
      this.resetResolveUnresolveButtons()
    }
  }

  resetResolveUnresolveButtons() {
    this.enableResolveButton = false;
    this.enableUnresolveButton = false;
  }

  actionResolvedClick(row) {
    const dialogRef = this.dialog.open(IndividualExceptionsResolveComponent, {
      width: '843px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Resolve selected",
        description: `<p>Are you sure you want to resolve the selected exception? If yes, you will need to add a general comment for this action. Please note, this will move these items to production review.</p><br><p><b style="font-weight: 800;">Note:</b> Resolved exceptions will be noted with this icon <svg style="display: inline;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 6H14V8H2V6ZM2 10H14V12H2V10ZM2 16H10V14H2V16ZM23 13L21.5 11.5L16.01 17L13 14L11.5 15.5L16.01 20L23 13Z" fill="#168736"/></svg> When clicked you can view resolution comments.</p>`,
        entityType: "Answer Exception",
        moduleOriginated: rr_module_name,
        auditResultObjectId: this.getEnitityIds('Unresolved'),
        entityId: this.filingService.getFilingEntityData.fundId,
        filingName: this.filingName,
        period: this.period,
        stage: this.componentStage,
        exceptionId: this.filingService.getExceptionData.AuditFilingID,
        statusTo: 'RESOLVE',
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails: {
            label: "Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Confirm",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Confirm") {
        let entityIds = this.getEnitityIds('Unresolved');
        entityIds.map((e) => {
          this.commentsCount[e] ? this.commentsCount[e] += 1 : this.commentsCount[e] = 1;
        })
        this.exceptionAnswersData = result.resolveResp.data['exceptionResultJason'];
        this.exceptionAnswersData.map(e => {
          e.Status == "Resolved" || e.Status == "Unresolved" ? e.approved = false : e.approved = true
          return;
        });
        this.sortByUnresolvedException();
        this.resetResolveUnresolveButtons()
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  getEnitityIds(status: string) {
    let resultArr = this.exceptionResolveRows.filter((el) => {
      return el.Status == status
    })
    return resultArr.map(e => e.AuditResultObjectID);
  }

  actionUnResolvedClick(row) {
    const dialogRef = this.dialog.open(IndividualExceptionsResolveComponent, {
      width: '843px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Unresolve selected",
        description: `<p>Are you sure you want to unresolve the selected exception? If yes, you will need to add a general comment for this action. Please note, this will move these items to production review.</p><br><p><b style="font-weight: 800;">Note:</b>  Unresolved exceptions will be changed back to this icon <svg style="display: inline;" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.1667 17.4167L10.0833 0L0 17.4167H20.1667ZM9.16667 14.6667V12.8333H11V14.6667H9.16667ZM9.16667 11H11V7.33333H9.16667V11Z" fill="#FF9831"/></svg>.</p>`,
        entityType: "Answer Exception",
        moduleOriginated: rr_module_name,
        auditResultObjectId: this.getEnitityIds('Resolved'),
        entityId: this.filingService.getFilingEntityData.fundId,
        filingName: this.filingName,
        period: this.period,
        stage: this.componentStage,
        exceptionId: this.filingService.getExceptionData.AuditFilingID,
        statusTo: 'UNRESOLVE',
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails: {
            label: "Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Confirm",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Confirm") {
        let entityIds = this.getEnitityIds('Resolved');
        entityIds.map((e) => {
          this.commentsCount[e] ? this.commentsCount[e] += 1 : this.commentsCount[e] = 1;
        });
        this.exceptionAnswersData = result.resolveResp.data['exceptionResultJason'];
        this.exceptionAnswersData.map(e => {
          e.Status == "Resolved" || e.Status == "Unresolved" ? e.approved = false : e.approved = true
          return;
        });
        this.sortByUnresolvedException();
        this.resetResolveUnresolveButtons()
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  onClickMyTask(e) { }

  exportData() {
    this.exportsHeader = '';
    for (const property in this.exceptionAnswersData[0]) {
      if(property != 'approved') {
        let hedars = property+":"+property;
      if(this.exportsHeader)
       this.exportsHeader = this.exportsHeader+","+hedars;
      else  
      this.exportsHeader = hedars;
      }
    }

    if(this.permissions.validatePermission(this.permissionStage, 'View Comments')) { 
    this.exportsHeader =  this.exportsHeader+",commentCountMap:Comments";
    }
    if(this.componentStage != null && this.componentStage != undefined) {
      const requestobj = {
        "exceptionId": Number(this.filingService.getExceptionData.AuditFilingID),
        "entityId": this.filingService.getFilingEntityData.fundId,
        "export": true,
        "reportType": "CSV",
        "filingName": this.filingName,
        "period": this.period,
        "stage": this.componentStage,
        "totalExceptions": this.exceptionCnt,
        "titles": this.exportsHeader,
        "subHeader": "Filing_Entities"
      }
      this.viewService.exportData(requestobj).subscribe(res => {
      });
    } 
  }



  backtoParent() {
      this.location.back();
  }

  commentAdded() {
    this.getAnswerExceptionReports();
  }

}
