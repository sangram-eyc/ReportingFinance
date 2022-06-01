import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualExceptionsResolveComponent } from './individual-exceptions-resolve.component';

describe('IndividualExceptionsResolveComponent', () => {
  let component: IndividualExceptionsResolveComponent;
  let fixture: ComponentFixture<IndividualExceptionsResolveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualExceptionsResolveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualExceptionsResolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
