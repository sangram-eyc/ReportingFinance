import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSideMenuComponent } from './comment-side-menu.component';

describe('CommentSideMenuComponent', () => {
  let component: CommentSideMenuComponent;
  let fixture: ComponentFixture<CommentSideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
