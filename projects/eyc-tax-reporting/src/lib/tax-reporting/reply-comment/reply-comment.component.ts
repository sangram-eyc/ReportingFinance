import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss']
})
export class ReplyCommentComponent implements OnInit {

  @Input() ReplyCommentData : any;
  createdDate:any;
  createdBy:any;
  description:any;
  constructor() { }

  ngOnInit(): void {
    this.createdDate = this.ReplyCommentData.timeStamp;
    this.createdBy = this.ReplyCommentData.authorFirstName + ' ' + this.ReplyCommentData.authorLastName;
    this.description = this.ReplyCommentData.commentText;
  }

}
