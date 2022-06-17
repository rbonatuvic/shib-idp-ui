import React from 'react';
import { Redirect } from 'react-router-dom';

import { useIsAdmin } from '../user/UserContext';

export function ProtectRoute({ children, redirectTo, ...rest }) {
    const isAdmin = useIsAdmin();
    return isAdmin ? children : <Redirect to={redirectTo} />;
}