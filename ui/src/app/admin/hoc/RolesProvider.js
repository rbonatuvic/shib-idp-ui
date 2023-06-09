import React from 'react';
import { useRoles } from '../hooks';
import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useTranslator } from '../../i18n/hooks';
import { useDispatch } from 'react-redux';

export function RolesProvider({ children, cache = 'no-cache' }) {

    const [roles, setRoles] = React.useState([]);

    const notifier = useDispatch();
    const translator = useTranslator();

    const { get, del, response, loading } = useRoles({
        cachePolicy: cache
    });

    async function loadRoles() {
        const list = await get(``);
        if (response.ok) {
            setRoles(list);
        }
    }

    async function removeRole(id) {
        let toast;
        const resp = await del(`/${id}`);
        if (response.ok) {
            loadRoles();
            toast = createNotificationAction(`Deleted role successfully.`, NotificationTypes.SUCCESS);
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadRoles() }, []);

    return (<>{children(roles, removeRole, loading)}</>);
}