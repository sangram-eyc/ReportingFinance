import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EycDataManagementServicesComponent } from './eyc-data-managed-services.component';

describe('EycDataManagementServicesComponent', () => {
  let component: EycDataManagementServicesComponent;
  let fixture: ComponentFixture<EycDataManagementServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EycDataManagementServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EycDataManagementServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
