import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCatalogComponent } from './api-catalog.component';

describe('ApiCatalogComponent', () => {
  let component: ApiCatalogComponent;
  let fixture: ComponentFixture<ApiCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
