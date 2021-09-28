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
          comment: ['', [Validators.required, Validators.maxLength(250), this.noWhitespaceValidator]],
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
 
      console.log('sendTo-->', this.modalForm.get('sendTo').value);
      console.log('Edit-->', this.modalForm.get('edit').value);
      console.log('comment-->', this.modalForm.get('comment').value);
      console.log('mark critical-->', this.modalForm.get('critical').value); 
      console.log('IncludeDebrief-->', this.modalForm.get('IncludeDebrief').value); 
      console.log('Formulario-->', this.modalForm);
      const commentObj = {
        "description": this.modalForm.get('comment').value,
        "priority": "critical",
        "target": "EY",
        "tags": [1, 2]
       /*  "entityId": this.modalDetails.entityId,
        "entityType": this.modalDetails.entityType, */
      };

      this.commentService.addComment(commentObj).subscribe(res => {
        console.log("Result addComment-->",res);
        console.log("filesList.length-->",this.filesList.length); 
        if (this.filesList.length) {
          const userEmail = sessionStorage.getItem('userEmail');
          let formData = new FormData();
          formData.append('application', "TAX");
          //formData.append('entityId', res['data']['commentId']);
          formData.append('entityType', "COMMENT");
          formData.append('mode', "SYNC");
          formData.append('uploadedBy', userEmail);
          this.filesList.forEach(element => {
            console.log('Arhivos -->', element);
            formData.append('files', element.file.rawFile);
          });
            this.commentService.uploadFile(formData).subscribe(uploadRes => {
            console.log("uploadRes-->",uploadRes);
            this.showModal = false;
            this.showToastAfterSubmit = !this.showToastAfterSubmit;
            setTimeout(() => {
              this.showToastAfterSubmit = !this.showToastAfterSubmit;      
              this.dialogRef.close({ button: this.modalDetails.footer.YesButton, data: this.modalForm.getRawValue() });         
            }, 4000); 
          }, uploadError => {
            console.log(uploadError);
            this.dialogRef.close({ button: this.modalDetails.footer.YesButton, data: this.modalForm.getRawValue() });
          });
        } else {
          this.showModal = false;
            this.showToastAfterSubmit = !this.showToastAfterSubmit;
           setTimeout(() => {
             this.showToastAfterSubmit = !this.showToastAfterSubmit;      
             this.dialogRef.close({ button: this.modalDetails.footer.YesButton });         
           }, 4000);            
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
    }
  }

  uploadedFiles(emitiedFiles) {
    this.filesList = emitiedFiles;
    console.log('Emiter files-->',this.filesList);
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
