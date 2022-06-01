import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityExceptionDetailsComponent } from './entity-exception-details.component';

describe('EntityExceptionDetailsComponent', () => {
  let component: EntityExceptionDetailsComponent;
  let fixture: ComponentFixture<EntityExceptionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityExceptionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityExceptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
