import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReplyCommentComponent } from './reply-comment.component';

describe('ReplyCommentComponent', () => {
  let component: ReplyCommentComponent;
  let fixture: ComponentFixture<ReplyCommentComponent>;
  let mockedReplyCommentData = {
    createdDate : '12/05/2022',
    createdBy : 'user',
    description : 'test description',
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyCommentComponent ],
      imports:[ MatDialogModule ],
      providers: [{provide: MatDialogRef, useValue: {} },]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyCommentComponent);
    component = fixture.componentInstance;
    component.ReplyCommentData = mockedReplyCommentData;
    fixture.detectChanges();
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit method should set variables',() => {
    let mockedReplyCommentData = {
      timeStamp: '12/12/12',
      authorFirstName: 'Test name',
      authorLastName: 'Test LastName',
      commentText: 'Comment Text'
    };
    component.ReplyCommentData = mockedReplyCommentData;
    component.ngOnInit();
    expect(component.createdDate).toEqual(mockedReplyCommentData.timeStamp);
    expect(component.createdBy).toEqual(mockedReplyCommentData.authorFirstName + ' ' + mockedReplyCommentData.authorLastName);
    expect(component.description).toEqual(mockedReplyCommentData.commentText);
  });
});