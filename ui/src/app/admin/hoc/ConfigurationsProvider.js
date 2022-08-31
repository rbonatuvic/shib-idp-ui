import React from 'react';
import { useConfigurations } from '../hooks';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';

export function ConfigurationsProvider({ children, cache = 'no-cache' }) {

    const [configurations, setConfigurations] = React.useState([]);

    const notifier = useNotificationDispatcher();
    const translator = useTranslator();

    const { get, del, response, loading } = useConfigurations({
        cachePolicy: cache
    });

    async function loadConfigurations() {
        const list = await get(`shib/property/set`);
        if (response.ok) {
            setConfigurations(list);
        }
    }

    async function removeConfiguration(id) {
        let toast;
        const resp = await del(`shib/property/set/${id}`);
        if (response.ok) {
            loadConfigurations();
            toast = createNotificationAction(`Deleted property successfully.`, NotificationTypes.SUCCESS);
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadConfigurations() }, []);

    return (<>{children(configurations, removeConfiguration, loading)}</>);
}