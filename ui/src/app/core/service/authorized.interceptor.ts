import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromUser from '../reducer/user.reducer';
import { UserRedirect } from '../action/user.action';

@Injectable()
export class AuthorizedInterceptor implements HttpInterceptor {
    constructor(private store: Store<fromUser.UserState>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(req)
            .catch((error) => {
                if (!error.url.match(req.url)) {
                    this.store.dispatch(new UserRedirect(error.url));
                }
                return Observable.throw(error);
            });
    }
} /* istanbul ignore next */
