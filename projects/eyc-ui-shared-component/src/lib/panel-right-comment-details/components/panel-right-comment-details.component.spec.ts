import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelRightCommentDetailsComponent } from './panel-right-comment-details.component';

describe('PanelRightCommentDetailsComponent', () => {
  let component: PanelRightCommentDetailsComponent;
  let fixture: ComponentFixture<PanelRightCommentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelRightCommentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelRightCommentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
