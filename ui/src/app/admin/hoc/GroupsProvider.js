import React from 'react';
import { useGroups } from '../hooks';
import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useTranslator } from '../../i18n/hooks';
import { useDispatch } from 'react-redux';

export function GroupsProvider({ children, cache = 'no-cache' }) {

    const [groups, setGroups] = React.useState([]);

    const notifier = useDispatch();
    const translator = useTranslator();

    const { get, del, response, loading } = useGroups({
        cachePolicy: cache
    });

    async function loadGroups() {
        const list = await get(``);
        if (response.ok) {
            setGroups(list);
        }
    }

    async function removeGroup(id) {
        let toast;
        const resp = await del(`/${id}`);
        if (response.ok) {
            loadGroups();
            toast = createNotificationAction(`Deleted group successfully.`, NotificationTypes.SUCCESS);
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadGroups() }, []);

    return (<>{children(groups, removeGroup, loading)}</>);
}