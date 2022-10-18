import React from 'react';
import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';
import { useMetadataApprover, useMetadataEntity } from '../../metadata/hooks/api';

import { NotificationContext, createNotificationAction, NotificationTypes } from '../../notifications/hoc/Notifications';

export function ApprovalActions ({type = 'source', children}) {

    const { dispatch } = React.useContext(NotificationContext);

    const { del, response } = useMetadataEntity('source', {
        cachePolicy: 'no-cache'
    });

    const activator = useMetadataApprover('source');

    async function approveEntity(entity, enabled, cb = () => {}) {
        await activator.patch(`${type === 'source' ? entity.id : entity.resourceId}/${enabled ? 'approve' : 'unapprove'}`);
        if (activator?.response.ok) {
            dispatch(createNotificationAction(
                `Metadata ${type} has been ${enabled ? 'approved' : 'unapproved'}.`
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
                <>{children(approveEntity, (id, cb) => block(() => deleteEntity(id, cb)))}</>
            }
        </DeleteConfirmation>
    );
}