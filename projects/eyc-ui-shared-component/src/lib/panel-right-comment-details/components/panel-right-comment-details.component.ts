import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-panel-right-comment-details',
  templateUrl: './panel-right-comment-details.component.html',
  styleUrls: ['./panel-right-comment-details.component.scss']
})
export class PanelRightCommentDetailsComponent implements OnInit {

  commentfromApi:any;
  constructor(public dialogRef: MatDialogRef<PanelRightCommentDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.commentfromApi = data.dataComent;         
               }

  ngOnInit(): void { }

}
