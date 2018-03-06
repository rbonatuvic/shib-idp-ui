import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromNotifications from '../../notification/reducer';
import { AddNotification } from '../../notification/action/notification.action';
import { Notification, NotificationType } from '../../notification/model/notification';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private caches = [];
    constructor(private store: Store<fromNotifications.State>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(req)
            .catch((error) => {
                let msg = error.error;
                if (typeof msg !== 'string' && msg.hasOwnProperty('message')) {
                    msg = `${msg.exception}: ${msg.message}`;
                }
                this.store.dispatch(new AddNotification(new Notification(
                    NotificationType.Danger,
                    msg,
                    8000
                )));
                return Observable.throw(error);
            });
    }
}
