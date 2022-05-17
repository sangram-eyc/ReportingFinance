import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { AssignmentsFundsService } from '../services/assignments-funds.service';
import { TaxCommentService } from '../services/tax-comment.service';
import { CommentsPagecomponent} from './comments-page.component';
describe('CommentsPageComponent', () => {
  let component: CommentsPagecomponent;
  let fixture: ComponentFixture<CommentsPagecomponent>;
  let commentService: TaxCommentService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsPagecomponent ],
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
    fixture = TestBed.createComponent(CommentsPagecomponent);
    commentService = TestBed.get(TaxCommentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get getComments', () => {
    let commentsList = []
    fixture.detectChanges();
    const result$ = commentService.getTasksData(1);
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        if (item.fundDTO.totalComments > 0) {
          item.tasks.forEach(itemTask => {
            const eachitem: any = {
                id: item.id,
                entityId: item.entityId,
                entityType: item.entityType,
                description: item.description,
                status: item.status,
                priority: item.priority,
                target: item.target,
                company: item.company,
                author: item.author,
                createdBy: item.createdBy,
                createdDate: item.createdDate,
                tags: item.tags,
                replyCount: item.replyCount,
                attachmentsCount: (item.attachmentsCount == undefined || item.attachmentsCount == null) ? 0 : item.attachmentsCount,
                attachments:item.attachments,
                priorityToFind: item.priority == 1 ? "critical":"",
                tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
                tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
                authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy
              };
            commentsList.push(eachitem);
          });
        }
      });
    })
    expect(component.completedComments).toEqual(commentsList);
  });
  it('should call updateHasOpenComments', () => {
    component.updateHasOpenComments('open');
    expect(component.hasOpenComments).toEqual(true);
  });
  it('should call isOpenStatus', () => {
    expect(component.isOpenStatus('open')).toEqual(true);
  });
  it('should call canAddComments and return false', () => {
    expect(component.canAddComments()).toEqual(false);
  });
  it('should call canApprove and return false', () => {
    expect(component.canApprove()).toEqual(false);
  });
  it('should call closeToast and showToastAfterSubmit variable should be false', () => {
    component.closeToast();
    expect(component.showToastAfterSubmit).toEqual(false);
  });
});