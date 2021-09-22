import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createdBy = this.TaskCommentData.createdBy;
    this.createdDate = this.TaskCommentData.createdDate;
    this.createdBy = this.TaskCommentData.createdBy;
    this.description = this.TaskCommentData.description;
    console.log('task-comments-data-receiving',this.TaskCommentData)
  }
}
