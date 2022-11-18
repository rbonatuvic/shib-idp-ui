import React, { Fragment, useMemo } from 'react';
import { useHistory } from 'react-router';
import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';

import {
    useDeleteDynamicRegistrationMutation,
    useApproveDynamicRegistrationMutation,
    useEnableDynamicRegistrationMutation,
    useChangeDynamicRegistrationGroupMutation,
} from '../../store/dynamic-registration/DynamicRegistrationSlice';

export function DynamicRegistrationActions ({ children }) {

    const history = useHistory();

    const [remove, {isSuccess: isDeleteSuccess}] = useDeleteDynamicRegistrationMutation();
    const [approve] = useApproveDynamicRegistrationMutation();
    const [enable] = useEnableDynamicRegistrationMutation();
    const [changeGroup] = useChangeDynamicRegistrationGroupMutation();


    const api = useMemo(() => ({
        remove,
        approve,
        enable,
        changeGroup
    }), [remove, approve, enable, changeGroup]);

    React.useEffect(() => {
        if (isDeleteSuccess) {
            history.push('/dashboard/dynamic-registration');
        }
    }, [isDeleteSuccess, history]);

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