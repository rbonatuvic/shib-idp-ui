import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as fromNotifications from '../../notification/reducer';
import { AddNotification } from '../../notification/action/notification.action';
import { Notification, NotificationType } from '../../notification/model/notification';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private caches = [];
    constructor(private store: Store<fromNotifications.State>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let msg = error.error;
                if (typeof msg !== 'string' && msg.hasOwnProperty('message')) {
                    msg = `${msg.exception}: ${msg.message}`;
                } else if (typeof msg === 'string') {
                    msg = this.getErrorMessage(error);
                }
                if (msg) {
                    this.store.dispatch(new AddNotification(new Notification(
                        NotificationType.Danger,
                        msg,
                        8000
                    )));
                }
                return throwError(error);
            })
        );
    }

    getErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 409: {
                return null;
            }
            default: {
                return 'Unknown server error!';
            }
        }
    }
}
