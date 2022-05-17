import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { AssignmentsFundsService } from '../services/assignments-funds.service';
import { TaxCommentService } from '../services/tax-comment.service';
import { CommentsDetailsComponent } from './comments-details.component';

describe('CommentsDetailsComponent', () => {
  let component: CommentsDetailsComponent;
  let fixture: ComponentFixture<CommentsDetailsComponent>;
  let commentService: TaxCommentService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsDetailsComponent ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([])
      ],
      providers: [
          AssignmentsFundsService,
          TaxCommentService,
          {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
          {provide:"taxProduction",  useValue: taxenvironment.production},
          {provide: MatDialogRef, useValue: {} },
          {provide: MAT_DIALOG_DATA, useValue: {} },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsDetailsComponent);
    commentService = TestBed.get(TaxCommentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call handleGridReady', () => {
    component.handleGridReady({api: ''});
    expect(component.gridApi).toEqual('');
  });
  it('should get getCommentsList', () => {
    let commentsList = []
    fixture.detectChanges();
    const result$ = commentService.cycleCommentsDetails(10);
    console.log(result$);
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        if (item.fundDTO.totalComments > 0) {
          item.tasks.forEach(itemTask => {
            const eachitem: any = {
              id: itemTask.id,
              entityId: item.fundDTO.id,
              entityName: item.fundDTO.name,
              description: itemTask.description,
              completedComment: itemTask.description,
              status: itemTask.status.toLowerCase(),
              priority: itemTask.priority,
              target: itemTask.target.toUpperCase(),
              company: itemTask.company,
              author: itemTask.author != null ? (itemTask.author.userFirstName + " " + itemTask.author.userLastName) : itemTask.createdBy, //toDo if null
              createdBy: itemTask.createdBy,
              createdDate: itemTask.createdDate,
              tags: itemTask.tags,
              replyCount: itemTask.replyCount,
              assignedTo: item.fundDTO.assignedUsers == null ? [] : item.fundDTO.assignedUsers
            };
            commentsList.push(eachitem);
          });
        }
      });
    })
    expect(component.completedComments).toEqual(commentsList);
  });
});
