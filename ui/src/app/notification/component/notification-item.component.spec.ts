import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromNotifications from '../reducer';
import { NotificationItemComponent } from './notification-item.component';
import { Notification, NotificationType } from '../model/notification';
import { MockI18nModule } from '../../../testing/i18n.stub';

describe('Notification List Component', () => {
    let fixture: ComponentFixture<NotificationItemComponent>;
    let instance: NotificationItemComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    'notifications': combineReducers(fromNotifications.reducers),
                }),
                MockI18nModule
            ],
            declarations: [
                NotificationItemComponent
            ],
        });

        fixture = TestBed.createComponent(NotificationItemComponent);
        instance = fixture.componentInstance;
        instance.notification = new Notification();
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('timeout', () => {
        it('should timeout after the given number of seconds', fakeAsync(() => {
            spyOn(instance.clear, 'emit');
            instance.timerCallback();
            expect(instance.clear.emit).toHaveBeenCalled();
        }));

        it('should call timeout after the given number of seconds', fakeAsync(() => {
            spyOn(window, 'setTimeout');
            fixture = TestBed.createComponent(NotificationItemComponent);
            instance = fixture.componentInstance;
            instance.notification = new Notification();
            fixture.detectChanges();
            expect(window.setTimeout).toHaveBeenCalledWith(instance.timerCallback, instance.notification.timeout);
        }));

        it('should NOT clear if 0 is passed as the timeout of the notification', async () => {
            spyOn(window, 'setTimeout');
            instance.notification = new Notification(NotificationType.Info, 'foo', 0);
            fixture.detectChanges();
            expect(window.setTimeout).not.toHaveBeenCalled();
        });
    });
});
