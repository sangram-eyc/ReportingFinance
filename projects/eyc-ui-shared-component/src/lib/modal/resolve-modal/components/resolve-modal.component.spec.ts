import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveModalComponent } from './resolve-modal.component';

describe('ResolveModalComponent', () => {
  let component: ResolveModalComponent;
  let fixture: ComponentFixture<ResolveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
