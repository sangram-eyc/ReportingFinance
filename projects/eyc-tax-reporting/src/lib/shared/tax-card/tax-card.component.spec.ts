import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TaxCardComponent } from './tax-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
describe('TaxCardComponent', () => {
  let component: TaxCardComponent;
  let fixture: ComponentFixture<TaxCardComponent>;
   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaxCardComponent],
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production},
      ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should set variables', () => {
    expect(component.reportWidth).toEqual(15);
    expect(component.periodWidth).toEqual(10);
    expect(component.author).toEqual('');
    expect(component.name).toEqual('');
    expect(component.createdDate).toEqual('');
    expect(component.downloadUrl).toEqual('');
  });
  it('sortStates should sort states by displayOrder', () => {
    let a = {displayOrder: 2};
    let b = {displayOrder: 1};
    expect(component.sortStates(a,b)).toEqual(1);
  });
  it('onResize should set width the height', () => {
    component.onResize(null);
    expect(component.reportWidth).toEqual(15);
    expect(component.periodWidth).toEqual(10);
  });
});