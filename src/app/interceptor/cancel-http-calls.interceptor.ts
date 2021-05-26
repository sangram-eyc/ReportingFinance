import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivationEnd } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SettingsService } from '../services/settings.service';
@Injectable()
export class CancelHttpCallsInterceptor implements HttpInterceptor {

  constructor(router: Router,
    private settingService: SettingsService) {
    router.events.subscribe(event => {
      // An event triggered at the end of the activation part of the Resolve phase of routing.
      if (event instanceof ActivationEnd) {
        // Cancel pending calls
        this.settingService.cancelPendingRequests();
      }
    });
  }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(takeUntil(this.settingService.onCancelPendingRequests()))
  }
}
