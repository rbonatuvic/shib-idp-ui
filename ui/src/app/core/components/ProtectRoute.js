import { isUndefined } from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { useCurrentUser, useIsAdmin } from '../user/UserContext';

export function ProtectRoute({ children, redirectTo, ...rest }) {
    const user = useCurrentUser();
    const isAdmin = useIsAdmin();
    if (isUndefined(user?.role)) {
        return <></>
    }
    return isAdmin ? children : <Redirect to={redirectTo} />;
}