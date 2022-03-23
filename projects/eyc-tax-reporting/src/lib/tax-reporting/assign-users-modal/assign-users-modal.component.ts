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
  toastSuccessMessage = "Users added successfully";
  showModal = true;
  showToastAfterSubmit = false;
  searchNoDataAvilable = false;

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
  chk = false;
  initialUsers:any = [];
  selectedUsers:any = [];

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
    this.getListUsers();   
  }

  ngAfterViewInit(): void {  

  }

  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

  onClickYes() {
   console.log('Users selected->', this.selectedUsers);
   console.log('Fund id ->', this.modalDetails.idFund);  
   const usersToAdd = {
    "userIds": this.selectedUsers
    };

  this.assignmentsService.addUsersToFund(this.modalDetails.idFund, usersToAdd).subscribe(resp =>{
      console.log('response addUsersToFund', resp);
      this.dialogRef.close({ button: this.modalDetails.footer.YesButton }); 
  }, error => {
    console.log('response addUsersToFund', error);
  });
}

  getListUsers(){
    this.assignmentsService.listUserToAdd().subscribe(resp =>{
      console.log('response->', resp);
      resp['data'].forEach((item) => {
        const eachitem: any = {
          id: item.userId,
          userEmail: item.userEmail,
          userFirstName: item.userFirstName,
          userLastName: item.userLastName,
          approved:true,
          check: this.modalDetails.fundsAssign[0].assignedTo.findIndex(x=> x.userId === item.userId) === -1 ? false:true    
        };
        this.completedData.push(eachitem);
        if(eachitem.check){
          this.initialUsers.push(item.userId);
          this.selectedUsers.push(item.userId);
        }           
    });
    this.createListUserToAddRowData();
    });
  }

  createListUserToAddRowData(){  
    this.rowData = [];
    this.completedData.forEach(row => {
     this.rowData.push({
      id: row.id,
      userEmail: row.userEmail,
      name: row.userFirstName + ' ' + row.userLastName,
      approved:row.approved,
      check:row.check  
     })
   });

    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.datasetsDropdownTemplate,
        }, 
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  changeCheck(_id){   
   let index = this.rowData.findIndex(x=> x.id == _id);
   this.rowData[index].check = !this.rowData[index].check;
   
    if(this.rowData[index].check == false){
      let indexArr = this.selectedUsers.indexOf(_id);
      if(indexArr !== -1){
        this.selectedUsers.splice(indexArr, 1);
      }      
    }else{
      this.selectedUsers.push(this.rowData[index].id)
    } 
    this.disabledBtn = this.arrayCompare(this.initialUsers, this.selectedUsers);
 }

 arrayCompare(_arr1, _arr2) {
  if (
    !Array.isArray(_arr1)
    || !Array.isArray(_arr2)
    || _arr1.length !== _arr2.length
    ) {
      return false;
    }
  
  // .concat() to not mutate arguments
  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();
  
  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
          return false;
       }
  } 
  return true;
}

closeToast(){
  this.showToastAfterSubmit = !this.showToastAfterSubmit;
  this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
}

handleGridReady(params) {
  this.gridApi = params.api;
}

searchGrid(input){
  this.gridApi.setQuickFilter(input);
  this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
}

}
