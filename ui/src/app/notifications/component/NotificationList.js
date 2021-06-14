import React from 'react';
import { NotificationContext } from '../hoc/Notifications';
import { NotificationItem } from './NotificationItem';

export function NotificationList () {

    const { state } = React.useContext(NotificationContext);

    return (
        <ul className="notification-list list-unstyled position-fixed p-4 w-25">
            {state.notifications.map((n) => (
                <li key={n.id}>
                    <NotificationItem id={n.id} type={n.type} body={n.body} timeout={n.timeout} />
                </li>
            ))}
        </ul>
    );
}