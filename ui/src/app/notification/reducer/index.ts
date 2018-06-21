import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromNotifications from './notification.reducer';
import * as fromRoot from '../../core/reducer';

export interface State extends fromRoot.State {
    notifications: NotificationState;
}

export interface NotificationState {
    notifications: fromNotifications.NotificationState;
}

export const reducers = {
    notifications: fromNotifications.reducer
};

export const getNotificationState = createFeatureSelector<NotificationState>('notifications');
export const getNotificationEntityState = createSelector(getNotificationState, (state: NotificationState) => state.notifications);
export const getNotifications = createSelector(
    getNotificationEntityState,
    (state: fromNotifications.NotificationState) => state.notifications
);
