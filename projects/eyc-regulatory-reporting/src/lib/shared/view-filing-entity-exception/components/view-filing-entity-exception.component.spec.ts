import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFilingEntityExceptionComponent } from './view-filing-entity-exception.component';

describe('ViewFilingEntityExceptionComponent', () => {
  let component: ViewFilingEntityExceptionComponent;
  let fixture: ComponentFixture<ViewFilingEntityExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFilingEntityExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFilingEntityExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
