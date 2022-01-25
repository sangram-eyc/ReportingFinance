import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDetailsPrComponent } from './comment-details-pr.component';

describe('CommentDetailsPrComponent', () => {
  let component: CommentDetailsPrComponent;
  let fixture: ComponentFixture<CommentDetailsPrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentDetailsPrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentDetailsPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
