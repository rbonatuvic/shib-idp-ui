import React, { Fragment, useMemo } from 'react';

import {
    useDeleteDynamicRegistrationMutation,
    useApproveDynamicRegistrationMutation,
    useEnableDynamicRegistrationMutation,
    useChangeDynamicRegistrationGroupMutation,
} from '../../store/dynamic-registration/DynamicRegistrationSlice';

export function DynamicRegistrationActions ({ children }) {

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
        <Fragment>{children(api)}</Fragment>
    )
}