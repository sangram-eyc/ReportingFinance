import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { AdministrationComponent } from './administration.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


describe('AdministrationComponent', () => {
  let component: AdministrationComponent;
  let fixture: ComponentFixture<AdministrationComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrationComponent ],
      imports: [RouterTestingModule],
      providers: [{provide: Router, useValue: router}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to admin dashboard page', () => {
    component.routeAdminRR()
    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  })

});
