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

        if (this.count === 0 && req.url.indexOf('&export=true') == -1) {
            this.loaderService.show();
        }
        this.count++;
        return next.handle(req).pipe(
            finalize(() => {
                this.count--;
                if (this.count === 0) {
                    // setTimeout(() => {
                        this.loaderService.hide();                        
                    // }, 2000);
                }
            })

            /*  setTimeout(() => {
             this.loaderService.hide() }, 800)
             ) */
        );
    }
}