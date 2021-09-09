import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private count = 0;
    constructor(public loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req);
        if (this.count === 0) {
            this.loaderService.show();
        }
        this.count++;
        return next.handle(req).pipe(
            finalize(() => {
                this.count--;
                if (this.count === 0) {
                    this.loaderService.hide()
                }
            })

            /*  setTimeout(() => {
             this.loaderService.hide() }, 800)
             ) */
        );
    }
}