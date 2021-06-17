import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsCardComponent } from './dots-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../../../src/environments/environment';

describe('DotsCardComponent', () => {
  let component: DotsCardComponent;
  let fixture: ComponentFixture<DotsCardComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate'),
    url: jasmine.createSpy('url')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotsCardComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {provide: Router, useValue: router},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotsCardComponent);
    component = fixture.componentInstance;
    component.filingName = 'AIFMD';
    component.period = 'Q4 2021';
    component.dueDate = "2021-06-30";
    component.states = [
      {
        "stage": "Fund Scoping",
        "stageId": 1,
        "stageCode": "FUND_SCOPING",
        "progress": "In Progress",
        "displayOrder": 1
      },
      {
        "stage": "Intake",
        "stageId": 2,
        "stageCode": "DATA_INTAKE",
        "progress": "In Progress",
        "displayOrder": 2
      },
      {
        "stage": "Reporting",
        "stageId": 3,
        "stageCode": "REPORTING",
        "progress": "Not Started",
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
  
  it('get status', () => {
    let result = component.getStatus(1);
    expect(result).toBe('In Progress');
  });


  it('dots onclick', () => {
    let pageUrl = 'client-review';
    let enableRoute = false;
    component.handleStepClick(pageUrl, enableRoute)
    expect(router.navigate).toHaveBeenCalledWith([pageUrl])
  });

  describe('The function progressSort...', () => {
    let a = {
      displayOrder: 2
    }
    let b = {
      displayOrder: 3
    }
    it(`- should return -1 when a < b`, () => {
      let result = component.progressSort(a, b);
      expect(result).toBe(-1);
    });
    it(`- should return 1 when a > b`, () => {
      let result = component.progressSort(b, a);
      expect(result).toBe(1);
    });
    it(`- should return 0 when a === b`, () => {
      let result = component.progressSort(a, a);
      expect(result).toBe(0);
    });
  });
});
