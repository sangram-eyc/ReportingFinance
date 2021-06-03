import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsCardComponent } from './dots-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

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
      imports: [RouterTestingModule],
      providers : [{ provide: Router, useValue: router }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('get status', () => {
    let state = 'not-set';
    let step =3;
    let index = 2;

    if (index < step) {
      state = 'completed';
    } else if (index === step) {
      state = 'in-progress';
    }

    let result = component.getStatus(index)
    expect(result).toBe(state)

  });


  it('dots onclick', () => {
    let pageUrl = 'client-review';
    let enableRoute = false;
    component.handleStepClick(pageUrl, enableRoute)
    expect(router.navigate).toHaveBeenCalledWith([pageUrl])
  });

  /* describe('greet', () => {
    let curPage;
    it('should include the name in the message', () => {
      expect(router.navigate().includes('fund-scoping'))
      curPage = 'scoping';
    });
  }); */



  /* describe('dots onclick', () => {
    let currentStep = 3;
    let redirect = 'no';
    let step = 3;
 
    if (currentStep <= step) {
      redirect = 'yes';
    }

    if (redirect === 'yes') { 

      it('tests scoping', () => {
        let currentStep = 1;
        let pagename = 0;
        let event;
        component.handleStepClick(event, currentStep, pagename)
        expect(router.navigate).toHaveBeenCalledWith(['fund-scoping'])
      });

      it('tests intake', () => {
        let currentStep = 2;
        let pagename = 1;
        let event;
        component.handleStepClick(event, currentStep, pagename)
        expect(router.navigate).toHaveBeenCalledWith(['data-intake'])
      });

      it('tests review', () => {
        let currentStep = 2;
        let pagename = 3;
        let event;
        component.handleStepClick(event, currentStep, pagename)
        expect(router.navigate).toHaveBeenCalledWith(['client-review'])
      });

      it('tests reporting', () => {
        let currentStep = 1;
        let pagename = 2;
        let event;
        component.handleStepClick(event, currentStep, pagename)
        expect(router.navigate).toHaveBeenCalledWith(['regulatory-reporting'])
      });

      it('tests submission', () => {
        let currentStep = 1;
        let pagename = 4;
        let event;
        component.handleStepClick(event, currentStep, pagename)
        expect(router.navigate).toHaveBeenCalledWith(['submission'])
      });

    }
    
  }); */

});
