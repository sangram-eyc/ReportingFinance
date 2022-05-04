import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExtendModalComponent } from './session-extend-modal.component';

describe('SessionExtendModalComponent', () => {
  let component: SessionExtendModalComponent;
  let fixture: ComponentFixture<SessionExtendModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionExtendModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExtendModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
