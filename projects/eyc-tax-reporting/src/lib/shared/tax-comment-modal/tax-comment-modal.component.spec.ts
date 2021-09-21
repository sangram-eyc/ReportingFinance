import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCommentModalComponent } from './tax-comment-modal.component';

describe('TaxCommentModalComponent', () => {
  let component: TaxCommentModalComponent;
  let fixture: ComponentFixture<TaxCommentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
