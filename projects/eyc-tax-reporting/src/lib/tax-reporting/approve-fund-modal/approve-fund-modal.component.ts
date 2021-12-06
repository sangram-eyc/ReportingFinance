import { Component, Inject, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { AssignmentsFundsService } from '../services/assignments-funds.service'

@Component({
  selector: 'lib-approve-fund-modal',
  templateUrl: './approve-fund-modal.component.html',
  styleUrls: ['./approve-fund-modal.component.scss']
})
export class ApproveFundModalComponent implements OnInit {

  modalDetails;
  ConfirmationTextUpload = true;
  disabledBtn = true;
  toastSuccessMessage = "Users added successfully";
  showModal = true;
  showToastAfterSubmit = false;

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
  searchNoDataAvilable;
  chk = false;
  initialUsers:any = [];
  selectedUsers:any = [];
  datasetsDropdownTemplate: any;

  constructor(private assignmentsService: AssignmentsFundsService, 
    public dialogRef: MatDialogRef<ApproveFundModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.modalDetails = data;
     }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {  

  }

  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

  onClickYes() {
    this.dialogRef.close({ button: this.modalDetails.footer.YesButton }); 
  }

}
