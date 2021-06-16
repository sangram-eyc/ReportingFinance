import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FilingCardComponent } from './filing-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../../../src/environments/environment';
describe('FilingCardComponent', () => {
  let component: FilingCardComponent;
  let fixture: ComponentFixture<FilingCardComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate'),
    url: jasmine.createSpy('url')
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilingCardComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {provide: Router, useValue: router},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilingCardComponent);
    component = fixture.componentInstance;
    component.startDate = '';
    component.dueDate = "2021-06-30";
    component.comments = [];
    component.name = "AIFMD";
    component.period = "Q4 2021";
    component.status = {
      stage: 'Reporting',
      progress: 'In Progress',
      stageCode: 'REPORTING'
    };
    component.states = [
      {
        "stage": "Fund Scoping",
        "stageId": 1,
        "stageCode": "FUND_SCOPING",
        "progress": "Completed",
        "displayOrder": 1
      },
      {
        "stage": "Intake",
        "stageId": 2,
        "stageCode": "DATA_INTAKE",
        "progress": "Completed",
        "displayOrder": 2
      },
      {
        "stage": "Reporting",
        "stageId": 3,
        "stageCode": "REPORTING",
        "progress": "In Progress",
        "displayOrder": 3
      },
      {
        "stage": "Client review",
        "stageId": 4,
        "stageCode": "CLIENT_REVIEW",
        "progress": "Not Started",
        "displayOrder": 4
      },
      {
        "stage": "Submission",
        "stageId": 5,
        "stageCode": "SUBMISSION",
        "progress": "Not Started",
        "displayOrder": 5
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date', () => {
    component.formatDate();
    expect(component.dueDate).toBe('06/29/2021');
  });

  describe('The function sortStates...', () => {
    let a = {
      displayOrder: 2
    }
    let b = {
      displayOrder: 3
    }
    it(`- should return -1 when a < b`, () => {
      let result = component.sortStates(a, b);
      expect(result).toBe(-1);
    });
    it(`- should return 1 when a > b`, () => {
      let result = component.sortStates(b, a);
      expect(result).toBe(1);
    });
    it(`- should return 0 when a === b`, () => {
      let result = component.sortStates(a, a);
      expect(result).toBe(0);
    });
  });

  it('should route to details view', () => {
    let pageUrl = '/regulatory-reporting';
    component.routeToDetailsView();
    expect(router.navigate).toHaveBeenCalledWith([pageUrl])
  });
});
