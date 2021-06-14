import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { NotificationContext, removeNotificationAction } from '../hoc/Notifications';

export function NotificationItem ({ type, body, timeout, id }) {

    const { dispatch } = React.useContext(NotificationContext);

    React.useEffect(() => {
        if (timeout) {
            setTimeout(() => {
                dispatch(removeNotificationAction(id));
            }, timeout);
        }
    }, [timeout, id, dispatch]);

    return (
        <Alert variant={type} onClose={() => dispatch(removeNotificationAction(id))}>
            {body}
        </Alert>
    )
}