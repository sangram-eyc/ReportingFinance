import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaxCommentService } from '../services/tax-comment.service';

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

  constructor(
    private router: Router,
    private commentService: TaxCommentService
  ) {}

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
    console.log('task-comments-data-receiving',this.TaskCommentData)
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
    this.showReplyComment = !this.showReplyComment
    this.showReplyCommentButton = !this.showReplyCommentButton
  }

  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
