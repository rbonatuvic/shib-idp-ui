import React from 'react';
import { useProperties } from '../hooks';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';

export function PropertiesProvider({ children, cache = 'no-cache' }) {

    const [properties, setProperties] = React.useState([]);

    const notifier = useNotificationDispatcher();
    const translator = useTranslator();

    const { get, del, response, loading } = useProperties({
        cachePolicy: cache
    });

    async function loadProperties() {
        const list = await get(`assets/data/properties.json`);
        if (response.ok) {
            setProperties(list);
        }
    }

    async function removeProperty(id) {
        let toast;
        const resp = await del(`/${id}`);
        if (response.ok) {
            loadProperties();
            toast = createNotificationAction(`Deleted property successfully.`, NotificationTypes.SUCCESS);
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadProperties() }, []);

    return (<>{children(properties, removeProperty, loading)}</>);
}