import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromNotifications from '../reducer';
import { NotificationListComponent } from './notification-list.component';
import { NotificationItemComponent } from './notification-item.component';
import { Notification } from '../model/notification';

describe('Notification List Component', () => {
    let fixture: ComponentFixture<NotificationListComponent>;
    let instance: NotificationListComponent;
    let store: Store<fromNotifications.NotificationState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    'notifications': combineReducers(fromNotifications.reducers),
                })
            ],
            declarations: [
                NotificationListComponent,
                NotificationItemComponent
            ],
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(NotificationListComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(fixture).toBeDefined();
    });

    describe('clear function', () => {
        it('should dispatch a clear action to the store', () => {
            instance.clear(new Notification());
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('sorter function', () => {
        it('should return -1 if the first parameter was created first', () => {
            const a = new Notification();
            const b = new Notification();
            b.createdAt = Date.now() + 1;
            expect(instance.sorter(a, b)).toBe(-1);
        });
        it('should return -1 if the first parameter was created first', () => {
            const a = new Notification();
            const b = new Notification();
            a.createdAt = Date.now() + 1;
            expect(instance.sorter(a, b)).toBe(1);
        });
        it('should return -1 if the first parameter was created first', () => {
            const a = new Notification();
            const b = new Notification();
            expect(instance.sorter(a, b)).toBe(0);
        });
    });

    describe('limit function', () => {
        it('should return true if index is > 5', () => {
            expect(instance.filter(new Notification(), 4)).toBe(true);
        });
        it('should return true if index is <= 5', () => {
            expect(instance.filter(new Notification(), 5)).toBe(false);
        });
        it('should return -1 if the first parameter was created first', () => {
            const a = new Notification();
            const b = new Notification();
            a.createdAt = Date.now() + 1;
            expect(instance.sorter(a, b)).toBe(1);
        });
        it('should return -1 if the first parameter was created first', () => {
            const a = new Notification();
            const b = new Notification();
            expect(instance.sorter(a, b)).toBe(0);
        });
    });
});
