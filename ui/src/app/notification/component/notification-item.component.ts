import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Notification } from '../model/notification';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
    selector: 'notification-item',
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {
    @Input() notification: Notification;
    @Output() clear: EventEmitter<Notification> = new EventEmitter<Notification>();
    readonly timerCallback = () => this.clear.emit(this.notification);
    constructor(
        private announce: LiveAnnouncer
    ) {}

    ngOnInit(): void {
        if (this.notification.timeout > 0) {
            setTimeout(this.timerCallback, this.notification.timeout);
        }

        this.announce.announce(`Error: ${this.notification.body}`);
    }
} /* istanbul ignore next */
