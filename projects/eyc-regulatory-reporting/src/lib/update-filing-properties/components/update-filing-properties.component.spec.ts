import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFilingPropertiesComponent } from './update-filing-properties.component';

describe('UpdateFilingPropertiesComponent', () => {
  let component: UpdateFilingPropertiesComponent;
  let fixture: ComponentFixture<UpdateFilingPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFilingPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFilingPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
