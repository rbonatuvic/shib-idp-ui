import React from 'react';
import { useMetadataApprover } from '../../metadata/hooks/api';

import { NotificationContext, createNotificationAction, NotificationTypes } from '../../notifications/hoc/Notifications';

export function ApprovalActions ({type = 'source', children}) {

    const { dispatch } = React.useContext(NotificationContext);

    const approver = useMetadataApprover('source');

    async function approveEntity(entity, enabled, cb = () => {}) {
        await approver.patch(`${type === 'source' ? entity.id : entity.resourceId}/${enabled ? 'approve' : 'unapprove'}`);
        if (approver?.response.ok) {
            dispatch(createNotificationAction(
                `Metadata ${type} has been ${enabled ? 'approved' : 'unapproved'}.`
            ));
            cb();
        } else {
            const { errorCode, errorMessage, cause } = approver?.response?.data;
            dispatch(createNotificationAction(
                `${errorCode}: ${errorMessage} ${cause ? `-${cause}` : ''}`,
                NotificationTypes.ERROR
            ));
        }
    }

    return (
        <>{children(approveEntity)}</>
    );
}