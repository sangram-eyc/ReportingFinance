import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  modalDetails;
  modalForm: FormGroup;
  ConfirmationTextUpload = false;
  assignToList = [
    { name: "Test1", id: 1 },
    { name: "Test2", id: 2 },
    { name: "Test3", id: 3 },
    { name: "Test4", id: 4 }
  ];

  filesList: any = [];
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    dialogRef.disableClose = true;
    console.log(data);
    this.modalDetails = data;
    if (this.modalDetails.type === "ConfirmationTextUpload") {
      this.ConfirmationTextUpload = true;
      if(this.modalDetails.forms?.isSelect === true){
        this.modalForm = this.fb.group({
          assignTo: [''],
          comment: ['', [Validators.required, Validators.maxLength(250)]],
          files: ['']
        });
      } else {
        this.modalForm = this.fb.group({
          comment: ['', [Validators.required, Validators.maxLength(250)]],
          files: ['']
        });
      }
      
  
    } else {
      this.ConfirmationTextUpload = false;
    }
  }

  ngOnInit(): void {
    
  }

  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

  onClickYes() {
    if (this.modalDetails.type === "ConfirmationTextUpload") {
      this.dialogRef.close({ button: this.modalDetails.footer.YesButton, data: this.modalForm.getRawValue() });
    } else {
      this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
    }
  }

  uploadedFiles(emitiedFiles) {
    this.filesList = emitiedFiles;
    console.log(this.filesList);
    this.modalForm.patchValue({
      files: this.filesList
    })
  }
}
