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
});