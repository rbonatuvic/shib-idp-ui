import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as fromNotifications from '../reducer';
import { ClearNotification } from '../action/notification.action';
import { Notification } from '../model/notification';

@Component({
    selector: 'notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent {
    notifications$: Observable<Notification[]>;

    max = 5;

    constructor(
        private store: Store<fromNotifications.State>
    ) {
        this.notifications$ = this.store
            .select(fromNotifications.getNotifications)
            .map(notifications => notifications.sort(this.sorter))
            .map(notifications => notifications.filter(this.filter));
    }

    sorter(a: Notification, b: Notification): number {
        return(a.createdAt < b.createdAt) ? - 1 : (a.createdAt > b.createdAt) ? 1 : 0;
    }

    filter(n: Notification, index): boolean {
        return index < 5;
    }

    clear(event: Notification): void {
        this.store.dispatch(new ClearNotification(event));
    }
} /* istanbul ignore next */
