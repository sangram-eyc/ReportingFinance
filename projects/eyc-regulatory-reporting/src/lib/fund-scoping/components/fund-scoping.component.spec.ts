import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundScopingComponent } from './fund-scoping.component';

describe('FundScopingComponent', () => {
  let component: FundScopingComponent;
  let fixture: ComponentFixture<FundScopingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundScopingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundScopingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
