import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IntakeLandingService } from '../../services/intake-landing.service';

import { IntakeLandingComponent } from './intake-landing.component';

describe('IntakeLandingComponent', () => {
  let component: IntakeLandingComponent;
  let fixture: ComponentFixture<IntakeLandingComponent>;

  let intakeLandingServiceStub = {
    apiDateFormat:()=>{
      return of({})
    },
    monthlyFormat:()=>{
      return of({})
    },
    businessDate:()=>{
      return of({})
    },
    prevMonthLastDate:()=>{
      return of({})
    },
    getFileSummaryList:()=>{
      return of({})
    },
    monthLastDate:()=>{
      return of({})
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeLandingComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers:[
        {provide: IntakeLandingService, useValue:intakeLandingServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeLandingComponent);
    component = fixture.componentInstance;
    //component.presentDate = new Date()
    component.baseURL ='/url/'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reportTabChange method should set the tab',()=>{
    component.reportTabChange(2);
    expect(component.tabIn).toEqual(2);
  });

  it('innerTabChange method should change the tab 2',()=>{
    component.innerTabChange(2)
    expect(component.innerTabIn ).toEqual(2);
    expect(component.httpQueryParams.dataFrequency).toEqual('Monthly')
  })

  it('innerTabChange method should change the tab',()=>{
    component.innerTabChange(3)
    expect(component.innerTabIn ).toEqual(3);
    expect(component.httpQueryParams.dataFrequency).toEqual('Monthly')
  })
 
});
