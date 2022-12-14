import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { truncate } from 'fs';
import { TaxCommentService } from '../../tax-reporting/services/tax-comment.service'

@Component({
  selector: 'lib-tax-comment-modal',
  templateUrl: './tax-comment-modal.component.html',
  styleUrls: ['./tax-comment-modal.component.scss']
})
export class TaxCommentModalComponent implements OnInit {

  modalDetails;
  modalForm: FormGroup;
  ConfirmationTextUpload = false;
  filesList: any = [];
  toastSuccessMessage = "Comment added successfully";
  showToastAfterSubmit = false;
  showModal = true;
  markCritical: boolean = false;
  editReq: boolean = false;
  TagsToSend: any = [];

  constructor(    
    public dialogRef: MatDialogRef<TaxCommentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commentService: TaxCommentService) {
      dialogRef.disableClose = true;
      console.log(data);
      this.modalDetails = data;
      if (this.modalDetails.type === "ConfirmationTextUpload") {
        this.ConfirmationTextUpload = true;
        this.modalForm = this.fb.group({
          sendTo: ['EY'],
          comment: ['', [Validators.required, Validators.maxLength(250), this.noWhitespaceValidator, Validators.pattern('[a-zA-Z0-9-_:/*$%.,@+? ]*')]],
          edit:[false],
          assignTo:['1'],
          critical: [false],
          IncludeDebrief : [false],
          files: ['']
        });
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
       
      if(this.modalForm.get('edit').value){
        this.TagsToSend.push(1);
      }

      if(this.modalForm.get('IncludeDebrief').value){
        this.TagsToSend.push(2);
      }
  
      const commentObj = {
        "description": this.modalForm.get('comment').value,
        "status": "open",
        "priority": this.modalForm.get('critical').value ? 1: 0,
        "target": this.modalForm.get('sendTo').value.toLowerCase(),
        "tags": this.TagsToSend
      };

      this.commentService.addTask(commentObj, this.modalDetails.entityId).subscribe(res => {
        if (this.filesList.length) {
          const userEmail = sessionStorage.getItem('userEmail');
          let formData = new FormData();
          formData.append('application', "TAX");
          formData.append('entityId', res['data']['id']);
          formData.append('entityType', "TASK");
          formData.append('mode', "SYNC");
          formData.append('uploadedBy', userEmail);
          this.filesList.forEach(element => {
            formData.append('files', element.file.rawFile);
          });
            this.commentService.uploadFile(formData).subscribe(uploadRes => {
            this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
          }, uploadError => {
            console.log(uploadError);
            this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
          });
        } else {
          console.log("There are no files to attach in the comment.");
          this.dialogRef.close({ button: this.modalDetails.footer.YesButton });       
        }
      }, error => {
        console.log(error);
        this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
      });
    } else {
      this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
    }
  }

  uploadedFiles(emitiedFiles) {
    this.filesList = emitiedFiles;
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

  closeToast(){
    this.showToastAfterSubmit = !this.showToastAfterSubmit;
    this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
  }

  setMarkCritical(){
    this.markCritical = !this.markCritical;
  }

  setEditRequired(){
    this.editReq = !this.editReq;
    this.modalForm.patchValue({
      edit: this.editReq
    });    
  }

}
