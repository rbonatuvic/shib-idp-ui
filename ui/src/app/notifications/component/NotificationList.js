import React from 'react';
import { NotificationItem } from './NotificationItem';

import { useDispatch } from 'react-redux';
import { removeNotification, useNotifications } from '../../store/notifications/NotificationSlice';

export function NotificationList () {

    // const { state, dispatch } = React.useContext(NotificationContext);

    const dispatch = useDispatch();
    const notifications = useNotifications();

    const onRemove = (id) => dispatch(removeNotification(id));

    return (
        <ul className="notification-list list-unstyled position-fixed m-4 w-25">
            {notifications.map((n) => (
                <li key={n.id}>
                    <NotificationItem id={n.id} type={n.type} body={n.body} timeout={n.timeout} onRemove={onRemove} />
                </li>
            ))}
        </ul>
    );
}