import { createAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { reverse } from 'lodash';
import { useSelector } from 'react-redux';
import uniqueId from 'lodash/uniqueId';

const initialState = {
  notifications: []
}

export const NotificationTypes = {
    SUCCESS: 'success',
    DANGER: 'danger',
    ERROR: 'danger',
    WARNING: 'warn',
    INFO: 'info'
};

export const createNotificationAction = createAction('notifications/create', function prepare(body, type = NotificationTypes.SUCCESS, timeout=5000) {
  return {
    payload: {
        body,
        id: uniqueId('notification_'),
        createdAt: new Date().toISOString(),
        type,
        timeout
    },
  }
});

export const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    removeNotification: (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload)
    }
  },
  extraReducers: {
    [createNotificationAction]: (state, action) => {
        state.notifications.push(action.payload)
    }
  }
});

const selectNotificationState = state => state.notification;

export const selectNotifications = createSelector(selectNotificationState, ({notifications}) => reverse([...notifications]));

export function useNotifications() {
  return useSelector(selectNotifications);
}

// Action creators are generated for each case reducer function
export const { removeNotification } = NotificationSlice.actions

export default NotificationSlice.reducer;