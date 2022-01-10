import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedNotificationsComponent } from './archived-notifications.component';

describe('ArchivedNotificationsComponent', () => {
  let component: ArchivedNotificationsComponent;
  let fixture: ComponentFixture<ArchivedNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
