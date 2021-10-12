import { Component, Inject, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { AssignmentsFundsService } from '../services/assignments-funds.service'

@Component({
  selector: 'lib-assign-users-modal',
  templateUrl: './assign-users-modal.component.html',
  styleUrls: ['./assign-users-modal.component.scss']
})
export class AssignUsersModalComponent implements OnInit {

  modalDetails;
  ConfirmationTextUpload = true;
  disabledBtn = true;

  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData;
  rowClass = 'row-style';
  columnDefs;
  rowStyle = {
    height: '74px'
  }
  domLayout = 'autoHeight';
  completedData: any[] = [];
  datasetsSelectedRows;
  exceptionDetailCellRendererParams;

  @ViewChild('datasetsDropdownTemplate')
  datasetsDropdownTemplate: TemplateRef<any>;
  @ViewChild('userName')
  userName: TemplateRef<any>;

  constructor(private assignmentsService: AssignmentsFundsService, 
    public dialogRef: MatDialogRef<AssignUsersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.modalDetails = data;
     }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getListUsers();
  }

  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

  onClickYes() {
   //do something  
  }

  getListUsers(){
    this.assignmentsService.listUserToAdd().subscribe(resp =>{
      console.log('response->', resp);
      resp['data'].forEach((item) => {
        const eachitem: any = {
          id: item.id,
          userEmail: item.userEmail,
          userFistName: item.userFistName,
          userLastName: item.userLastName,
          approved:false     
        };
        this.completedData.push(eachitem);    
    });
    this.createListUserToAddRowData();
    });
  }

  createListUserToAddRowData(){  
  console.log('data->', this.completedData);

    this.rowData = [];
    this.completedData.forEach(row => {
     this.rowData.push({
      id: row.id,
      userEmail: row.userEmail,
      name: row.userFistName + ' ' + row.userLastName,
      approved:row.approved  
     })
   });

    this.columnDefs = [
      {
/*         headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.datasetsDropdownTemplate,
        }, */
        field: 'template',
        headerName: '',
        width: 70,
        sortable: false,
        pinned: 'left',
      },
      {
         headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.userName,
        }, 
        headerName: 'Users',
        field: 'name',
        sortable: false,
        filter: false,       
        resizeable: true, 
        minWidth: 300,
        sort:'asc'
      }
    ]
  }

  datasetsReportRowsSelected(event) {
    console.log('dataset emiter',  event);
    this.datasetsSelectedRows = event;
    console.log('len->', this.datasetsSelectedRows.length);
    if(this.datasetsSelectedRows.length > 0){    
      this.disabledBtn = false
    }else{
      this.disabledBtn = true
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  submitDatasets(){
    console.log('submit...');
  }

}
