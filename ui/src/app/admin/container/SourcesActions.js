import React from 'react';
import SourceList from '../../metadata/domain/source/component/SourceList';
import { useMetadataEntity } from '../../metadata/hooks/api';

import { NotificationContext, createNotificationAction } from '../../notifications/hoc/Notifications';

export function SourcesActions ({sources, reloadSources}) {

    const { dispatch } = React.useContext(NotificationContext);

    const { put, del, response } = useMetadataEntity('source', {
        cachePolicy: 'no-cache'
    });

    async function deleteSource(id) {
        await del(`/${id}`);
        if (response.ok) {
            dispatch(createNotificationAction(
                `Metadata Source has been removed.`
            ));
            reloadSources();
        }
    }

    async function enableSource(source) {
        await put(`/${source.id}`, {
            ...source,
            serviceEnabled: true
        });
        if (response.ok) {
            dispatch(createNotificationAction(
                `Metadata Source has been enabled.`
            ));
            reloadSources();
        }
    }

    return (
        <SourceList entities={sources} onDelete={ deleteSource } onEnable={ enableSource } />
    );
}