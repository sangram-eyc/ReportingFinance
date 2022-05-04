import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EycRrCommentApiService } from '../../services/eyc-rr-comment-api.service';

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
  toastSuccessMessage = "Comment added successfully";
  showToastAfterSubmit = false;
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commentService: EycRrCommentApiService
  ) {
    dialogRef.disableClose = true;
    console.log(data);
    this.modalDetails = data;
    if (this.modalDetails.type === "ConfirmationTextUpload") {
      this.ConfirmationTextUpload = true;
      if (this.modalDetails.forms?.isSelect === true) {
        this.modalForm = this.fb.group({
          assignTo: [''],
          comment: ['', [Validators.required, Validators.maxLength(1000), this.noWhitespaceValidator]],
          files: ['']
        });
      } else {
        this.modalForm = this.fb.group({
          comment: ['', [Validators.required, Validators.maxLength(1000), this.noWhitespaceValidator]],
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
      const commentObj = {
        "comment": escape(this.modalForm.get('comment').value.trim()),
        "entityId": this.modalDetails.entityId,
        "entityType": this.modalDetails.entityType,
        "moduleOriginated": this.modalDetails.moduleOriginated
      };

      this.commentService.addComment(commentObj).subscribe(res => {
        console.log(res);
        if (this.filesList.length) {
          const userEmail = sessionStorage.getItem('userEmail');
          let formData = new FormData();
          formData.append('application', "REG");
          formData.append('entityId', res['data']['commentId']);
          formData.append('entityType', "COMMENT");
          formData.append('mode', "SYNC");
          formData.append('uploadedBy', userEmail);
          this.filesList.forEach(element => {
            console.log(element);
            formData.append('files', element.file.rawFile);
          });
          this.commentService.uploadFile(formData).subscribe(uploadRes => {
            console.log(uploadRes);
            this.dialogRef.close({ button: this.modalDetails.footer.YesButton, data: this.modalForm.getRawValue() });
          }, uploadError => {
            console.log(uploadError);
            this.dialogRef.close({ button: this.modalDetails.footer.YesButton, data: this.modalForm.getRawValue() });
          });
        } else {
          // this.showToastAfterSubmit = !this.showToastAfterSubmit;
          // setTimeout(() => {
          //   this.showToastAfterSubmit = !this.showToastAfterSubmit;
          // }, 5000);
          this.dialogRef.close({ button: this.modalDetails.footer.YesButton, data: this.modalForm.getRawValue() });
        }

      }, error => {
        console.log(error);

      });
      // this.dialogRef.close({ button: this.modalDetails.footer.YesButton, data: this.modalForm.getRawValue() });
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

  public noWhitespaceValidator(control: FormControl) {
    if (control.value.length === 0) {
      return false;
    } else {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }
}
