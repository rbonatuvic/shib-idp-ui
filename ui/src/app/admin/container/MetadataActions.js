import React from 'react';
import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';
import { useMetadataActivator, useMetadataEntity } from '../../metadata/hooks/api';

import { NotificationContext, createNotificationAction, NotificationTypes } from '../../notifications/hoc/Notifications';

export function MetadataActions ({type, children}) {

    const { dispatch } = React.useContext(NotificationContext);

    const { del, response } = useMetadataEntity(type, {
        cachePolicy: 'no-cache'
    });

    const activator = useMetadataActivator(type);

    async function enableEntity(entity, enabled, cb = () => {}) {
        await activator.patch(`/${type === 'source' ? entity.id : entity.resourceId}/${enabled ? 'enable' : 'disable'}`);
        if (activator?.response.ok) {
            dispatch(createNotificationAction(
                `Metadata ${type} has been ${enabled ? 'enabled' : 'disabled'}.`
            ));
            cb();
        } else {
            const { errorCode, errorMessage, cause } = activator?.response?.data;
            dispatch(createNotificationAction(
                `${errorCode}: ${errorMessage} ${cause ? `-${cause}` : ''}`,
                NotificationTypes.ERROR
            ));
        }
    }

    async function deleteEntity(id, cb = () => {}) {
        await del(`/${id}`);
        if (response.ok) {
            dispatch(createNotificationAction(
                `Metadata ${type} has been deleted.`
            ));
            cb();
        } else {
            const { errorCode, errorMessage, cause } = activator?.response?.data;
            dispatch(createNotificationAction(
                `${errorCode}: ${errorMessage} ${cause ? `-${cause}` : ''}`,
                NotificationTypes.ERROR
            ));
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