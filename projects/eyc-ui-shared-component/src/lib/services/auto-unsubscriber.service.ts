import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoUnsubscriberService implements OnDestroy {
  private _destroy = new Subject<void>();

  public takeUntilDestroy = <T>(origin: Observable<T>): Observable<T> => origin.pipe(takeUntil(this._destroy));
  
  constructor() { }

  public ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    
  }
}
