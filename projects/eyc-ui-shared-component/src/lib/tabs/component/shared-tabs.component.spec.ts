import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTabsComponent } from './shared-tabs.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('SharedTabsComponent', () => {
  let component: SharedTabsComponent;
  let fixture: ComponentFixture<SharedTabsComponent>;

  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTabsComponent ],
      imports: [RouterTestingModule],
      providers: [{provide: Router, useValue: router}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('report change should return tab number', () => {
    let tab = 1
    component.reportTabChange(tab)
    expect(component.tabIn).toBe(tab)
  })

  it('should navigate to data-explorer', () => {
    component.dataExplorer()
    expect(router.navigate).toHaveBeenCalledWith(['/data-explorer']);
  })
  
});
