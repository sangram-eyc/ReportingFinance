import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaxCommentModalComponent } from '../../shared/tax-comment-modal/tax-comment-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'comments-page',
  templateUrl: './comments-page.component.html',
  styleUrls: ['./comments-page.component.scss']
})

export class CommentsPagecomponent implements OnInit {

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  pageName:string = 'Comments-Page';
  fundName; 
  productCycleId;
  productCycleName;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.fundName = params.name
      this.productCycleId = params.id
      this.productCycleName = params.prodCycleName
    });
  }

  backtoCycleView(){
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
        console.log('result afterClosed',result);
      }
    }); 
  }
}
