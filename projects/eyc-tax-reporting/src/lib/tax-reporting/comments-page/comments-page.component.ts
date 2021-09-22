import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaxCommentModalComponent } from '../../shared/tax-comment-modal/tax-comment-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TaxCommentModalService } from '../../tax-reporting/services/tax-comment-modal.service';

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
    private commentService: TaxCommentModalService
  ) { }

  isData: boolean = false;
  completedComments: any[] = [];
  pageName: string = 'Comments-Page';
  fundName;
  productCycleId;
  productCycleName;

  ngOnInit(): void {
    //Get the production-cycle-details values
    this.activatedRoute.params.subscribe(params => {
      this.fundName = params.name
      this.productCycleId = params.id
      this.productCycleName = params.prodCycleName
    });
    //Get all the comments related with the selected Production-Cycle and Fund.
    this.getComments()
  }

  getComments() {
    this.commentService.getCommentsData().subscribe(resp => {
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
        entityId: 11, //send value from html
        entityType: "DATA_COMMENT_TAX",
        forms: {
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
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button === "Submit") {
        const obj = {
          comment: escape(result.data.comment),
          files: result.data.files
        }
        //Refresh comments
        console.log('Obj after closed-->', obj);
      } else {
        console.log('result afterClosed', result);
      }
    });
  }
}
