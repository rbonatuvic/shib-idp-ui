import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

class HttpCache {
    private store: {[key: string]: HttpResponse<any>};
    constructor() {
        this.store = {};
    }
    private generateKey(request: HttpRequest<any>): string {
        return `${request.method}.${request.urlWithParams}.${request.responseType}`;
    }
    get(req: HttpRequest<any>): HttpResponse<any> | null {
        return this.store[this.generateKey(req)];
    }
    put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
        this.store[`${req.method}.${req.urlWithParams}`] = resp;
    }
    clear(): void {
        this.store = {};
    }
}

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    private cache: HttpCache;

    constructor() {
        this.cache = new HttpCache();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method !== 'GET') {
            this.cache.clear();
            return next.handle(req);
        }
        const cachedResponse = this.cache.get(req);
        if (cachedResponse) {
            return of(cachedResponse);
        }
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cache.put(req, event);
                }
            })
        );
    }
} /* istanbul ignore next */
