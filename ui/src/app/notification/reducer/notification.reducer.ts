import { createSelector } from '@ngrx/store';
import { Notification } from '../model/notification';
import * as actions from '../action/notification.action';

export interface NotificationState {
    notifications: Notification[];
}

export const initialState: NotificationState = {
    notifications: []
};

export function reducer(state = initialState, action: actions.Actions): NotificationState {
    switch (action.type) {
        case actions.ADD_NOTIFICATION: {
            return {
                notifications: [
                    ...state.notifications,
                    action.payload
                ]
            };
        }
        case actions.CLEAR_NOTIFICATION: {
            return {
                notifications: [
                    ...state.notifications.filter(n => n !== action.payload)
                ]
            };
        }
        default: {
            return state;
        }
    }
}

export const getNotifications = (state: NotificationState) => state.notifications;
