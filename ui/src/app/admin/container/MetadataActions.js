import React from 'react';
import { DeleteConfirmation } from '../../metadata/component/DeleteConfirmation';
import { useMetadataEntity } from '../../metadata/hooks/api';

import { NotificationContext, createNotificationAction } from '../../notifications/hoc/Notifications';

export function MetadataActions ({type, children}) {

    const { dispatch } = React.useContext(NotificationContext);

    const { del, put, response } = useMetadataEntity(type, {
        cachePolicy: 'no-cache'
    });

    async function enableEntity(entity, enabled, cb = () => {}) {
        await put(`/${type === 'source' ? entity.id : entity.resourceId}`, {
            ...entity,
            [type === 'source' ? 'serviceEnabled' : 'enabled']: enabled
        });
        if (response.ok) {
            dispatch(createNotificationAction(
                `Metadata ${type} has been ${enabled ? 'enabled' : 'disabled'}.`
            ));
            cb();
        }
    }

    async function deleteEntity(id, cb = () => {}) {
        await del(`/${id}`);
        if (response.ok) {
            dispatch(createNotificationAction(
                `Metadata ${type} has been deleted.`
            ));
            cb();
        }
    }

    return (
        <DeleteConfirmation title={`message.delete-${type}-title`} body={`message.delete-${type}-body`}>
            {(block) =>
                <>{children(enableEntity, (id, cb) => block(() => deleteEntity(id, cb)))}</>
            }
        </DeleteConfirmation>
    );
}