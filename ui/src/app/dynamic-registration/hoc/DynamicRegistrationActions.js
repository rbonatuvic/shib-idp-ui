import React, { Fragment, useMemo } from 'react';
import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';

import {
    useDeleteDynamicRegistrationMutation,
    useApproveDynamicRegistrationMutation,
    useEnableDynamicRegistrationMutation,
    useChangeDynamicRegistrationGroupMutation,
} from '../../store/dynamic-registration/DynamicRegistrationSlice';

export function DynamicRegistrationActions ({ children }) {

    // const toast = useCallback((message, type) => dispatch(createNotificationAction(message, type)), [dispatch]);

    const [remove] = useDeleteDynamicRegistrationMutation();
    const [approve] = useApproveDynamicRegistrationMutation();
    const [enable] = useEnableDynamicRegistrationMutation();
    const [changeGroup] = useChangeDynamicRegistrationGroupMutation();


    const api = useMemo(() => ({
        remove,
        approve,
        enable,
        changeGroup
    }), [remove, approve, enable, changeGroup]);

    return (
        <DeleteConfirmation title={`message.delete-dynamic-registration-title`} body={`message.delete-dynamic-registration-body`}>
            {(block) =>
                <Fragment>{children({
                    ...api,
                    remove: (id, cb) => block(() => remove(id, cb))
                })}</Fragment>
            }
        </DeleteConfirmation>
        
    )
}