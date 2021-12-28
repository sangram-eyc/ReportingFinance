import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationBarChartModalComponent } from './information-bar-chart-modal.component';

describe('InformationBarChartModalComponent', () => {
  let component: InformationBarChartModalComponent;
  let fixture: ComponentFixture<InformationBarChartModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationBarChartModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationBarChartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
