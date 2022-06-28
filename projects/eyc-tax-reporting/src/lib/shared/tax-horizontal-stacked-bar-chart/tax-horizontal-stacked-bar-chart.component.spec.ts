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
  it('it should set the variables', () => {
    expect(component.data).toEqual([]);
    expect(component.widthServer).toEqual(0);
    expect(component.keys).toEqual([]);
    expect(component.labelsChart).toEqual([]);
    expect(component.colors).toEqual([]);
    expect(component.dataValues).toEqual([]);
    expect(component.totalValues).toEqual(0);
    expect(component.emptyMsg).toEqual("NO DATA RECEIVED");
    expect(component.chart_id).toEqual("chart_id");
  });
  it('trackItem should return index', () => {
    expect(component.trackItem(1)).toEqual(1);
  });
});
