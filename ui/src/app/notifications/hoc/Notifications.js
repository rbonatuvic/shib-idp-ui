import React from "react";
import { uuid } from '../../core/utility/uuid';

const NotificationContext = React.createContext();

const { Provider, Consumer } = NotificationContext;

const initialState = {
    notifications: []
};

export const NotificationActions = {
    ADD_NOTIFICATION: 'add notification',
    REMOVE_NOTIFICATION: 'remove notification'
};

export const NotificationTypes = {
    SUCCESS: 'success',
    DANGER: 'danger',
    ERROR: 'danger',
    WARNING: 'warn',
    INFO: 'info'
};

export const createNotificationAction = (body, type = NotificationTypes.SUCCESS, timeout=20000) => {
    return {
        type: NotificationActions.ADD_NOTIFICATION,
        payload: {
            id: uuid(),
            type,
            body,
            timeout
        }
    }
}

export const removeNotificationAction = (id) => {
    return {
        type: NotificationActions.REMOVE_NOTIFICATION,
        payload: id
    }
}

function reducer(state, action) {
    switch (action.type) {
        case NotificationActions.ADD_NOTIFICATION:
            return {
                notifications: [
                    ...state.notifications,
                    {
                        ...action.payload
                    }
                ]
            };
        case NotificationActions.REMOVE_NOTIFICATION:
            return {
                notifications: [
                    ...state.notifications.filter(n => n.id !== action.payload)
                ]
            };
        default:
            throw new Error();
    }
}

/*eslint-disable react-hooks/exhaustive-deps*/
function Notifications ({ children }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <Provider value={contextValue}>{children}</Provider>
    );
}

export {
    Notifications,
    NotificationContext,
    Provider as NotificationProvider,
    Consumer as NotificationConsumer
};