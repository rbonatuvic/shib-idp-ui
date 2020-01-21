import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

@Injectable()
export class ApiPathInterceptor implements HttpInterceptor {
    constructor(
        @Inject(APP_BASE_HREF) private baseHref: string
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiReq = req.clone({ url: `${this.baseHref}${req.url}` });
        console.log(req);
        return next.handle(apiReq);
    }
}
