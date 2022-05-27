import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { ArchivedReportsComponent } from './archived-reports.component';
import { ArchivedReportsService } from '../services/archived-reports.service';

describe('ArchivedReportsComponent', () => {
  let component: ArchivedReportsComponent;
  let fixture: ComponentFixture<ArchivedReportsComponent>;
  let service : ArchivedReportsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedReportsComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        ArchivedReportsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedReportsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ArchivedReportsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the service', () => {
    expect(service instanceof ArchivedReportsService).toBeTruthy();
  });
  it('should get getArchivedReportData and get de ArchivedReportData', () => {
    let archivedReportData = []
    fixture.detectChanges();
    const result$ = service.getArchivedReportsData();
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.name,
          id: item.id,
          fundCount: item.fundCount != null ? item.fundCount : 0,
          totalComments: item.totalComments != null ? item.totalComments : 0,
          year: item.year

        };
        archivedReportData.push(eachitem);
      });
    })
    expect(component.completedReports).toEqual(archivedReportData);
  });
  it('handleGridReady method should set grid', () => {
    let mockData = {
      api: '/data'
    };
    component.handleGridReady(mockData);
    expect(component.gridApi).toEqual('/data')
  });
  it('should format date', () => {
    expect(component.formatDate(1624288509000)).toEqual('06/21/2021');
  });
  it('isFirstColumn method should set first colummn', () => {
    let mockData = {
      data: {
        approved: false
      },
      columnApi: {
        getAllDisplayedColumns: () => {
          return [{ column: '' }]
        }
      }
    }
    expect(component.isFirstColumn(mockData)).toEqual(false);
  })
  it( `searchFilingValidation`, () => {
    const keyEvent = new KeyboardEvent('keypress', {key: "abc"});
    const checkVal = component.searchFilingValidation(keyEvent);
    expect(checkVal).toBeFalsy();
  });  
});
