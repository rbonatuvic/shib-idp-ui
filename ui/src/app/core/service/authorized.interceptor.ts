import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as fromUser from '../reducer/user.reducer';
import { UserRedirect } from '../action/user.action';

@Injectable()
export class AuthorizedInterceptor implements HttpInterceptor {
    constructor(private store: Store<fromUser.UserState>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(req)
            .pipe(
                catchError((error) => {
                    if (!error.url.match(req.url)) {
                        this.store.dispatch(new UserRedirect(error.url));
                    }
                    return throwError(error);
                })
            );
    }
} /* istanbul ignore next */
