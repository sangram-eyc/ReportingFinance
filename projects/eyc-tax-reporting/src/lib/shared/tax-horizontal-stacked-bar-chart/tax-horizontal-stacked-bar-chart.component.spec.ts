import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxHorizontalStackedBarChartComponent } from './tax-horizontal-stacked-bar-chart.component';

describe('TaxHorizontalStackedBarChartComponent', () => {
  let component: TaxHorizontalStackedBarChartComponent;
  let fixture: ComponentFixture<TaxHorizontalStackedBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxHorizontalStackedBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxHorizontalStackedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
