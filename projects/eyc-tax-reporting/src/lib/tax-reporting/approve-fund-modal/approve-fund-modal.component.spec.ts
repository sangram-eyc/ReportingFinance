import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveFundModalComponent } from './approve-fund-modal.component';

describe('AssignUsersModalComponent', () => {
  let component: ApproveFundModalComponent;
  let fixture: ComponentFixture<ApproveFundModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveFundModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveFundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
