import { Component, Input, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { TaxCommentService } from '../services/tax-comment.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

  @Input() TaskCommentData:any;

  Requestfrom:string = 'Client'
  createdBy:string = 'Patrick Mahomes'
  createdDate:any;
  description:any;
  status:any;
  target:any;
  company:any;
  editRequired:any;
  includeDebrief:any;
  priority:number;
  idTask:any;
  showReplyComment:boolean = false;
  showReplyCommentButton:boolean = true;
  statusSelected:string ='open';
  ReplayForm: FormGroup;
  entityId:any;
  entityType:any;
  showToastAfterSubmit = false;
  toastSuccessMessage = "Comment added successfully";
  arrowReplay = true;
  replyCount:any;
  replyData:any = [];
  formattedTimes = [];

  constructor(
    private router: Router,
    private commentService: TaxCommentService,
    private fb: FormBuilder
  ) {

    this.ReplayForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(250), this.noWhitespaceValidator]],
      statusReplay:['open']
    });
  }

  ngOnInit(): void {
    this.createdBy = this.TaskCommentData.createdBy;
    this.createdDate = this.TaskCommentData.createdDate;
    this.createdBy = this.TaskCommentData.createdBy;
    this.description = this.TaskCommentData.description;
    this.status = this.TaskCommentData.status.toLowerCase();
    this.target = this.TaskCommentData.target.toLowerCase();
    this.company = this.TaskCommentData.company.toLowerCase();
    this.priority = this.TaskCommentData.priority;
    this.idTask = this.TaskCommentData.id;
    const tags = this.TaskCommentData.tags;
    this.editRequired = tags.find(tag => tag.id === 1);
    this.includeDebrief = tags.find(tag => tag.id === 2);
    this.entityId = this.TaskCommentData.entityId;
    this.entityType = this.TaskCommentData.entityType;
    //this.replyCount = this.TaskCommentData.replyCount;
    console.log('task-comments-data-receiving',this.TaskCommentData)
    //Tempo
    this.commentService.listComments(this.idTask).subscribe(resp => {     
      this.replyData = resp['data'];
      this.replyCount = this.replyData.length;
    });

  }

  setStatusComment(_status){
   this.status = _status;
    console.log('set status comment-->', _status);    
    console.log('this.idTask-->', this.idTask); 
      const objData = {
        "status": _status
      };     
      this.commentService.updateTaskStatus(this.idTask, objData).subscribe(res => {
        console.log('response update status', res);
      }, error => {
        console.log('Error update status', error);
      });
  }


  ReplyComment(){
    this.showReplyNewComment()
    console.log('form-->', this.ReplayForm);
    console.log('comment ->', this.ReplayForm.get('comment').value);
    console.log('status replay ->', this.ReplayForm.get('statusReplay').value);

    const commentObj = {
      "comment": escape(this.ReplayForm.get('comment').value),
      "entityId": this.entityId,
      "entityType": "TASK",
    };

    this.commentService.addComment(commentObj).subscribe(res =>{
      console.log('Reponse add Replay -->',res);
      let newStatus = this.ReplayForm.get('statusReplay').value;
      const objStatus = {
        "status": newStatus
      };
      this.commentService.updateTaskStatus(this.idTask, objStatus).subscribe(resStatus => {
        console.log('response update status', resStatus);
        this.status = objStatus.status;
        this.replyCount = this.replyCount + 1
        this.showToastAfterSubmit = true;
        setTimeout(() => {        
          this.closeToast();       
        }, 4000);
        this.arrowReplay = true; 
      }, error => {
        console.log('Error update status', error);
      });
    }, error => {
      console.log('Error replay comment', error);
    });
  }

  cancelReplyComment(){
    this.showReplyNewComment();
  }
  
  showReplyNewComment(){
    this.showReplyComment = !this.showReplyComment
    this.showReplyCommentButton = !this.showReplyCommentButton
  }

  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
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
    this.showToastAfterSubmit = false;
    this.ReplayForm.patchValue({
      comment: '',
      statusReplay: 'open'
    });
  }

  getListComments(){
    this.arrowReplay = !this.arrowReplay;   
    if(this.arrowReplay === false){
      this.commentService.listComments(this.idTask).subscribe(resp => {     
        this.replyData = resp['data'];
          this.replyData.forEach(comment => {
            comment.commentText = unescape(comment.commentText);
            comment.timeStamp = this.formatDate(comment.timeStamp);
          });
      });
    }
  }

  formatDate(timestamp) {
    const seconds = Math.floor((+new Date() - +new Date(timestamp)) / 1000);
    if (seconds < 29) {
      return 'Just now';
    } // less than 30 seconds ago will show as 'Just now'
    const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
    };
    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
        } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
        }
      }
    }
  }
}
