import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import {DonutTaxChartComponent} from './donut-tax-chart.component';

describe('DonutTaxChartComponent', () => {
  let component: DonutTaxChartComponent;
  let fixture: ComponentFixture<DonutTaxChartComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutTaxChartComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
        FormsModule
      ],
      providers: [
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production},
        {provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutTaxChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should set the variables', () => {
    expect(component.width).toEqual(135);
    expect(component.height).toEqual(135);
    expect(component.margin).toEqual(10);
    expect(component.innerRadius).toEqual(80);
    expect(component.svgTranslateLeft).toEqual(80);
    expect(component.svgTranslateRight).toEqual(80);
    expect(component.donut_id).toEqual("");
    expect(component._colors).toEqual(["#57E188", "#42C9C2", "#FF9831", "#FF736A", "#E7E7EA"]);
    expect(component.fileSummaries).toEqual([]);
    expect(component.totalFilesNumber).toEqual(600);
    expect(component.totalFilesNumberFontSize).toEqual(39);
    expect(component.totalFilesText).toEqual("TOTAL FILES");
    expect(component.totalFilesTextFontSize).toEqual(12);
    expect(component.totalExpected).toEqual("EXPECTED");
  });
  it('trackItem should return index', () => {
    expect(component.trackItem(1)).toEqual(1);
  });
});