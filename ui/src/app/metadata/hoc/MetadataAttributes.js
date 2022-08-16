import React from 'react';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useMetadataAttribute, useMetadataAttributes } from '../hooks/api';

export function MetadataAttributes ({children}) {

     const dispatch = useNotificationDispatcher();

    const { get, response } = useMetadataAttributes({
        cachePolicy: 'no-cache'
    });

    const attrApi = useMetadataAttribute();

    const { del } = attrApi;

    const [attributes, setAttributes] = React.useState([]);

    async function loadAttributes() {
        const list = await get(``);
        if (response.ok) {
            setAttributes(list);
        }
    }

    async function removeAttribute(id) {
        await del(`/${id}`);
        if (attrApi.response.ok) {
            loadAttributes();
            dispatch(createNotificationAction(`Attribute deleted successfully`, NotificationTypes.SUCCESS, 5000));
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadAttributes() }, []);

    return (<>{children(attributes, removeAttribute)}</>);
}