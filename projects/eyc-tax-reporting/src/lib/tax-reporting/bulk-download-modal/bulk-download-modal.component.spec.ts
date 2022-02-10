import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDownloadModalComponent } from './bulk-download-modal.component';

describe('BulkDownloadModalComponent', () => {
  let component: BulkDownloadModalComponent;
  let fixture: ComponentFixture<BulkDownloadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDownloadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDownloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
