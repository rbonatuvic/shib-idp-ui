import React from 'react';
import { NotificationContext, removeNotificationAction } from '../hoc/Notifications';
import { NotificationItem } from './NotificationItem';

export function NotificationList () {

    const { state, dispatch } = React.useContext(NotificationContext);

    const onRemove = (id) => dispatch(removeNotificationAction(id));

    return (
        <ul className="notification-list list-unstyled position-fixed m-4 w-25">
            {state.notifications.map((n) => (
                <li key={n.id}>
                    <NotificationItem id={n.id} type={n.type} body={n.body} timeout={n.timeout} onRemove={onRemove} />
                </li>
            ))}
        </ul>
    );
}