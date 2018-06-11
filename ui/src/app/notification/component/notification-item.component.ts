import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromNotifications from '../reducer';
import { Notification } from '../model/notification';

@Component({
    selector: 'notification-item',
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {
    @Input() notification: Notification;
    @Output() clear: EventEmitter<Notification> = new EventEmitter<Notification>();
    types = {
        '0': 'alert-success',
        '1': 'alert-info',
        '2': 'alert-warning',
        '3': 'alert-danger'
    };
    readonly timerCallback = () => this.clear.emit(this.notification);
    constructor() {}

    ngOnInit(): void {
        if (this.notification.timeout > 0) {
            setTimeout(this.timerCallback, this.notification.timeout);
        }
    }
} /* istanbul ignore next */
