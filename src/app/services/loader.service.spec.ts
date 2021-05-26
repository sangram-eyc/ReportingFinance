import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('show() should emit data to isLoading', () => {
    service.isLoading.next(true);
    service.show();
    service.isLoading.subscribe(res => {
      expect(res).toBe(true);
    });
  });

  it('hide() should emit data to isLoading', () => {
    service.isLoading.next(false);
    service.hide();
    service.isLoading.subscribe(res => {
      expect(res).toBe(false);
    });
  });
});
