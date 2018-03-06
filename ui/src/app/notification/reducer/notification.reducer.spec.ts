import { reducer } from './notification.reducer';
import * as fromNotifications from './notification.reducer';
import * as notificationActions from '../action/notification.action';
import { Notification } from '../model/notification';

let notifications: Notification[] = [
    new Notification(),
    new Notification()
],
snapshot: fromNotifications.NotificationState = {
    notifications: []
};

describe('Notification Reducer', () => {
    const initialState: fromNotifications.NotificationState = {
        notifications: []
    };

    describe('undefined action', () => {
        it('should return the default state', () => {
            const result = reducer(undefined, {} as any);

            expect(result).toEqual(initialState);
        });
    });

    describe('create notification action', () => {
        it('should update the status when a provider is saved', () => {
            const n = new Notification();
            const action = new notificationActions.AddNotification(n);
            const result = reducer(initialState, action);
            expect(result).toEqual(
                Object.assign({}, initialState, {
                    notifications: [n]
                })
            );
        });
    });

    describe('remove notification action', () => {
        it('should update the status when a provider is saved', () => {
            const n = new Notification();
            const action = new notificationActions.ClearNotification(n);
            const state: fromNotifications.NotificationState = {
                notifications: [n]
            };
            const result = reducer(state, action);
            expect(result).toEqual({notifications: []});
        });
    });

    describe('get notifications selector', () => {
        it('should update the status when a provider is saved', () => {
            const n = new Notification();
            const action = new notificationActions.ClearNotification(n);
            const state: fromNotifications.NotificationState = {
                notifications: [n]
            };
            const result = reducer(state, action);
            expect(fromNotifications.getNotifications(state)).toEqual(state.notifications);
        });
    });
});
