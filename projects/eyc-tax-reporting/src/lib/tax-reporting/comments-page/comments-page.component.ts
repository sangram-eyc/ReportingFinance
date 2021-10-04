import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaxCommentModalComponent } from '../../shared/tax-comment-modal/tax-comment-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TaxCommentService } from '../services/tax-comment.service';

@Component({
  selector: 'comments-page',
  templateUrl: './comments-page.component.html',
  styleUrls: ['./comments-page.component.scss']
})

export class CommentsPagecomponent implements OnInit {

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private commentService: TaxCommentService
  ) { }

  isData: boolean = false;
  completedComments: any[] = [];
  pageName: string = 'Comments-Page';
  fundName;
  fundId;
  productCycleName;

  ngOnInit(): void {
    //Get the production-cycle-details values
    this.activatedRoute.params.subscribe(params => {
      this.fundName = params.name
      this.fundId = params.id
      this.productCycleName = params.prodCycleName
    });
    //Get all the comments related with the selected Production-Cycle and Fund.
    this.getComments()
  }

  getComments() {
    this.completedComments = [];
    this.commentService.getTasksData(this.fundId).subscribe(resp => {
      console.log("call all comments", resp);
      resp['data'].length === 0 ? this.isData = false : this.isData = true;
      resp['data'].forEach((item) => {
        const eachitem: any = {
          id: item.id,
          entityId: item.entityId,
          entityType: item.entityType,
          description: item.description,
          status: item.status,
          priority: item.priority,
          target: item.target,
          company: item.company,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          tags: item.tags,
          replyCount: item.replyCount,
          attachmentCount: item.attachmentCount
        };
        this.completedComments.push(eachitem);
      })
    })
  }

  backtoCycleView() {
    this.location.back();
  }

  addCommentToFund() {
    const dialogRef = this.dialog.open(TaxCommentModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "New comment",
        description: ``,
        entityId: this.fundId,
        entityType: "funds",
        forms: {
          isSelect: true,
          selectDetails: {
            label: "Scope",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: this.fundName, id: '1' },
            ]
          },
          isTextarea: true,
          textareaDetails: {
            label: "Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Post",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button === "Post") {
        //Refresh comments Submit
        this.getComments();
      } else {
        console.log('result afterClosed', result);
      }
    });
  }
}